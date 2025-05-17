package handler

import (
	"context"
	"encoding/json"
	"log"
	"strings"

	"github.com/SunPodder/shorty/internal/db"
	"github.com/SunPodder/shorty/utils" // Added utils package
	"github.com/aws/aws-lambda-go/events"
)

// Returns the list of URLs for the authenticated user
// throws an error if the user is not authenticated
func Me(context context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	authHeader, ok := request.Headers["Authorization"]
	if !ok {
		authHeader, ok = request.Headers["authorization"]
	}

	if !ok {
		log.Println("Authorization header not found")
		return events.APIGatewayProxyResponse{
			StatusCode: 401,
			Body:       `{"error": "Authorization header missing"}`,
		}, nil
	}

	if !strings.HasPrefix(authHeader, "Bearer ") {
		log.Println("Invalid Authorization header format")
		return events.APIGatewayProxyResponse{
			StatusCode: 401,
			Body:       `{"error": "Invalid Authorization header format"}`,
		}, nil
	}

	tokenString := strings.TrimPrefix(authHeader, "Bearer ")

	userIDString, err := utils.ValidateJWT(tokenString)
	if err != nil {
		log.Printf("Failed to validate JWT: %v", err)
		return events.APIGatewayProxyResponse{
			StatusCode: 401,
			Body:       `{"error": "Invalid or expired token"}`,
		}, nil
	}

	if userIDString == "" {
		log.Println("User ID from JWT is empty")
		return events.APIGatewayProxyResponse{
			StatusCode: 401,
			Body:       `{"error": "User ID not found in token"}`,
		}, nil
	}

	urls, err := db.ListUserURLs(context, userIDString)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       `{"error": "` + err.Error() + `"}`,
		}, nil
	}

	responseBody, err := json.Marshal(urls)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       `{"error": "` + err.Error() + `"}`,
		}, nil
	}
	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       string(responseBody),
	}, nil
}
