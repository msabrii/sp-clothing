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

provider "aws" {
  region = "eu-west-1"
}

module "lambda" {
  source = "./modules/lambda"
}

output "debug" {
  value = module.lambda.aws_lambda_functions
}

module "api-gateway" {
  depends_on = [
    module.lambda
  ]
  source = "./modules/api-gateway"
  aws_lambda_functions = module.lambda.aws_lambda_functions
}