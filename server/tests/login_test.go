package tests

import (
	"context"
	"encoding/json"
	"testing"

	"bou.ke/monkey"
	"github.com/SunPodder/shorty/internal/db"
	"github.com/SunPodder/shorty/internal/handlers"
	"github.com/SunPodder/shorty/utils"
	"github.com/aws/aws-lambda-go/events"
	"github.com/stretchr/testify/assert"
)

func TestLogin_Success(t *testing.T) {
	ctx := context.Background()
	body, _ := json.Marshal(handlers.LoginRequest{Email: "test@example.com", Password: "password"})
	req := events.APIGatewayProxyRequest{Body: string(body)}

	patchGetUserByEmail := monkey.Patch(db.GetUserByEmail, func(context.Context, string) (*db.User, error) {
		return &db.User{ID: "user-id", Email: "test@example.com", Password: "hashed"}, nil
	})
	defer patchGetUserByEmail.Unpatch()

	patchCheckPasswordHash := monkey.Patch(utils.CheckPasswordHash, func(string, string) bool {
		return true
	})
	defer patchCheckPasswordHash.Unpatch()

	patchGenerateJWT := monkey.Patch(utils.GenerateJWT, func(string) (string, error) {
		return "jwt-token", nil
	})
	defer patchGenerateJWT.Unpatch()

	resp, err := handlers.Login(ctx, req)
	assert.NoError(t, err)
	assert.Contains(t, resp.Body, "jwt-token")
	assert.Equal(t, 200, resp.StatusCode)
}

func TestLogin_InvalidBody(t *testing.T) {
	ctx := context.Background()
	req := events.APIGatewayProxyRequest{Body: "not-json"}
	resp, _ := handlers.Login(ctx, req)
	assert.Equal(t, 400, resp.StatusCode)
}

func TestLogin_InvalidPassword(t *testing.T) {
	ctx := context.Background()
	body, _ := json.Marshal(handlers.LoginRequest{Email: "test@example.com", Password: "wrong-password"})
	req := events.APIGatewayProxyRequest{Body: string(body)}

	patchGetUserByEmail := monkey.Patch(db.GetUserByEmail, func(context.Context, string) (*db.User, error) {
		return &db.User{ID: "user-id", Password: "hashed"}, nil
	})
	defer patchGetUserByEmail.Unpatch()

	patchCheckPasswordHash := monkey.Patch(utils.CheckPasswordHash, func(string, string) bool {
		return false // Password check fails
	})
	defer patchCheckPasswordHash.Unpatch()

	resp, _ := handlers.Login(ctx, req)
	assert.Equal(t, 401, resp.StatusCode)
}

func TestLogin_UserNotFound(t *testing.T) {
	ctx := context.Background()
	body, _ := json.Marshal(handlers.LoginRequest{Email: "nonexistent@example.com", Password: "password"})
	req := events.APIGatewayProxyRequest{Body: string(body)}

	patchGetUserByEmail := monkey.Patch(db.GetUserByEmail, func(context.Context, string) (*db.User, error) {
		return nil, db.ErrUserNotFound
	})
	defer patchGetUserByEmail.Unpatch()

	resp, _ := handlers.Login(ctx, req)
	assert.Equal(t, 401, resp.StatusCode)
}
