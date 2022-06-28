resource "aws_api_gateway_rest_api" "sp_api_gateway" {
  name        = "SpAPI-${terraform.workspace}"
  description = "API for the SP Clothing App"
  body        = "${data.template_file.api_swagger.rendered}"
}
data "template_file" api_swagger{
  template = "${file("./api/ApiDefinitionBundled.yaml")}"

  vars = {
    payment_lambda_arn  = var.aws_lambda_functions["payment"].invoke_arn
    api_gateway_role_arn = aws_iam_role.iam_for_apigw.arn
  }
}

resource "aws_api_gateway_deployment" "sp_api_gateway_deployment" {
  rest_api_id = "${aws_api_gateway_rest_api.sp_api_gateway.id}"
  stage_name  = terraform.workspace
}

resource "aws_api_gateway_account" "aws_api_gateway_account_cloudwatch" {
  cloudwatch_role_arn = aws_iam_role.cloudwatch.arn
}

resource "aws_api_gateway_method_settings" "sp_api_gateway_settings" {
  rest_api_id = "${aws_api_gateway_rest_api.sp_api_gateway.id}"
  stage_name  = terraform.workspace
  method_path = "*/*"

  settings {
    metrics_enabled = true
    logging_level   = "INFO"
  }
}

resource "aws_iam_role" "cloudwatch" {
  name = "api_gateway_cloudwatch_${terraform.workspace}"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": "apigateway.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "cloudwatch" {
  name   = "log_policy-${terraform.workspace}"
  role = aws_iam_role.cloudwatch.id
  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:DescribeLogGroups",
                "logs:DescribeLogStreams",
                "logs:PutLogEvents",
                "logs:GetLogEvents",
                "logs:FilterLogEvents"
            ],
            "Resource": "*"
        }
    ]
}
EOF
}

resource "aws_iam_role" "iam_for_apigw" {
  name = "iam_for_apigw-${terraform.workspace}"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "apigateway.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_lambda_permission" "api-gateway-invoke-payment-lambda" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.aws_lambda_functions["payment"].arn
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_api_gateway_deployment.sp_api_gateway_deployment.execution_arn}/*/*"
}

resource "aws_lambda_permission" "api-gateway-invoke-payment-lambda-from-api-gateway-test" {
  statement_id  = "AllowAPIGatewayInvokeFromApiGatewayTest"
  action        = "lambda:InvokeFunction"
  function_name = var.aws_lambda_functions["payment"].arn
  principal     = "apigateway.amazonaws.com"
  source_arn = replace("${aws_api_gateway_deployment.sp_api_gateway_deployment.execution_arn}/*/*", "//dev//", "/test-invoke-stage/")
}
