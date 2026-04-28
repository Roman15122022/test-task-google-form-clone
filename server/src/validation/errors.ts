import { GraphQLError } from 'graphql';

export const badUserInput = (message: string): GraphQLError =>
  new GraphQLError(message, {
    extensions: {
      code: 'BAD_USER_INPUT',
    },
  });

export const notFound = (message: string): GraphQLError =>
  new GraphQLError(message, {
    extensions: {
      code: 'NOT_FOUND',
    },
  });
