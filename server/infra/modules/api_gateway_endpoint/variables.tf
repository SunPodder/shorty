variable "endpoint_name" {
  description = "A unique name for the endpoint (e.g., me, login, shorten)."
  type        = string
}

variable "path_part" {
  description = "The path part for this resource."
  type        = string
}

variable "http_method" {
  description = "The HTTP method (GET, POST, PUT, DELETE, etc.)."
  type        = string
}

variable "lambda_function_name" {
  description = "The name of the Lambda function."
  type        = string
}

variable "lambda_invoke_arn" {
  description = "The invocation ARN of the Lambda function."
  type        = string
}

variable "lambda_function_arn" {
  description = "The ARN of the Lambda function (for permissions)."
  type        = string
}

variable "rest_api_id" {
  description = "The ID of the REST API."
  type        = string
}

variable "root_resource_id" {
  description = "The ID of the parent API Gateway resource."
  type        = string
}

variable "authorization_type" {
  description = "The authorization type for the method (NONE, CUSTOM, AWS_IAM)."
  type        = string
  default     = "NONE"
}

variable "authorizer_id" {
  description = "The ID of the authorizer to use. Required if authorization_type is CUSTOM."
  type        = string
  default     = null
}

variable "enable_cors" {
  description = "Flag to enable CORS support by adding an OPTIONS method with mock integration."
  type        = bool
  default     = false
}
