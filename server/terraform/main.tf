terraform {
    required_providers {
        aws = {
            source  = "hashicorp/aws"
            version = "~> 3.64.2"
        }
    }
    backend "s3" {
        bucket = "sp-infrastructure-terraform-state"
        key    = "terraform.tfstate"
        region = "eu-west-1"
    }
}

variable "TF_VAR_STRIPE_SECRET_KEY" {
  description = "stripe secret access key"
  type = string
  sensitive = true
}

variable "TF_VAR_SP_GOOGLE_CLIENT_ID" {
  description = "google client id"
  type = string
  sensitive = true
}

variable "TF_VAR_SP_GOOGLE_CLIENT_SECRET" {
  description = "google client secret"
  type = string
  sensitive = true
}

provider "aws" {
  region = "eu-west-1"
}

module "lambda" {
  source = "./modules/lambda"
  stripe_secret_key = var.TF_VAR_STRIPE_SECRET_KEY
  depends_on = [
    module.cognito
  ]
  cognito_user_pool_arn = module.cognito.cognito_user_pool_arn
}

module "cognito" {
  source = "./modules/cognito"
  google_client_id = var.TF_VAR_SP_GOOGLE_CLIENT_ID
  google_client_secret = var.TF_VAR_SP_GOOGLE_CLIENT_SECRET
}


module "api-gateway" {
  depends_on = [
    module.lambda
  ]
  source = "./modules/api-gateway"
  aws_lambda_functions = module.lambda.aws_lambda_functions
  cognito_user_pool_arn = module.cognito.cognito_user_pool_arn
}