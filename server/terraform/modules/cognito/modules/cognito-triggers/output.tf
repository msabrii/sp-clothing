output "pre_sign_up_lambda_arn" {
  depends_on = [
    aws_lambda_function.pre_sign_up_lambda
  ]
  value = aws_lambda_function.pre_sign_up_lambda.arn
}