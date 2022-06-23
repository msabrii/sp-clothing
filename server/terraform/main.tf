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
        # access_key = "AKIAV7R5OMFAJNIB2VO3"
        # secret_key = "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"
        # profile = "sp"
    }
}

provider "aws" {
  region = "eu-west-1"
#   access_key = "AKIAV7R5OMFAJNIB2VO3"
#   secret_key = "EYMQApEc+cFw5snWCW18IrqOnXlCFOskP1407DTK"
  # profile = "sp"
}

# resource "aws_s3_bucket" "sample_bucker" {
#   bucket = "sample-bucket-123787123"
#   versioning {
#     enabled = true
#     }
# }

# resource "aws_s3_bucket" "sample_buckerr" {
#   bucket = "sample-bucket-1237232317123"
#   versioning {
#     enabled = true
#     }
# }