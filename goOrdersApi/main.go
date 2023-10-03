package main

import (
	"context"
	"fmt"

	"github.com/mkralik3/Learning/goOrdersApi/application"
)

func main() {
	app := application.New()

	err := app.Start(context.TODO())

	if err != nil {
		fmt.Println("failed to start app:", err)
	}

}
