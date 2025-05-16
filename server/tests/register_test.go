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

func TestRegister_Success(t *testing.T) {
	ctx := context.Background()
	body, _ := json.Marshal(handlers.RegisterRequest{Email: "test@example.com", Password: "password"})
	req := events.APIGatewayProxyRequest{Body: string(body)}

	patchHash := monkey.Patch(utils.HashPassword, func(string) (string, error) {
		return "hashed", nil
	})
	defer patchHash.Unpatch()

	patchCreateUser := monkey.Patch(db.CreateUser, func(context.Context, db.User) error {
		return nil
	})
	defer patchCreateUser.Unpatch()

	patchGenerateJWT := monkey.Patch(utils.GenerateJWT, func(string) (string, error) {
		return "jwt-token", nil
	})
	defer patchGenerateJWT.Unpatch()

	resp, err := handlers.Register(ctx, req)
	assert.NoError(t, err)
	assert.Equal(t, 201, resp.StatusCode)
}

func TestRegister_InvalidBody(t *testing.T) {
	ctx := context.Background()
	req := events.APIGatewayProxyRequest{Body: "not-json"}
	resp, _ := handlers.Register(ctx, req)
	assert.Equal(t, 400, resp.StatusCode)
}

func TestRegister_DuplicateEmail(t *testing.T) {
	ctx := context.Background()
	body, _ := json.Marshal(handlers.RegisterRequest{Email: "existing@example.com", Password: "password"})
	req := events.APIGatewayProxyRequest{Body: string(body)}

	patchHash := monkey.Patch(utils.HashPassword, func(string) (string, error) {
		return "hashed", nil
	})
	defer patchHash.Unpatch()

	patchCreateUser := monkey.Patch(db.CreateUser, func(context.Context, db.User) error {
		return db.DuplicateEmailError
	})
	defer patchCreateUser.Unpatch()

	resp, _ := handlers.Register(ctx, req)
	assert.Equal(t, 409, resp.StatusCode)
}
