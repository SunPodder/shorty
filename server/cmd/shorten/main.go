package main

import (
	"github.com/SunPodder/shorty/internal/db"
	"github.com/SunPodder/shorty/internal/handlers"
	"github.com/aws/aws-lambda-go/lambda"
)

func main() {
	db.InitDynamoDBClient()
	lambda.Start(handlers.Shorten)
}
