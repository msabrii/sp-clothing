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

export interface SignInRefreshRequest {
  requestContext: APIGatewayEventRequestContext;
  body: {
    refreshToken: string;
  };
}

export const run = async (event: SignInRefreshRequest) => {
  try {
    console.log(event);
    const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();
    const { refreshToken } = event.body;
    if (!refreshToken)
      return new Response(HttpStatusCode.BadRequest, {
        message: "Refresh token is missing",
      });

    const params: any = {
      AuthFlow: "REFRESH_TOKEN_AUTH",
      ClientId: process.env.cognito_client_id,
      UserPoolId: process.env.cognito_user_pool_id,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      },
    };

    const result = await new Promise(function (resolve, reject) {
      cognitoIdentityServiceProvider.adminInitiateAuth(params, (err, data) => {
        if (err) {
          reject(err.message);
        } else {
          console.warn(data);
          resolve(data);
        }
      });
    });
    return new Response(HttpStatusCode.OK, result);
  } catch (error) {
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
