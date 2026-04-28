import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'shared/schema.graphql',
  documents: 'client/src/**/*.graphql',
  config: {
    enumsAsTypes: true,
    useTypeImports: true,
    maybeValue: 'T | null',
    inputMaybeValue: 'T | null | undefined',
  },
  generates: {
    'shared/src/generated/graphql.ts': {
      plugins: ['typescript'],
    },
    'server/src/generated/resolvers.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        contextType: '../context.js#GraphQLContext',
        mappers: {
          Form: '../store/types.js#StoredForm',
          Question: '../store/types.js#StoredQuestion',
          Response: '../store/types.js#StoredResponse',
          Answer: '../store/types.js#StoredAnswer',
        },
      },
    },
    'client/src/app/api/generated.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        {
          'typescript-rtk-query': {
            importBaseApiFrom: '@app/api/baseApi',
            importBaseApiAlternateName: 'api',
            exportHooks: true,
          },
        },
      ],
    },
  },
};

export default config;
