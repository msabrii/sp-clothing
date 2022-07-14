import { CognitoUser, CognitoUserPool } from "amazon-cognito-identity-js";
import { APIGatewayEventRequestContext } from "aws-lambda";
import middy from "middy";
import { Response } from "../models/response";

import {
  cors,
  httpErrorHandler,
  httpEventNormalizer,
  httpSecurityHeaders,
  jsonBodyParser,
} from "middy/middlewares";
import { HttpStatusCode } from "../constants/httpStatusCodes";

import {
  AwsCognitoClaim,
  getAwsCognitoClaim,
} from "../helpers/awsCognitoClaims";

export const deps = {
  getAwsCognitoClaim: getAwsCognitoClaim,
};

export interface SignOutRequest {
  requestContext: APIGatewayEventRequestContext;
  body: {};
}

export const run = async (event: SignOutRequest) => {
  try {
    const poolData = {
      UserPoolId: process.env.cognito_user_pool_id,
      ClientId: process.env.cognito_client_id,
    };
    const cognitoEmail = deps.getAwsCognitoClaim(
      event.requestContext,
      AwsCognitoClaim.Email
    );

    console.log(cognitoEmail);

    if (!cognitoEmail)
      return new Response(HttpStatusCode.Unauthorized, "User not authorized");

    const userPool = new CognitoUserPool(poolData);
    const cognitoUser = new CognitoUser({
      Username: cognitoEmail,
      Pool: userPool,
    });
    console.log("test", cognitoEmail);
    const data = await new Promise(function (resolve, reject) {
      cognitoUser.globalSignOut({
        onSuccess: (msg) => {
          console.log(msg);
          resolve(msg);
        },
        onFailure: (err) => {
          console.log(err);
          reject(err);
        },
      });
    });
    console.log(data);
    return new Response(HttpStatusCode.OK, { signed_out: true });
  } catch (error) {
    console.log(error);
    return new Response(HttpStatusCode.InternalServerError, {
      signed_out: false,
      message: error,
    });
  }
};

const handler = middy(run)
  .use(cors())
  .use(httpErrorHandler())
  .use(httpEventNormalizer())
  .use(httpSecurityHeaders())
  .use(jsonBodyParser());

exports.handler = handler;
