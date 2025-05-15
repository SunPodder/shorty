output "rest_api_id" {
  description = "The ID of the API Gateway REST API."
  value       = aws_api_gateway_rest_api.shorty_api.id
}

output "rest_api_root_resource_id" {
  description = "The root resource ID of the API Gateway."
  value       = aws_api_gateway_rest_api.shorty_api.root_resource_id
}

output "api_invoke_url" {
  description = "Invoke URL for the deployed API Gateway stage."
  value       = "https://${aws_api_gateway_rest_api.shorty_api.id}.execute-api.${data.aws_region.current.name}.amazonaws.com/${aws_api_gateway_stage.dev.stage_name}"
}

output "stage_name" {
  description = "The name of the deployment stage."
  value       = aws_api_gateway_stage.dev.stage_name
}

output "execution_arn" {
  description = "The execution ARN of the API Gateway."
  value       = aws_api_gateway_rest_api.shorty_api.execution_arn
}
