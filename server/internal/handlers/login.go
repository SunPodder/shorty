package handlers

import (
	"context"
	"encoding/json"

	"github.com/SunPodder/shorty/internal/db"
	"github.com/SunPodder/shorty/utils"
	"github.com/aws/aws-lambda-go/events"
)

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func Login(context context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// Parse the request body
	var req LoginRequest
	if err := json.Unmarshal([]byte(request.Body), &req); err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 400,
			Body:       "Invalid request body",
		}, nil
	}

	// Validate the user credentials
	user, err := db.GetUserByEmail(context, req.Email)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 401,
			Body:       "Invalid email or password",
		}, nil
	}

	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       "Internal server error",
		}, nil
	}

	if hashedPassword != user.Password {
		return events.APIGatewayProxyResponse{
			StatusCode: 401,
			Body:       "Invalid email or password",
		}, nil
	}

	// Generate JWT token
	token, err := utils.GenerateJWT(user.ID)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       "Failed to generate token",
		}, nil
	}

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Headers: map[string]string{
			"Content-Type":  "application/json",
			"Authorization": "Bearer " + token,
		},
		Body: `{"message": "Login successful", "token": "` + token + `"}`,
	}, nil
}
