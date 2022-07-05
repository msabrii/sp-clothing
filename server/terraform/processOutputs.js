const { exec } = require("child_process");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();

exec("terraform output -json", (error, stdout, stderr) => {
  if (error) {
    console.log(`error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.log(`stderr: ${stderr}`);
    return;
  }

  const outputs = JSON.parse(stdout);
  // Add Base URL to yaml files for client code generation
  // const baseUrl = outputs.base_url.value.replace("https://", "");
  // Set Auth config for client
  const authconfig = {
    aws_project_region: "eu-west-1",
    aws_cognito_region: "eu-west-1",
    aws_user_pools_id: outputs.cognito_user_pool_id.value,
    aws_user_pools_web_client_id: outputs.cognito_app_client_id.value,
    oauth: {
      domain: `sp-clothing-${process.env.TF_WORKSPACE}.auth.eu-west-1.amazoncognito.com`,
      scope: ["email", "openid", "profile"],
      redirectSignIn: "http://localhost:3000",
      redirectSignOut: "http://localhost:3000",
      responseType: "token",
    },
  };

  fs.writeFile(
    "../../client/auth-config.json",
    JSON.stringify(authconfig),
    function (err) {
      if (err) return err;
    }
  );
});
