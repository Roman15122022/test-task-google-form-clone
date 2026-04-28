import { readFileSync } from 'node:fs';

const schemaUrl = new URL('../../../shared/schema.graphql', import.meta.url);

export const typeDefs = readFileSync(schemaUrl, 'utf8');
