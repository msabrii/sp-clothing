output "lambdas" {
  value = local.lambdas
}
output "aws_lambda_functions" {
  value = {for lambda in local.lambdas
      : "${lambda}" => {
        arn = aws_lambda_function.lambda[lambda].arn
        invoke_arn = aws_lambda_function.lambda[lambda].invoke_arn
      } 
    }
}