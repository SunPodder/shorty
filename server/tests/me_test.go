package tests

import (
	"context"
	"testing"

	"bou.ke/monkey"
	"github.com/SunPodder/shorty/internal/db"
	"github.com/SunPodder/shorty/internal/handlers"
	"github.com/aws/aws-lambda-go/events"
	"github.com/stretchr/testify/assert"
)

func TestMe_Success(t *testing.T) {
	ctx := context.Background()
	request := events.APIGatewayProxyRequest{
		RequestContext: events.APIGatewayProxyRequestContext{
			Authorizer: map[string]interface{}{"user_id": "test-user"},
		},
	}

	patchListUserURLs := monkey.Patch(db.ListUserURLs, func(context.Context, string) ([]db.URL, error) {
		return []db.URL{{}, {}}, nil
	})
	defer patchListUserURLs.Unpatch()

	resp, err := handlers.Me(ctx, request)
	assert.NoError(t, err)
	assert.Equal(t, 200, resp.StatusCode)
}

func TestMe_Unauthorized(t *testing.T) {
	ctx := context.Background()
	request := events.APIGatewayProxyRequest{
		RequestContext: events.APIGatewayProxyRequestContext{
			Authorizer: map[string]interface{}{"user_id": ""},
		},
	}
	resp, _ := handlers.Me(ctx, request)
	assert.Equal(t, 400, resp.StatusCode)
}

func TestMe_DBError(t *testing.T) {
	ctx := context.Background()
	request := events.APIGatewayProxyRequest{
		RequestContext: events.APIGatewayProxyRequestContext{
			Authorizer: map[string]interface{}{"user_id": "test-user"},
		},
	}

	patchListUserURLs := monkey.Patch(db.ListUserURLs, func(context.Context, string) ([]db.URL, error) {
		return nil, assert.AnError
	})
	defer patchListUserURLs.Unpatch()

	resp, _ := handlers.Me(ctx, request)
	assert.Equal(t, 500, resp.StatusCode)
	assert.Contains(t, resp.Body, "Internal server error")
}
