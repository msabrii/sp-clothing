import { APIGatewayEventRequestContext } from 'aws-lambda';

export enum AwsCognitoClaim {
    Username = 'cognito:username',
    Email = 'email',
    UserGroups = 'cognito:groups'
}

export const getAwsCognitoClaim = (requestContext: APIGatewayEventRequestContext, claim: AwsCognitoClaim): string =>
    (requestContext.authorizer && requestContext.authorizer.claims[claim]) ||
    (process.env.testUserClaims && ((process.env.testUserClaims as unknown) as { [key: string]: string })[claim]);
