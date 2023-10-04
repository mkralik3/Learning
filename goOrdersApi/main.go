package main

import (
	"context"
	"fmt"
	"os"
	"os/signal"

	"github.com/mkralik3/Learning/goOrdersApi/application"
)

func main() {
	app := application.New()

	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt)
	defer cancel()

	err := app.Start(ctx)

	if err != nil {
		fmt.Println("failed to start app:", err)
	}
}
