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

module "api-gateway" {
  source = "./modules/api-gateway"
}


module "lambda" {
  source = "./modules/lambda"
}


