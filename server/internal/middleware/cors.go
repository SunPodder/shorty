package middleware

import (
	"context"

	"github.com/aws/aws-lambda-go/events"
)

type HandlerFunc func(context.Context, events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error)

func WithCORS(next HandlerFunc) HandlerFunc {
	return func(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
		// Handle OPTIONS preflight
		if req.HTTPMethod == "OPTIONS" {
			return events.APIGatewayProxyResponse{
				StatusCode: 200,
				Headers: map[string]string{
					"Access-Control-Allow-Origin":  "*",
					"Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
					"Access-Control-Allow-Headers": "Content-Type,Authorization",
				},
			}, nil
		}

		// Call the actual handler
		resp, err := next(ctx, req)

		// Inject CORS headers
		if resp.Headers == nil {
			resp.Headers = make(map[string]string)
		}
		resp.Headers["Access-Control-Allow-Origin"] = "*"
		resp.Headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
		resp.Headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"

		return resp, err
	}
}
