resource "aws_lambda_function" "me" {
  function_name = "me"
  handler       = "me"
  runtime       = "go1.x"
  filename      = "${path.module}/../bin/me.zip"
  source_code_hash = filebase64sha256("${path.module}/../bin/me.zip")
  role          = aws_iam_role.lambda_exec.arn
}

resource "aws_lambda_function" "shorten" {
  function_name = "shorten"
  handler       = "shorten"
  runtime       = "go1.x"
  filename      = "${path.module}/../bin/shorten.zip"
  source_code_hash = filebase64sha256("${path.module}/../bin/shorten.zip")
  role          = aws_iam_role.lambda_exec.arn
}

resource "aws_lambda_function" "login" {
  function_name = "login"
  handler       = "login"
  runtime       = "go1.x"
  filename      = "${path.module}/../bin/login.zip"
  source_code_hash = filebase64sha256("${path.module}/../bin/login.zip")
  role          = aws_iam_role.lambda_exec.arn
}

resource "aws_lambda_function" "register" {
  function_name = "register"
  handler       = "register"
  runtime       = "go1.x"
  filename      = "${path.module}/../bin/register.zip"
  source_code_hash = filebase64sha256("${path.module}/../bin/register.zip")
  role          = aws_iam_role.lambda_exec.arn
}

resource "aws_lambda_function" "resolve" {
  function_name = "resolve"
  handler       = "resolve"
  runtime       = "go1.x"
  filename      = "${path.module}/../bin/resolve.zip"
  source_code_hash = filebase64sha256("${path.module}/../bin/resolve.zip")
  role          = aws_iam_role.lambda_exec.arn
}

resource "aws_lambda_function" "authorizer" {
  function_name = "authorizer"
  handler       = "authorizer"
  runtime       = "go1.x"
  filename      = "${path.module}/../bin/authorizer.zip"
  source_code_hash = filebase64sha256("${path.module}/../bin/authorizer.zip")
  role          = aws_iam_role.lambda_exec.arn
}
