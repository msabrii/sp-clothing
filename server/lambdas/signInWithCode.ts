import { APIGatewayEventRequestContext } from "aws-lambda";
import FormData from "form-data";
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

    const formData = new FormData();
    formData.append("code", code);
    formData.append("client_id", process.env.cognito_client_id);
    formData.append("redirect_uri", "http://localhost:3000/3rd-party-signin");
    formData.append("grant_type", "authorization_code");

    const res = await fetch(
      "https://sp-clothing-dev.auth.eu-west-1.amazoncognito.com/oauth2/token",
      {
        method: "POST",
        body: JSON.stringify(formData),
      }
    );
    const data = await res.json();
    console.log(data);
    return new Response(HttpStatusCode.OK, data);
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
