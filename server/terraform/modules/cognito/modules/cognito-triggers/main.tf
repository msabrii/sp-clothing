# data "archive_file" "lambda_zip" {
#     type        = "zip"
#     source_dir  = "./../../../../../dist/preSignUp/"
#     output_path = "preSignUp.zip"
# }

resource "aws_iam_role" "iam_for_lambda" {
  name = "cognito_pre_signup_handler_role"

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

resource "aws_iam_policy" "cognito_permissions_for_lambda" {
  name = "cognito_pre_signup_handler_role"

  policy  = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "cognito-idp:AdminAddUserToGroup",
        "cognito-idp:AdminUpdateUserAttributes",
        "cognito-idp:ListUsers",
        "cognito-idp:AdminLinkProviderForUser",
        "cognito-idp:AdminCreateUser",
        "cognito-idp:AdminSetUserPassword",
        "cloudwatch:*",
        "logs:*"
      ],
      "Effect": "Allow",
      "Resource": "*"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "trigger-policy-attach" {
  role       = aws_iam_role.iam_for_lambda.name
  policy_arn = aws_iam_policy.cognito_permissions_for_lambda.arn
}

resource "aws_lambda_function" "pre_sign_up_lambda" {
  filename = "./../dist/preSignUp.zip"
  source_code_hash = filebase64sha256("./../dist/preSignUp.zip")
  function_name = "sp-cognito-pre-sign-up"
  role = aws_iam_role.iam_for_lambda.arn
  description = "Pre sign up trigger that merges the external accounts with normal ones"
  handler = "index.handler"
  runtime = "nodejs14.x"
}