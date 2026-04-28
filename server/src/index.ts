import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import type { GraphQLContext } from './context.js';
import { resolvers } from './graphql/resolvers.js';
import { typeDefs } from './graphql/schema.js';
import { FormStore } from './store/formStore.js';

const parsedPort = Number.parseInt(process.env.PORT ?? '4000', 10);
const port = Number.isFinite(parsedPort) ? parsedPort : 4000;
const store = new FormStore();

const server = new ApolloServer<GraphQLContext>({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: {
    host: '127.0.0.1',
    port,
  },
  context: () =>
    Promise.resolve({
      store,
    }),
});

console.log(`GraphQL server ready at ${url}`);
