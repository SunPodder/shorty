package tests

import (
	"context"
	"encoding/json"
	"testing"

	"bou.ke/monkey"
	"github.com/SunPodder/shorty/internal/db"
	"github.com/SunPodder/shorty/internal/handlers"
	"github.com/aws/aws-lambda-go/events"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
)

func TestShorten_Success(t *testing.T) {
	ctx := context.Background()
	body, _ := json.Marshal(handlers.ShortenRequest{OriginalURL: "https://example.com"})
	request := events.APIGatewayProxyRequest{Body: string(body)}

	// We can't patch the private function directly, but we can patch db.GetURL which it calls
	patchGetURL := monkey.Patch(db.GetURL, func(context.Context, string) (*db.URL, error) {
		return nil, db.ErrURLNotFound // This will make checkIfCodeExists return false
	})
	defer patchGetURL.Unpatch()

	patchCreateURL := monkey.Patch(db.CreateURL, func(context.Context, *db.URL) error {
		return nil
	})
	defer patchCreateURL.Unpatch()

	// Patch the uuid.New function used to generate short codes
	patchUUID := monkey.Patch(uuid.New, func() uuid.UUID {
		u, _ := uuid.Parse("00000000-0000-0000-0000-000000000000") // dummy UUID
		return u
	})

	defer patchUUID.Unpatch()

	resp, err := handlers.Shorten(ctx, request)
	assert.NoError(t, err)
	assert.Equal(t, 200, resp.StatusCode)
}

func TestShorten_InvalidBody(t *testing.T) {
	ctx := context.Background()
	request := events.APIGatewayProxyRequest{Body: "not-json"}
	resp, _ := handlers.Shorten(ctx, request)
	assert.Equal(t, 400, resp.StatusCode)
}

func TestShorten_CustomCodeExists(t *testing.T) {
	ctx := context.Background()
	customCode := "existing"
	body, _ := json.Marshal(handlers.ShortenRequest{
		OriginalURL: "https://example.com",
		CustomCode:  &customCode,
	})
	request := events.APIGatewayProxyRequest{Body: string(body)}

	patchGetURL := monkey.Patch(db.GetURL, func(context.Context, string) (*db.URL, error) {
		return &db.URL{ShortCode: customCode}, nil // Code already exists
	})
	defer patchGetURL.Unpatch()

	resp, _ := handlers.Shorten(ctx, request)
	assert.Equal(t, 400, resp.StatusCode)
	assert.Contains(t, resp.Body, "Custom code already exists")
}

func TestShorten_DBError(t *testing.T) {
	ctx := context.Background()
	body, _ := json.Marshal(handlers.ShortenRequest{OriginalURL: "https://example.com"})
	request := events.APIGatewayProxyRequest{Body: string(body)}

	patchGetURL := monkey.Patch(db.GetURL, func(context.Context, string) (*db.URL, error) {
		return nil, db.ErrURLNotFound
	})
	defer patchGetURL.Unpatch()

	patchCreateURL := monkey.Patch(db.CreateURL, func(context.Context, *db.URL) error {
		return assert.AnError // Simulate DB error
	})
	defer patchCreateURL.Unpatch()

	patchUUID := monkey.Patch(uuid.New, func() uuid.UUID {
		u, _ := uuid.Parse("00000000-0000-0000-0000-000000000000")
		return u
	})
	defer patchUUID.Unpatch()

	resp, _ := handlers.Shorten(ctx, request)
	assert.Equal(t, 500, resp.StatusCode)
	assert.Contains(t, resp.Body, "Failed to create URL")
}
