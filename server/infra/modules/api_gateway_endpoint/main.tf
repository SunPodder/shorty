resource "aws_api_gateway_resource" "endpoint_resource" {
  rest_api_id = var.rest_api_id
  parent_id   = var.root_resource_id
  path_part   = var.path_part
}

resource "aws_api_gateway_method" "endpoint_method" {
  rest_api_id   = var.rest_api_id
  resource_id   = aws_api_gateway_resource.endpoint_resource.id
  http_method   = var.http_method
  authorization = var.authorization_type
  authorizer_id = var.authorization_type == "CUSTOM" ? var.authorizer_id : null
}

resource "aws_api_gateway_integration" "endpoint_integration" {
  rest_api_id             = var.rest_api_id
  resource_id             = aws_api_gateway_resource.endpoint_resource.id
  http_method             = aws_api_gateway_method.endpoint_method.http_method
  integration_http_method = "POST" # Assuming all backend Lambdas are invoked via POST
  type                    = "AWS_PROXY"
  uri                     = var.lambda_invoke_arn
  passthrough_behavior    = var.path_part == "{short_code}" ? "WHEN_NO_MATCH" : null # Specific for resolve endpoint
}

resource "aws_lambda_permission" "api_gateway_permission" {
  statement_id  = "AllowExecutionFromAPIGateway_${var.endpoint_name}"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:apigateway:${data.aws_region.current.name}::/restapis/${var.rest_api_id}/stages/*/${var.http_method}${aws_api_gateway_resource.endpoint_resource.path}"
}

resource "aws_api_gateway_method" "options_method" {
  count = var.enable_cors ? 1 : 0

  rest_api_id   = var.rest_api_id
  resource_id   = aws_api_gateway_resource.endpoint_resource.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "options_integration" {
  count = var.enable_cors ? 1 : 0

  rest_api_id = var.rest_api_id
  resource_id = aws_api_gateway_resource.endpoint_resource.id
  http_method = aws_api_gateway_method.options_method[0].http_method
  type        = "MOCK"

  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_method_response" "options_200" {
  count = var.enable_cors ? 1 : 0

  rest_api_id = var.rest_api_id
  resource_id = aws_api_gateway_resource.endpoint_resource.id
  http_method = aws_api_gateway_method.options_method[0].http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true,
    "method.response.header.Access-Control-Allow-Methods" = true,
    "method.response.header.Access-Control-Allow-Origin"  = true,
    "method.response.header.Access-Control-Allow-Credentials" = true
  }
}

resource "aws_api_gateway_integration_response" "options_integration_response" {
  count = var.enable_cors ? 1 : 0

  rest_api_id = var.rest_api_id
  resource_id = aws_api_gateway_resource.endpoint_resource.id
  http_method = aws_api_gateway_method.options_method[0].http_method
  status_code = aws_api_gateway_method_response.options_200[0].status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
    "method.response.header.Access-Control-Allow-Methods" = "'${var.http_method},OPTIONS'", # Or a more comprehensive list like 'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'
    "method.response.header.Access-Control-Allow-Origin"  = "'*'",
    "method.response.header.Access-Control-Allow-Credentials" = "'true'"
  }

  response_templates = {
    "application/json" = ""
  }

  depends_on = [aws_api_gateway_method.options_method[0]]
}

data "aws_region" "current" {}
