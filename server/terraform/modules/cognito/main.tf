resource "aws_cognito_user_pool" "user_pool"{
  name = "sp_user_pool_${terraform.workspace}"
  username_attributes = ["email"]

  username_configuration {
      case_sensitive = false
  }
  password_policy {
    minimum_length = 6
    require_lowercase = true
    require_uppercase = true
    require_numbers = true
    require_symbols = false
    temporary_password_validity_days = 7
  }
  account_recovery_setting {
    recovery_mechanism {
      name     = "admin_only"
      priority = 1
    }
  }
  email_configuration {
    email_sending_account = "COGNITO_DEFAULT"
  }
  lambda_config {
    pre_sign_up = module.cognito-triggers.pre_sign_up_lambda_arn
  }
  
}

# resource "aws_iam_user" "cognito_user" {
#   name = "${terraform.workspace}-server-cognito-user"
# }
# resource "aws_iam_user_policy" "cognito_user_permissions" {
#   name = "${terraform.workspace}-cognito-iam-policy"
#   user = aws_iam_user.cognito_user.name

#   policy = <<EOF
# {
#   "Version": "2012-10-17",
#   "Statement": [
#     {
#       "Effect": "Allow",
#       "Action": [
#         "cognito-idp:*"
#       ],
#       "Resource": [
#         "*"
#       ]
#     }
#   ]
# }
# EOF
# }

# resource "aws_iam_access_key" "cognito_user_permissions" {
#   user = aws_iam_user.cognito_user.name
# }

resource "aws_cognito_user_pool_domain" "main" {
  domain       = "sp-clothing-${terraform.workspace}"
  user_pool_id = aws_cognito_user_pool.user_pool.id
}


resource "aws_cognito_user_pool_client" "user_pool_client" {
  name = "user_pool_client_${terraform.workspace}"
  user_pool_id = aws_cognito_user_pool.user_pool.id
  depends_on = [aws_cognito_identity_provider.google_provider]
  generate_secret = false
  supported_identity_providers = ["Google", "COGNITO"]
  allowed_oauth_flows = ["code", "implicit"]
  allowed_oauth_flows_user_pool_client = true
  callback_urls = ["http://localhost:3000/3rd-party-signin"]
  logout_urls = ["http://localhost:3000"]
  allowed_oauth_scopes = ["email", "openid", "profile"]
  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_ADMIN_USER_PASSWORD_AUTH",
    "ALLOW_CUSTOM_AUTH"
    ]
  token_validity_units {
    access_token = "hours"
    id_token = "hours"
    refresh_token = "days"
  }
  access_token_validity = 24
  id_token_validity = 24
  refresh_token_validity = 30
  read_attributes = [ "email", "name", "identities" ]
}

resource "aws_cognito_identity_provider" "google_provider" {
  user_pool_id  = aws_cognito_user_pool.user_pool.id
  provider_name = "Google"
  provider_type = "Google"

  provider_details = {
    authorize_scopes = "email profile openid"
    client_id        = var.google_client_id
    client_secret    = var.google_client_secret

    attributes_url                = "https://people.googleapis.com/v1/people/me?personFields="
    attributes_url_add_attributes = "true"
    authorize_url                 = "https://accounts.google.com/o/oauth2/v2/auth"
    oidc_issuer                   = "https://accounts.google.com"
    token_request_method          = "POST"
    token_url                     = "https://www.googleapis.com/oauth2/v4/token"
  }

  attribute_mapping = {
    email    = "email"
    name = "name"
    picture = "picture"
    username = "sub"
  }
}

module "cognito-triggers" {
  source = "./modules/cognito-triggers"
  cognito_user_pool_arn = aws_cognito_user_pool.user_pool.arn
}