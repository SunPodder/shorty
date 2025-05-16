package handlers

import (
	"context"
	"encoding/json"
	"time"

	"github.com/SunPodder/shorty/internal/db"
	"github.com/SunPodder/shorty/utils"
	"github.com/aws/aws-lambda-go/events"
	"github.com/google/uuid"
)

type RegisterRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func Register(context context.Context, event events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var request RegisterRequest
	if err := json.Unmarshal([]byte(event.Body), &request); err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 400,
			Body:       "Invalid request body",
		}, nil
	}

	hashedPassword, err := utils.HashPassword(request.Password)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       `{"error": "Failed to hash password"}`,
		}, nil
	}

	user := db.User{
		ID:        uuid.NewString(),
		Email:     request.Email,
		Password:  hashedPassword,
		CreatedAt: time.Now().Format(time.RFC3339),
	}

	if err := db.CreateUser(context, user); err != nil {
		if err == db.DuplicateEmailError {
			return events.APIGatewayProxyResponse{
				StatusCode: 409,
				Body:       "Email already exists",
			}, nil
		}
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       `{"error": "` + err.Error() + `"}`,
		}, nil
	}

	token, err := utils.GenerateJWT(user.ID)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       `{"error": "Failed to generate token"}`,
		}, nil
	}

	return events.APIGatewayProxyResponse{
		StatusCode: 201,
		Headers: map[string]string{
			"Authorization": "Bearer " + token,
			"Content-Type":  "application/json",
		},
		Body: `{
			"message": "User registered successfully",
			"token": "` + token + `"
		}`,
	}, nil
}
