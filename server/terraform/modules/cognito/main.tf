resource "aws_cognito_user_pool" "user_pool"{
  name = "sp_user_pool_${terraform.workspace}"
  username_attributes = ["email"]
  password_policy {
    minimum_length = 8
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

resource "aws_cognito_user_pool_domain" "main" {
  domain       = "sp-clothing-${terraform.workspace}"
  user_pool_id = aws_cognito_user_pool.user_pool.id
}


resource "aws_cognito_user_pool_client" "user_pool_client" {
  name = "user_pool_client_${terraform.workspace}"
  user_pool_id = aws_cognito_user_pool.user_pool.id
  depends_on = [aws_cognito_identity_provider.google_provider]
  supported_identity_providers = ["Google", "COGNITO"]
  allowed_oauth_flows = ["implicit"]
  allowed_oauth_flows_user_pool_client = true
  callback_urls = ["http://localhost:3000"]
  logout_urls = ["http://localhost:3000"]
  allowed_oauth_scopes = ["email", "openid", "profile"]
  explicit_auth_flows = ["ALLOW_USER_PASSWORD_AUTH", "ALLOW_REFRESH_TOKEN_AUTH", "ALLOW_USER_SRP_AUTH"]
}

resource "aws_cognito_identity_provider" "google_provider" {
  user_pool_id  = aws_cognito_user_pool.user_pool.id
  provider_name = "Google"
  provider_type = "Google"

  provider_details = {
    authorize_scopes = "email profile openid"
    client_id        = "${var.google_client_id}"
    client_secret    = "${var.google_client_secret}"
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