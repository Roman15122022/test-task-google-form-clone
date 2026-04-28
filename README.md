# Google Forms Lite Clone

A TypeScript monorepo with a React/Redux client and a GraphQL server that implements a small Google Forms style workflow: create forms, fill them, and inspect responses.

## Stack

- npm workspaces: `client`, `server`, `shared`
- Client: React, React Router, Redux Toolkit, RTK Query, Webpack 5
- Server: Apollo Server, GraphQL, in-memory storage
- Shared contracts: `shared/schema.graphql` plus GraphQL Code Generator
- Quality: strict TypeScript, ESLint, Prettier, Vitest

## Requirements

- Node.js 22+
- npm 11+

## Setup

```bash
npm install
npm run codegen
```

## Development

```bash
npm run dev
```

- Client: http://localhost:3000
- GraphQL API: http://localhost:4000/graphql

The client proxies `/graphql` to the server during development.

## Checks

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Notes

- Form and response data lives in memory and resets when the server restarts.
- GraphQL schema and operations are the source of truth for generated types.
- Webpack aliases are mirrored in `client/tsconfig.json`: `@app`, `@features`, and `@shared`.
