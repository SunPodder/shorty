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

type ShortenRequest struct {
	OriginalURL string  `json:"original_url"`
	ExpiryDate  *int64  `json:"expiry_date,omitempty"`
	ViewOnce    *bool   `json:"view_once,omitempty"`
	Token       *string `json:"token,omitempty"`
	CustomCode  *string `json:"custom_code,omitempty"`
}

func Shorten(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {

	var req ShortenRequest
	if err := json.Unmarshal([]byte(request.Body), &req); err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 400,
			Body:       "Invalid request body",
		}, nil

	}

	// Generate a short code
	var shortCode string
	if req.CustomCode != nil && *req.CustomCode != "" {
		// Check if the custom code already exists
		exists, err := checkIfCodeExists(ctx, *req.CustomCode)
		if err != nil {
			return events.APIGatewayProxyResponse{
				StatusCode: 500,
				Body:       "Internal server error",
			}, nil
		}
		if exists {
			return events.APIGatewayProxyResponse{
				StatusCode: 400,
				Body:       "Custom code already exists",
			}, nil
		}
		shortCode = *req.CustomCode
	} else {
		shortCode = uuid.New().String()[:6]
	}

	var userId *string

	if req.Token != nil {
		var err error
		userId, err = utils.ValidateJWT(*req.Token)
		if err != nil {
			userId = nil
		}
	}

	url := db.URL{
		ShortCode:   shortCode,
		OriginalURL: req.OriginalURL,
		ExpiryDate:  req.ExpiryDate,
		ViewOnce:    req.ViewOnce,
		UserID:      userId,
		Clicks:      0,
		CreatedAt:   time.Now().Format(time.RFC3339),
	}

	if db.CreateURL(ctx, &url) != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       "Failed to create URL",
		}, nil
	}

	responseBody, err := json.Marshal(url)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: 500,
			Body:       "Failed to marshal response",
		}, nil
	}
	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       string(responseBody),
	}, nil
}

// Checks if a given short code already exists in the database
func checkIfCodeExists(ctx context.Context, code string) (bool, error) {
	_, err := db.GetURL(ctx, code)
	if err != nil && err == db.ErrURLNotFound {
		return false, nil
	}
	if err == nil {
		return true, nil
	}
	return false, err
}
