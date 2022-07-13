import {
  AuthenticationDetails,
  CognitoUser,
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

export interface SignInRequest {
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

export const run = async (event: SignInRequest) => {
  try {
    console.log(event);
    const { email, password } = event.body;
    if (!email || !password)
      return new Response(HttpStatusCode.BadRequest, {
        message: "Email/Password is missing",
      });
    // const response = await processRequest(amount, id, domain);
    // const payload = {
    //   AuthFlow: "ADMIN_USER_PASSWORD_AUTH",
    //   UserPoolId: process.env.cognito_user_pool_id,
    //   ClientId: process.env.cognito_client_id,
    //   AuthParameters: {
    //     USERNAME: email,
    //     PASSWORD: password,
    //   },
    // };

    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });
    const poolData = {
      UserPoolId: process.env.cognito_user_pool_id,
      ClientId: process.env.cognito_client_id,
    };
    const userPool = new CognitoUserPool(poolData);
    const userData = {
      Username: email,
      Pool: userPool,
    };
    const cognitoUser = new CognitoUser(userData);
    const result = await new Promise(function (resolve, reject) {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
          const accessToken = result.getAccessToken().getJwtToken();
          const refreshToken = result.getRefreshToken().getToken();
          const idToken = result.getIdToken().getJwtToken();
          resolve({ accessToken, idToken, refreshToken });
        },

        onFailure: function (err) {
          console.warn(err);
          reject("Error has occured");
        },
      });
    });
    console.log(result);
    return new Response(HttpStatusCode.OK, result);
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
