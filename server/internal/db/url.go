package db

import (
	"context"
	"errors"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

var (
	ErrURLNotFound   = errors.New("url not found")
	ErrInvalidUserID = errors.New("invalid user ID")
)

type URL struct {
	ShortCode   string  `dynamodbav:"short_code,pk"`
	OriginalURL string  `dynamodbav:"original_url"`
	UserID      *string `dynamodbav:"user_id,omitempty"`
	ExpiryDate  *int64  `dynamodbav:"expiry_date,omitempty"`
	ViewOnce    *bool   `dynamodbav:"view_once,omitempty"`
	CreatedAt   string  `dynamodbav:"created_at"`
	Clicks      int64   `dynamodbav:"clicks"`
}

// Creates a new URL in DynamoDB
func CreateURL(ctx context.Context, url *URL) error {
	item, err := attributevalue.MarshalMap(url)
	if err != nil {
		return err
	}

	_, err = client.PutItem(ctx, &dynamodb.PutItemInput{
		TableName: aws.String(urlTableName),
		Item:      item,
	})
	return err
}

// Retrieves a URL by its shortcode
// If the URL is not found, it returns ErrURLNotFound
func GetURL(ctx context.Context, shortCode string) (*URL, error) {
	key, err := attributevalue.MarshalMap(map[string]string{
		"short_code": shortCode,
	})
	if err != nil {
		return nil, err
	}

	result, err := client.GetItem(ctx, &dynamodb.GetItemInput{
		TableName: aws.String(urlTableName),
		Key:       key,
	})
	if err != nil {
		return nil, err
	}

	if result.Item == nil {
		return nil, ErrURLNotFound
	}

	var url URL
	if err := attributevalue.UnmarshalMap(result.Item, &url); err != nil {
		return nil, err
	}

	return &url, nil
}

// Retrieves all URLs created by a specific user
func ListUserURLs(ctx context.Context, userID string) ([]URL, error) {
	input := &dynamodb.QueryInput{
		TableName:              aws.String(urlTableName),
		IndexName:              aws.String("user_id-index"),
		KeyConditionExpression: aws.String("user_id = :uid"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":uid": &types.AttributeValueMemberS{Value: userID},
		},
	}

	result, err := client.Query(ctx, input)
	if err != nil {
		return nil, err
	}

	var urls []URL
	if err := attributevalue.UnmarshalListOfMaps(result.Items, &urls); err != nil {
		return nil, err
	}

	return urls, nil
}

// Increments the click count for a URL
func IncrementClicks(ctx context.Context, shortCode string) error {
	input := &dynamodb.UpdateItemInput{
		TableName: aws.String(urlTableName),
		Key: map[string]types.AttributeValue{
			"short_code": &types.AttributeValueMemberS{Value: shortCode},
		},
		UpdateExpression: aws.String("SET clicks = clicks + :inc"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":inc": &types.AttributeValueMemberN{Value: "1"},
		},
	}

	_, err := client.UpdateItem(ctx, input)
	return err
}

// Deletes a URL by its shortcode
func DeleteURL(ctx context.Context, shortCode string) error {
	key, err := attributevalue.MarshalMap(map[string]string{
		"short_code": shortCode,
	})
	if err != nil {
		return err
	}

	_, err = client.DeleteItem(ctx, &dynamodb.DeleteItemInput{
		TableName: aws.String(urlTableName),
		Key:       key,
	})
	return err
}
