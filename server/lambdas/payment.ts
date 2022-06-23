import { APIGatewayEventRequestContext } from "aws-lambda";
import * as aws from "aws-sdk";
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
  docClient: () =>
    new aws.DynamoDB.DocumentClient({ convertEmptyValues: true }),
  getAwsCognitoClaim: getAwsCognitoClaim,
};

// const tableName = `users_table_${process.env.environment}`;

export interface Payment {
  requestContext: APIGatewayEventRequestContext;
  body: {
    name: string;
  };
}

const processRequest = async (name: string): Promise<string | undefined> => {
  return name;
};

export const run = async (event: Payment) => {
  try {
    // const email = deps.getAwsCognitoClaim(
    //   event.requestContext,
    //   AwsCognitoClaim.Email
    // );

    // if (!email) {
    //   return new Response(HttpStatusCode.Unauthorized, "User Not Authorized");
    // }

    const response = await processRequest(event.body.name);

    return new Response(HttpStatusCode.OK, response);
  } catch (error) {
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
