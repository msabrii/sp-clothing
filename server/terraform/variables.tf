# Pulled from TF_VAR_SP_AWS_ACCESS_KEY
# variable "SP_AWS_ACCESS_KEY_ID" {
#     type = string
#     description = "Value for this variable is intended to be pulled from environment variable \"TF_VAR_SP_AWS_ACCESS_KEY\""
# }
# Pulled from TF_VAR_SP_AWS_SECRET_KEY
# variable "SP_AWS_SECRET_ACCESS_KEY" {
#     type = string
#     description = "Value for this variable is intended to be pulled from environment variable \"TF_VAR_SP_AWS_SECRET_KEY\""
# }

variable "region" {
    type = string
    default = "eu-west-1"
}