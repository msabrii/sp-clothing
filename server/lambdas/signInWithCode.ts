import { APIGatewayEventRequestContext } from "aws-lambda";
import axios from "axios";
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

    // const formData = new FormData();
    // formData.append("code", code);
    // formData.append("client_id", process.env.cognito_client_id);
    // formData.append("redirect_uri", "http://localhost:3000/3rd-party-signin");
    // formData.append("grant_type", "authorization_code");

    // console.log(formData);
    const res = await axios({
      method: "post",
      url: `https://sp-clothing-dev.auth.eu-west-1.amazoncognito.com/oauth2/token?code=${code}&redirect_uri=http://localhost:3000/3rd-party-signin&client_id=${process.env.cognito_client_id}&grant_type=authorization_code`,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
      .then(function (response) {
        //handle success
        return response.data;
      })
      .catch(function (response) {
        //handle error
        return response;
      });
    // const res = await axios.post(
    //   "https://sp-clothing-dev.auth.eu-west-1.amazoncognito.com/oauth2/token",
    //   formData
    // );
    console.log(res);
    return new Response(HttpStatusCode.OK, res);
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
