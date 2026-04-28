import type { Resolvers } from '../generated/resolvers.js';

export const resolvers: Resolvers = {
  Query: {
    forms: (_parent, _args, context) => context.store.listForms(),
    form: (_parent, args, context) => context.store.getForm(args.id),
    responses: (_parent, args, context) => context.store.listResponses(args.formId),
  },
  Mutation: {
    createForm: (_parent, args, context) =>
      context.store.createForm({
        title: args.title,
        description: args.description,
        questions: args.questions,
      }),
    submitResponse: (_parent, args, context) =>
      context.store.submitResponse({
        formId: args.formId,
        answers: args.answers,
      }),
  },
};
