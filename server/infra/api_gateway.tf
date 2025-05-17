data "aws_region" "current" {}

resource "aws_api_gateway_rest_api" "shorty_api" {
  name        = "shorty-api"
  description = "API Gateway for Shorty URL service"
}

module "me_endpoint" {
  source = "./modules/api_gateway_endpoint"

  endpoint_name        = "me"
  path_part            = "me"
  http_method          = "GET"
  lambda_function_name = aws_lambda_function.me.function_name
  lambda_invoke_arn    = aws_lambda_function.me.invoke_arn
  lambda_function_arn  = aws_lambda_function.me.arn
  rest_api_id          = aws_api_gateway_rest_api.shorty_api.id
  root_resource_id     = aws_api_gateway_rest_api.shorty_api.root_resource_id
  authorization_type   = "NONE"
  enable_cors          = true
}

module "shorten_endpoint" {
  source = "./modules/api_gateway_endpoint"

  endpoint_name        = "shorten"
  path_part            = "new"
  http_method          = "POST"
  lambda_function_name = aws_lambda_function.shorten.function_name
  lambda_invoke_arn    = aws_lambda_function.shorten.invoke_arn
  lambda_function_arn  = aws_lambda_function.shorten.arn
  rest_api_id          = aws_api_gateway_rest_api.shorty_api.id
  root_resource_id     = aws_api_gateway_rest_api.shorty_api.root_resource_id
  authorization_type   = "NONE"
  enable_cors          = true
}

module "login_endpoint" {
  source = "./modules/api_gateway_endpoint"

  endpoint_name        = "login"
  path_part            = "login"
  http_method          = "POST"
  lambda_function_name = aws_lambda_function.login.function_name
  lambda_invoke_arn    = aws_lambda_function.login.invoke_arn
  lambda_function_arn  = aws_lambda_function.login.arn
  rest_api_id          = aws_api_gateway_rest_api.shorty_api.id
  root_resource_id     = aws_api_gateway_rest_api.shorty_api.root_resource_id
  authorization_type   = "NONE"
  enable_cors          = true
}

module "register_endpoint" {
  source = "./modules/api_gateway_endpoint"

  endpoint_name        = "register"
  path_part            = "register"
  http_method          = "POST"
  lambda_function_name = aws_lambda_function.register.function_name
  lambda_invoke_arn    = aws_lambda_function.register.invoke_arn
  lambda_function_arn  = aws_lambda_function.register.arn
  rest_api_id          = aws_api_gateway_rest_api.shorty_api.id
  root_resource_id     = aws_api_gateway_rest_api.shorty_api.root_resource_id
  authorization_type   = "NONE"
  enable_cors          = true
}

module "resolve_endpoint" {
  source = "./modules/api_gateway_endpoint"

  endpoint_name        = "resolve"
  path_part            = "{short_code}"
  http_method          = "GET"
  lambda_function_name = aws_lambda_function.resolve.function_name
  lambda_invoke_arn    = aws_lambda_function.resolve.invoke_arn
  lambda_function_arn  = aws_lambda_function.resolve.arn
  rest_api_id          = aws_api_gateway_rest_api.shorty_api.id
  root_resource_id     = aws_api_gateway_rest_api.shorty_api.root_resource_id
  authorization_type   = "NONE"
  enable_cors          = true
}

resource "aws_api_gateway_deployment" "shorty_api" {
  depends_on = [
    module.me_endpoint.api_gateway_integration,
    module.shorten_endpoint.api_gateway_integration,
    module.login_endpoint.api_gateway_integration,
    module.register_endpoint.api_gateway_integration,
    module.resolve_endpoint.api_gateway_integration
  ]
  rest_api_id = aws_api_gateway_rest_api.shorty_api.id

  triggers = {
    redeployment = sha1(join(",", [
      aws_lambda_function.me.source_code_hash,
      aws_lambda_function.shorten.source_code_hash,
      aws_lambda_function.login.source_code_hash,
      aws_lambda_function.register.source_code_hash,
      aws_lambda_function.resolve.source_code_hash
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "dev" {
  rest_api_id = aws_api_gateway_rest_api.shorty_api.id
  deployment_id = aws_api_gateway_deployment.shorty_api.id
  stage_name = "dev"
}
