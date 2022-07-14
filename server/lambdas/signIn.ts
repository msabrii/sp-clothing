import { APIGatewayEventRequestContext } from "aws-lambda";
import { CognitoIdentityServiceProvider } from "aws-sdk";
import middy from "middy";
import {
  cors,
  httpErrorHandler,
  httpEventNormalizer,
  httpSecurityHeaders,
  jsonBodyParser,
} from "middy/middlewares";
import { HttpStatusCode } from "../constants/httpStatusCodes";
import { getAwsCognitoClaim } from "../helpers/awsCognitoClaims";
import { Response } from "../models/response";

export const deps = {
  getAwsCognitoClaim: getAwsCognitoClaim,
};

export interface SignInRequest {
  requestContext: APIGatewayEventRequestContext;
  body: {
    email: string;
    password: string;
  };
}

export const run = async (event: SignInRequest) => {
  try {
    console.log(event);
    const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();
    const { email, password } = event.body;
    if (!email || !password)
      return new Response(HttpStatusCode.BadRequest, {
        message: "Email/Password is missing",
      });

    const params: any = {
      AuthFlow: "ADMIN_USER_PASSWORD_AUTH",
      ClientId: process.env.cognito_client_id,
      UserPoolId: process.env.cognito_user_pool_id,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    };

    const result = await new Promise(function (resolve, reject) {
      cognitoIdentityServiceProvider.adminInitiateAuth(params, (err, data) => {
        if (err) {
          reject(err.message);
        } else {
          console.warn(data);
          resolve(data.AuthenticationResult);
        }
      });
    });
    return new Response(HttpStatusCode.OK, result);
  } catch (error) {
    if (error === "Incorrect username or password.")
      return new Response(HttpStatusCode.Unauthorized, error);
    return new Response(HttpStatusCode.InternalServerError, error);
  }
};

const handler = middy(run)
  .use(cors())
  .use(httpErrorHandler())
  .use(httpEventNormalizer())
  .use(httpSecurityHeaders())
  .use(jsonBodyParser());

exports.handler = handler;
