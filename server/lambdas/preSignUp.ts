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

export const run = async (event: any, context: any) => {
  try {
    console.log(event);
    event.response.autoConfirmUser = true;
    if (event.request.userAttributes.hasOwnProperty("email")) {
      event.response.autoVerifyEmail = true;
    }
    context.done(null, event);
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
