package handler

import (
	"context"
	"encoding/json"

	"github.com/SunPodder/shorty/internal/db"
	"github.com/aws/aws-lambda-go/events"
)

// Returns the list of URLs for the authenticated user
// throws an error if the user is not authenticated
func Me(context context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	userID := request.RequestContext.Authorizer["user_id"]
	if userID == "" || userID == nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 400,
			Body:       `{"error": "User ID not found"}`,
		}, nil
	}

	urls, err := db.ListUserURLs(context, userID.(string))
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
