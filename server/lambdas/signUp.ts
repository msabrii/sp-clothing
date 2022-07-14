import {
  CognitoUserAttribute,
  CognitoUserPool,
} from "amazon-cognito-identity-js";
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

import { getAwsCognitoClaim } from "../helpers/awsCognitoClaims";

export const deps = {
  getAwsCognitoClaim: getAwsCognitoClaim,
};

export interface SignUpRequest {
  requestContext: APIGatewayEventRequestContext;
  body: {
    email: string;
    password: string;
  };
}

// const processRequest = async (
//   amount: number,
//   id: string,
//   domain: string
// ): Promise<{ message: string; success: boolean } | undefined> => {
//   try {
//   } catch (error) {}
// };

export const run = async (event: SignUpRequest) => {
  try {
    console.log(event);
    const { email, password } = event.body;
    if (!email || !password)
      return new Response(HttpStatusCode.BadRequest, {
        message: "Email/Password is missing",
      });

    const userAttributes: CognitoUserAttribute[] = [
      new CognitoUserAttribute({ Name: "email", Value: email }),
      new CognitoUserAttribute({ Name: "name", Value: email.slice(5) }),
    ];
    const poolData = {
      UserPoolId: process.env.cognito_user_pool_id,
      ClientId: process.env.cognito_client_id,
    };
    const userPool = new CognitoUserPool(poolData);

    const result = await new Promise(function (resolve, reject) {
      userPool.signUp(email, password, userAttributes, null, (err, result) => {
        if (err) {
          console.log(err);
          reject(err.message);
        } else {
          console.log(result.user);
          resolve(result.user);
        }
      });
    });
    return new Response(HttpStatusCode.OK, result);
  } catch (error) {
    if (error === "An account with the given email already exists.")
      return new Response(HttpStatusCode.Forbidden, error);
    console.log(error);
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
