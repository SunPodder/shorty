package handlers

import (
	"context"
	"encoding/json"

	"github.com/SunPodder/shorty/internal/db"
	"github.com/aws/aws-lambda-go/events"
)

// Returns the list of URLs for the authenticated user
// throws an error if the user is not authenticated
func Me(context context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	userID := request.RequestContext.Authorizer["user_id"].(string)
	if userID == "" {
		return events.APIGatewayProxyResponse{
			StatusCode: 400,
			Body:       "Unauthorized",
		}, nil
	}

	urls, err := db.ListUserURLs(context, userID)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       "Internal server error",
		}, nil
	}
	responseBody, err := json.Marshal(urls)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       "Internal server error",
		}, nil
	}
	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       string(responseBody),
	}, nil
}
