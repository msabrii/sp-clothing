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

export interface SignInRequest {
  requestContext: APIGatewayEventRequestContext;
  body: {
    target: string;
    code: string;
  };
}

export const run = async (event: SignInRequest) => {
  try {
    console.log(event);
    const { code, target } = event.body;
    if (!code || !target)
      return new Response(HttpStatusCode.BadRequest, {
        message: "No valid code/target",
      });
    return new Response(
      HttpStatusCode.OK,
      `https://sp-clothing-dev.auth.eu-west-1.amazoncognito.com/oauth2/token?code=${code}&redirect_uri=http://localhost:3000/3rd-party-signin&client_id=${process.env.cognito_client_id}&grant_type=authorization_code`
    );
  } catch (error) {
    console.log(error);
    return new Response(HttpStatusCode.InternalServerError);
  }
};

const handler = middy(run)
  .use(cors())
  .use(httpErrorHandler())
  .use(httpEventNormalizer())
  .use(httpSecurityHeaders())
  .use(jsonBodyParser());

exports.handler = handler;
