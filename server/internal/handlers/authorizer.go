package handlers

import (
	"context"
	"log"
	"strings"

	"github.com/SunPodder/shorty/utils"
	"github.com/aws/aws-lambda-go/events"
)

func Authorize(context context.Context, event events.APIGatewayCustomAuthorizerRequest) (events.APIGatewayCustomAuthorizerResponse, error) {

	log.Println("Authorizer invoked")
	log.Printf("Event: %+v\n", event)
	token := event.AuthorizationToken
	if token == "" || !strings.HasPrefix(token, "Bearer ") {
		return denyPolicy("unauthorized"), nil
	}

	jwt := strings.TrimPrefix(token, "Bearer ")

	userID, err := utils.ValidateJWT(jwt)
	if err != nil {
		return denyPolicy("invalid token"), nil
	}
	return allowPolicy(event, userID), nil
}

func allowPolicy(event events.APIGatewayCustomAuthorizerRequest, userID string) events.APIGatewayCustomAuthorizerResponse {
	return events.APIGatewayCustomAuthorizerResponse{
		PrincipalID: userID,
		PolicyDocument: events.APIGatewayCustomAuthorizerPolicy{
			Version: "2012-10-17",
			Statement: []events.IAMPolicyStatement{
				{
					Action:   []string{"execute-api:Invoke"},
					Effect:   "Allow",
					Resource: []string{event.MethodArn},
				},
			},
		},
		Context: map[string]interface{}{
			"user_id": userID,
			"role":    "user",
		},
	}
}

func denyPolicy(reason string) events.APIGatewayCustomAuthorizerResponse {
	return events.APIGatewayCustomAuthorizerResponse{
		PrincipalID: "user",
		PolicyDocument: events.APIGatewayCustomAuthorizerPolicy{
			Version: "2012-10-17",
			Statement: []events.IAMPolicyStatement{
				{
					Action:   []string{"execute-api:Invoke"},
					Effect:   "Deny",
					Resource: []string{"*"},
				},
			},
		},
		Context: map[string]interface{}{
			"error": reason,
		},
	}
}
