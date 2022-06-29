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
import Stripe from "stripe";
import { HttpStatusCode } from "../constants/httpStatusCodes";

// import { getAwsCognitoClaim } from "../helpers/awsCognitoClaims";

// export const deps = {
//   docClient: () =>
//     new aws.DynamoDB.DocumentClient({ convertEmptyValues: true }),
//   getAwsCognitoClaim: getAwsCognitoClaim,
// };

// const tableName = `users_table_${process.env.environment}`;

const stripe = new Stripe(process.env.stripe_secret_key, {
  apiVersion: "2020-08-27",
});

export interface Payment {
  requestContext: APIGatewayEventRequestContext;
  body: {
    amount: number;
    id: string;
    domain: string;
  };
}

const processRequest = async (
  amount: number,
  id: string,
  domain: string
): Promise<{ message: string; success: boolean } | undefined> => {
  try {
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: "GBP",
      description: "Sneaker Shop",
      payment_method: id,
      confirm: true,
    });
    console.log("PAYMENT", payment);
    return {
      message: "Payment Successful",
      success: true,
    };
  } catch (error) {
    console.log("ERROR", error);
    return {
      message: "Payment NOT Successful",
      success: false,
    };
  }
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
    console.log(event);
    const { amount, id, domain = "http://localhost:3000" } = event.body;
    const response = await processRequest(amount, id, domain);

    return new Response(HttpStatusCode.OK, response);
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
