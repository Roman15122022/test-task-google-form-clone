import { createApi } from '@reduxjs/toolkit/query/react';
import { GraphQLClient } from 'graphql-request';

import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query';

export const graphQLClient = new GraphQLClient('/graphql');

export const api = createApi({
  reducerPath: 'graphqlApi',
  baseQuery: graphqlRequestBaseQuery({
    client: graphQLClient,
  }),
  tagTypes: ['Form', 'Response'],
  endpoints: () => ({}),
});
