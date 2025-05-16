package tests

import (
	"context"
	"testing"

	"bou.ke/monkey"
	"github.com/SunPodder/shorty/internal/handler"
	"github.com/SunPodder/shorty/utils"
	"github.com/aws/aws-lambda-go/events"
	"github.com/stretchr/testify/assert"
)

func TestAuthorize_ValidToken(t *testing.T) {
	event := events.APIGatewayCustomAuthorizerRequest{
		AuthorizationToken: "Bearer valid.jwt.token",
		MethodArn:          "arn:aws:execute-api:region:account-id:api-id/stage/GET/resource",
	}
	patchValidateJWT := monkey.Patch(utils.ValidateJWT, func(token string) (string, error) {
		return "user-id", nil
	})
	defer patchValidateJWT.Unpatch()

	resp, err := handler.Authorize(context.Background(), event)
	assert.NoError(t, err)
	assert.Equal(t, "user-id", resp.PrincipalID)
	assert.Equal(t, "Allow", resp.PolicyDocument.Statement[0].Effect)
}

func TestAuthorize_InvalidToken(t *testing.T) {
	event := events.APIGatewayCustomAuthorizerRequest{
		AuthorizationToken: "Bearer invalid.jwt.token",
		MethodArn:          "arn:aws:execute-api:region:account-id:api-id/stage/GET/resource",
	}
	patchValidateJWT := monkey.Patch(utils.ValidateJWT, func(token string) (string, error) {
		return "", assert.AnError
	})
	defer patchValidateJWT.Unpatch()

	resp, _ := handler.Authorize(context.Background(), event)
	assert.Equal(t, "Deny", resp.PolicyDocument.Statement[0].Effect)
}

func TestAuthorize_MissingToken(t *testing.T) {
	// Test with empty token
	emptyEvent := events.APIGatewayCustomAuthorizerRequest{
		AuthorizationToken: "",
		MethodArn:          "arn:aws:execute-api:region:account-id:api-id/stage/GET/resource",
	}
	resp, _ := handler.Authorize(context.Background(), emptyEvent)
	assert.Equal(t, "Deny", resp.PolicyDocument.Statement[0].Effect)
	assert.Equal(t, "unauthorized", resp.Context["error"])

	// Test with malformed token (no Bearer prefix)
	malformedEvent := events.APIGatewayCustomAuthorizerRequest{
		AuthorizationToken: "malformed.token.no.bearer",
		MethodArn:          "arn:aws:execute-api:region:account-id:api-id/stage/GET/resource",
	}
	resp2, _ := handler.Authorize(context.Background(), malformedEvent)
	assert.Equal(t, "Deny", resp2.PolicyDocument.Statement[0].Effect)
	assert.Equal(t, "unauthorized", resp2.Context["error"])
}
