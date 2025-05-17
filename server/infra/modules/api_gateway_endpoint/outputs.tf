output "api_gateway_integration" {
  description = "The API Gateway integration resource."
  value       = aws_api_gateway_integration.endpoint_integration
}

output "api_gateway_resource_id" {
  description = "The ID of the API Gateway resource created."
  value       = aws_api_gateway_resource.endpoint_resource.id
}

output "api_gateway_method_http_method" {
  description = "The HTTP method of the API Gateway method created."
  value       = aws_api_gateway_method.endpoint_method.http_method
}
