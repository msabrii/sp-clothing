locals {
  # Common tags to attach to resources
  common_tags = {
    Environment = "${terraform.workspace}"
    Project     = "sp-clothing"
  }
  service_name = "sp-clothing"
  lambdas = toset(
    [for file_name in fileset(path.module, "../../../dist/*.zip")
      : replace(basename(file_name), ".zip", "") if basename(file_name) != "preSignUp.zip"]
  )
}


resource "aws_iam_role" "iam_for_lambda" {
  name = "iam_for_lambda_${terraform.workspace}"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_policy" "lambda_policy" {
  name = "lambda_policy_${terraform.workspace}"
  policy = <<-POLICY
   {
      "Version": "2012-10-17",
      "Statement": [
         {
          "Action": [
            "cognito-idp:*"
          ],
          "Effect": "Allow",
          "Resource": [
            "${var.cognito_user_pool_arn}"
          ]
        },
        {
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Effect": "Allow",
            "Resource": "arn:aws:logs:*:*:*"
        }
      ]
   }
  POLICY
}

resource "aws_iam_role_policy_attachment" "lambda_policy_attachment" {
  role = aws_iam_role.iam_for_lambda.id
  policy_arn = aws_iam_policy.lambda_policy.arn
}

resource "aws_lambda_function" "lambda" {
  for_each    = local.lambdas

  filename      = "./../dist/${each.value}.zip"
  function_name = "${each.value}-${terraform.workspace}"
  role          = aws_iam_role.iam_for_lambda.arn
  handler       = "${each.value}.handler"
  source_code_hash = filebase64sha256("./../dist/${each.value}.zip")
  runtime = "nodejs14.x"
  
  environment {
    variables = {
      environment = "${terraform.workspace}",
      stripe_secret_key =  var.stripe_secret_key
    }
  }
}
