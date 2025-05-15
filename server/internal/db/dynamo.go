package db

import (
	"context"
	"sync"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

const (
	urlTableName  = "shorty_urls"
	userTableName = "shorty_users"
)

var (
	client *dynamodb.Client
	once   sync.Once
)

func InitDynamoDBClient() {
	once.Do(func() {
		cfg, err := config.LoadDefaultConfig(context.TODO())
		if err != nil {
			panic("unable to load SDK config, " + err.Error())
		}
		client = dynamodb.NewFromConfig(cfg)
	})
}
