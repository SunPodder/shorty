package db

import (
	"context"
	"errors"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

// User represents a user in DynamoDB
type User struct {
	ID        string `dynamodbav:"id,pk"`
	Email     string `dynamodbav:"email"`
	Password  string `dynamodbav:"password"`
	CreatedAt string `dynamodbav:"created_at"`
}

var (
	ErrUserNotFound     = errors.New("user not found")
	DuplicateEmailError = errors.New("duplicate email")
)

// CreateUser creates a new user in DynamoDB
func CreateUser(ctx context.Context, user User) error {
	item, err := attributevalue.MarshalMap(user)
	if err != nil {
		return err
	}

	// check if the email already exists
	existingUser, err := GetUserByEmail(ctx, user.Email)
	if err == nil && existingUser != nil {
		return DuplicateEmailError
	}

	_, err = client.PutItem(ctx, &dynamodb.PutItemInput{
		TableName: aws.String(userTableName),
		Item:      item,
	})
	return err
}

// GetUser retrieves a user by ID
func GetUser(ctx context.Context, id string) (*User, error) {
	key, err := attributevalue.MarshalMap(map[string]string{
		"id": id,
	})
	if err != nil {
		return nil, err
	}

	result, err := client.GetItem(ctx, &dynamodb.GetItemInput{
		TableName: aws.String(userTableName),
		Key:       key,
	})
	if err != nil {
		return nil, err
	}

	if result.Item == nil {
		return nil, ErrUserNotFound
	}

	var user User
	if err := attributevalue.UnmarshalMap(result.Item, &user); err != nil {
		return nil, err
	}

	return &user, nil
}

// GetUserByEmail retrieves a user by email using the email-index GSI
func GetUserByEmail(ctx context.Context, email string) (*User, error) {
	input := &dynamodb.QueryInput{
		TableName:              aws.String(userTableName),
		IndexName:              aws.String("email-index"),
		KeyConditionExpression: aws.String("email = :email"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":email": &types.AttributeValueMemberS{Value: email},
		},
		Limit: aws.Int32(1), // We only need one user since email should be unique
	}

	result, err := client.Query(ctx, input)
	if err != nil {
		return nil, err
	}

	if len(result.Items) == 0 {
		return nil, ErrUserNotFound
	}

	var user User
	if err := attributevalue.UnmarshalMap(result.Items[0], &user); err != nil {
		return nil, err
	}

	return &user, nil
}
