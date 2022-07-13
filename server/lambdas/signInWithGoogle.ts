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
}

// const processRequest = async (
//   amount: number,
//   id: string,
//   domain: string
// ): Promise<{ message: string; success: boolean } | undefined> => {
//   try {
//   } catch (error) {}
// };

export const run = async (event: SignInRequest) => {
  try {
    console.log(event);
    // const response = await processRequest(amount, id, domain);
    return new Response(
      HttpStatusCode.OK,
      `https://sp-clothing-dev.auth.eu-west-1.amazoncognito.com/oauth2/authorize?identity_provider=Google&redirect_uri=http://localhost:3000/3rd-party-signin&response_type=code&client_id=${process.env.cognito_client_id}&scope=email+openid+profile`
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
