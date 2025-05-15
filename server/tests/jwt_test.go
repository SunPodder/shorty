package handlers

import (
	"testing"
	"time"

	"github.com/SunPodder/shorty/utils"
	"github.com/golang-jwt/jwt/v5"
)

func TestGenerateJWT(t *testing.T) {
	userID := "test-user-id"
	tokenStr, err := utils.GenerateJWT(userID)
	if err != nil {
		t.Fatalf("generateJWT failed: %v", err)
	}

	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, nil
		}
		return []byte("your-secret-key"), nil
	})
	if err != nil {
		t.Fatalf("JWT parse failed: %v", err)
	}
	if !token.Valid {
		t.Fatal("JWT is not valid")
	}
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		t.Fatal("JWT claims are not MapClaims")
	}
	if claims["sub"] != userID {
		t.Errorf("Expected sub claim %q, got %q", userID, claims["sub"])
	}
	if _, ok := claims["exp"]; !ok {
		t.Error("Missing exp claim")
	}
	if _, ok := claims["iat"]; !ok {
		t.Error("Missing iat claim")
	}
}

func TestValidateJWT(t *testing.T) {
	userID := "test-user-id"
	tokenStr, err := utils.GenerateJWT(userID)
	if err != nil {
		t.Fatalf("generateJWT failed: %v", err)
	}
	parsedID, err := utils.ValidateJWT(tokenStr)
	if err != nil {
		t.Fatalf("validateJWT failed: %v", err)
	}
	if parsedID != userID {
		t.Errorf("Expected userID %q, got %q", userID, parsedID)
	}

	// Test with invalid token
	_, err = utils.ValidateJWT("invalid.token.here")
	if err == nil {
		t.Error("Expected error for invalid token, got nil")
	}

	// Test with expired token
	claims := jwt.MapClaims{
		"sub": userID,
		"exp": time.Now().Add(-time.Hour).Unix(),
		"iat": time.Now().Add(-2 * time.Hour).Unix(),
	}
	expiredToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	expiredStr, _ := expiredToken.SignedString([]byte("your-secret-key"))
	_, err = utils.ValidateJWT(expiredStr)
	if err == nil {
		t.Error("Expected error for expired token, got nil")
	}
}
