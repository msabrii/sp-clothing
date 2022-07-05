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
    // const response = await processRequest(amount, id, domain);

    return new Response(HttpStatusCode.OK);
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
