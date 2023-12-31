package order

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"

	"github.com/mkralik3/Learning/goOrdersApi/model"
	"github.com/mkralik3/Learning/goOrdersApi/handler"
	"github.com/redis/go-redis/v9"
)

type RedisRepo struct {
	Client *redis.Client
}

func orderIDKey(id uint64) string {
	return fmt.Sprintf("order:%d", id)
}

func (r *RedisRepo) Insert(ctx context.Context, order model.Order) error {
	data, err := json.Marshal(order)
	if err != nil {
		return fmt.Errorf("failed to encode order: %w", err)
	}

	tx := r.Client.TxPipeline()

	key := orderIDKey(order.OrderID)
	res := tx.SetNX(ctx, key, string(data), 0)
	if err := res.Err(); err != nil {
		tx.Discard()
		return fmt.Errorf("failed to set: %w", err)
	}

	if err := tx.SAdd(ctx, "orders", key).Err(); err != nil {
		tx.Discard()
		return fmt.Errorf("failed to add to orders set: %w", err)
	}

	if _, err := tx.Exec(ctx); err != nil {
		return fmt.Errorf("failed to exec transaction: %w", err)
	}
	return nil
}


func (r *RedisRepo) FindById(ctx context.Context, id uint64) (model.Order, error) {
	key := orderIDKey(id)

	value, err := r.Client.Get(ctx, key).Result()
	if errors.Is(err, redis.Nil) {
		return model.Order{}, handler.ErrNotExist
	} else if err != nil {
		return model.Order{}, fmt.Errorf("get order error: %w", err)
	}

	var order model.Order
	err = json.Unmarshal([]byte(value), &order)
	if err != nil {
		return model.Order{}, fmt.Errorf("failed to decode order json: %w", err)
	}

	return order, nil
}

func (r *RedisRepo) DeleteById(ctx context.Context, id uint64) error {
	key := orderIDKey(id)

	tx := r.Client.TxPipeline()

	err := tx.Del(ctx, key).Err()
	if errors.Is(err, redis.Nil) {
		tx.Discard()
		return handler.ErrNotExist
	} else if err != nil {
		tx.Discard()
		return fmt.Errorf("delete order error: %w", err)
	}

	if err := tx.SRem(ctx, "orders", key).Err(); err != nil {
		tx.Discard()
		return fmt.Errorf("failed to remove from orders set: %w", err)
	}

	if _, err := tx.Exec(ctx); err != nil {
		return fmt.Errorf("failed to exec transaction: %w", err)
	}
	return nil
}

func (r *RedisRepo) Update(ctx context.Context, order model.Order) error {
	data, err := json.Marshal(order)
	if err != nil {
		return fmt.Errorf("failed to encode order: %w", err)
	}

	key := orderIDKey(order.OrderID)

	err = r.Client.SetXX(ctx, key, string(data), 0).Err()
	if errors.Is(err, redis.Nil) {
		return handler.ErrNotExist
	} else if err != nil {
		return fmt.Errorf("update order error: %w", err)
	}
	return nil
}

func (r *RedisRepo) FindAll(ctx context.Context, page handler.FindAllPage) (handler.FindResult, error) {
	res := r.Client.SScan(ctx, "orders", page.Offset, "*", int64(page.Size))
		
	keys, cursor, err := res.Result()

	if err != nil {
		return handler.FindResult{}, fmt.Errorf("failed to get order ids: %w", err)
	}

	if len(keys) == 0 {
		return handler.FindResult{
			Orders: []model.Order{},
		}, nil
	}

	xs, err := r.Client.MGet(ctx, keys...).Result()
	if err != nil {
		return handler.FindResult{}, fmt.Errorf("failed to get orders: %w", err)
	}

	fmt.Printf("[debug] mkralik, len: %d \n", len(xs))

	orders := make([]model.Order, len(xs))

	for i, x:= range xs {
		x := x.(string)
		var order model.Order

		err := json.Unmarshal([]byte(x), &order)
		if err != nil {
			return handler.FindResult{}, fmt.Errorf("failed to decode order json: %w", err)
		}

		orders[i] = order
	}

	return handler.FindResult{
		Orders: orders,
		Cursor: cursor,
	}, nil
}
