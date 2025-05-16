package handler

import (
	"context"

	"github.com/SunPodder/shorty/internal/db"
	"github.com/aws/aws-lambda-go/events"
)

func Resolve(context context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	shortCode := request.PathParameters["short_code"]

	url, err := db.GetURL(context, shortCode)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       `{"error": "` + err.Error() + `"}`,
		}, nil
	}

	if url == nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 404,
			Body:       "URL not found",
		}, nil
	}

	// Increment the click count
	err = db.IncrementClicks(context, shortCode)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       `{"error": "` + err.Error() + `"}`,
		}, nil
	}

	return events.APIGatewayProxyResponse{
		StatusCode: 302,
		Headers: map[string]string{
			"Location": url.OriginalURL,
		},
	}, nil

}
