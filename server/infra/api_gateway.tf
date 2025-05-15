data "aws_region" "current" {}

resource "aws_api_gateway_rest_api" "shorty_api" {
  name        = "shorty-api"
  description = "API Gateway for Shorty URL service"
}

resource "aws_api_gateway_resource" "me" {
  rest_api_id = aws_api_gateway_rest_api.shorty_api.id
  parent_id   = aws_api_gateway_rest_api.shorty_api.root_resource_id
  path_part   = "me"
}
resource "aws_api_gateway_resource" "shorten" {
  rest_api_id = aws_api_gateway_rest_api.shorty_api.id
  parent_id   = aws_api_gateway_rest_api.shorty_api.root_resource_id
  path_part   = "new"
}
resource "aws_api_gateway_resource" "login" {
  rest_api_id = aws_api_gateway_rest_api.shorty_api.id
  parent_id   = aws_api_gateway_rest_api.shorty_api.root_resource_id
  path_part   = "login"
}
resource "aws_api_gateway_resource" "register" {
  rest_api_id = aws_api_gateway_rest_api.shorty_api.id
  parent_id   = aws_api_gateway_rest_api.shorty_api.root_resource_id
  path_part   = "signup"
}
resource "aws_api_gateway_resource" "resolve" {
  rest_api_id = aws_api_gateway_rest_api.shorty_api.id
  parent_id   = aws_api_gateway_rest_api.shorty_api.root_resource_id
  path_part   = "{short_code}"
}

resource "aws_api_gateway_authorizer" "shorty_authorizer" {
  name                    = "shorty-authorizer"
  rest_api_id             = aws_api_gateway_rest_api.shorty_api.id
  authorizer_uri          = "arn:aws:apigateway:${data.aws_region.current.name}:lambda:path/2015-03-31/functions/${aws_lambda_function.authorizer.arn}/invocations"
  authorizer_result_ttl_in_seconds = 300
  type                    = "TOKEN"
  identity_source         = "method.request.header.Authorization"
}

resource "aws_api_gateway_method" "me_get" {
  rest_api_id   = aws_api_gateway_rest_api.shorty_api.id
  resource_id   = aws_api_gateway_resource.me.id
  http_method   = "GET"
  authorization = "CUSTOM"
  authorizer_id = aws_api_gateway_authorizer.shorty_authorizer.id
}
resource "aws_api_gateway_integration" "me_get" {
  rest_api_id             = aws_api_gateway_rest_api.shorty_api.id
  resource_id             = aws_api_gateway_resource.me.id
  http_method             = aws_api_gateway_method.me_get.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.me.invoke_arn
}

resource "aws_api_gateway_method" "shorten_post" {
  rest_api_id   = aws_api_gateway_rest_api.shorty_api.id
  resource_id   = aws_api_gateway_resource.shorten.id
  http_method   = "POST"
  authorization = "NONE"
}
resource "aws_api_gateway_integration" "shorten_post" {
  rest_api_id             = aws_api_gateway_rest_api.shorty_api.id
  resource_id             = aws_api_gateway_resource.shorten.id
  http_method             = aws_api_gateway_method.shorten_post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.shorten.invoke_arn
}

resource "aws_api_gateway_method" "login_post" {
  rest_api_id   = aws_api_gateway_rest_api.shorty_api.id
  resource_id   = aws_api_gateway_resource.login.id
  http_method   = "POST"
  authorization = "NONE"
}
resource "aws_api_gateway_integration" "login_post" {
  rest_api_id             = aws_api_gateway_rest_api.shorty_api.id
  resource_id             = aws_api_gateway_resource.login.id
  http_method             = aws_api_gateway_method.login_post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.login.invoke_arn
}

resource "aws_api_gateway_method" "register_post" {
  rest_api_id   = aws_api_gateway_rest_api.shorty_api.id
  resource_id   = aws_api_gateway_resource.register.id
  http_method   = "POST"
  authorization = "NONE"
}
resource "aws_api_gateway_integration" "register_post" {
  rest_api_id             = aws_api_gateway_rest_api.shorty_api.id
  resource_id             = aws_api_gateway_resource.register.id
  http_method             = aws_api_gateway_method.register_post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.register.invoke_arn
}

resource "aws_api_gateway_method" "resolve_get" {
  rest_api_id   = aws_api_gateway_rest_api.shorty_api.id
  resource_id   = aws_api_gateway_resource.resolve.id
  http_method   = "GET"
  authorization = "NONE"
}
resource "aws_api_gateway_integration" "resolve_get" {
  rest_api_id             = aws_api_gateway_rest_api.shorty_api.id
  resource_id             = aws_api_gateway_resource.resolve.id
  http_method             = aws_api_gateway_method.resolve_get.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.resolve.invoke_arn
}

resource "aws_lambda_permission" "authorizer" {
  statement_id  = "AllowExecutionFromAPIGatewayAuthorizer"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.authorizer.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.shorty_api.execution_arn}/*/*"
}
resource "aws_lambda_permission" "me" {
  statement_id  = "AllowExecutionFromAPIGatewayMe"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.me.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.shorty_api.execution_arn}/*/*"
}
resource "aws_lambda_permission" "shorten" {
  statement_id  = "AllowExecutionFromAPIGatewayShorten"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.shorten.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.shorty_api.execution_arn}/*/*"
}
resource "aws_lambda_permission" "login" {
  statement_id  = "AllowExecutionFromAPIGatewayLogin"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.login.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.shorty_api.execution_arn}/*/*"
}
resource "aws_lambda_permission" "register" {
  statement_id  = "AllowExecutionFromAPIGatewayRegister"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.register.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.shorty_api.execution_arn}/*/*"
}
resource "aws_lambda_permission" "resolve" {
  statement_id  = "AllowExecutionFromAPIGatewayResolve"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.resolve.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.shorty_api.execution_arn}/*/*"
}

resource "aws_api_gateway_deployment" "shorty_api" {
  depends_on = [
    aws_api_gateway_integration.me_get,
    aws_api_gateway_integration.shorten_post,
    aws_api_gateway_integration.login_post,
    aws_api_gateway_integration.register_post,
    aws_api_gateway_integration.resolve_get
  ]
  rest_api_id = aws_api_gateway_rest_api.shorty_api.id
}

resource "aws_api_gateway_stage" "dev" {
  rest_api_id = aws_api_gateway_rest_api.shorty_api.id
  deployment_id = aws_api_gateway_deployment.shorty_api.id
  stage_name = "dev"
}
