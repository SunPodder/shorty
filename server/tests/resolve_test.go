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

func TestResolve_Found(t *testing.T) {
	ctx := context.Background()
	request := events.APIGatewayProxyRequest{
		PathParameters: map[string]string{"short_code": "abc123"},
	}
	patchGetURL := monkey.Patch(db.GetURL, func(context.Context, string) (*db.URL, error) {
		return &db.URL{OriginalURL: "https://example.com"}, nil
	})
	defer patchGetURL.Unpatch()

	patchIncrementClicks := monkey.Patch(db.IncrementClicks, func(context.Context, string) error {
		return nil
	})
	defer patchIncrementClicks.Unpatch()

	resp, err := handlers.Resolve(ctx, request)
	assert.NoError(t, err)
	assert.Equal(t, 302, resp.StatusCode)
	assert.Equal(t, "https://example.com", resp.Headers["Location"])
}

func TestResolve_NotFound(t *testing.T) {
	ctx := context.Background()
	request := events.APIGatewayProxyRequest{
		PathParameters: map[string]string{"short_code": "notfound"},
	}
	patchGetURL := monkey.Patch(db.GetURL, func(context.Context, string) (*db.URL, error) {
		return nil, nil
	})
	defer patchGetURL.Unpatch()

	resp, _ := handlers.Resolve(ctx, request)
	assert.Equal(t, 404, resp.StatusCode)
}

func TestResolve_DBError(t *testing.T) {
	ctx := context.Background()
	request := events.APIGatewayProxyRequest{
		PathParameters: map[string]string{"short_code": "abc123"},
	}
	patchGetURL := monkey.Patch(db.GetURL, func(context.Context, string) (*db.URL, error) {
		return nil, assert.AnError // Database error
	})
	defer patchGetURL.Unpatch()

	resp, _ := handlers.Resolve(ctx, request)
	assert.Equal(t, 500, resp.StatusCode)
	assert.Contains(t, resp.Body, "Internal server error")
}

func TestResolve_IncrementClicksError(t *testing.T) {
	ctx := context.Background()
	request := events.APIGatewayProxyRequest{
		PathParameters: map[string]string{"short_code": "abc123"},
	}
	patchGetURL := monkey.Patch(db.GetURL, func(context.Context, string) (*db.URL, error) {
		return &db.URL{OriginalURL: "https://example.com"}, nil
	})
	defer patchGetURL.Unpatch()

	patchIncrementClicks := monkey.Patch(db.IncrementClicks, func(context.Context, string) error {
		return assert.AnError // Error incrementing clicks
	})
	defer patchIncrementClicks.Unpatch()

	resp, _ := handlers.Resolve(ctx, request)
	assert.Equal(t, 500, resp.StatusCode)
}
