package main

import (
	"github.com/SunPodder/shorty/internal/db"
	"github.com/SunPodder/shorty/internal/handler"
	"github.com/SunPodder/shorty/internal/middleware"
	"github.com/aws/aws-lambda-go/lambda"
)

func main() {
	db.InitDynamoDBClient()
	lambda.Start(middleware.WithCORS(handler.Shorten))
}
