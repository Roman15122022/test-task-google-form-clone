import { api as generatedApi } from './generated';

export const formsApi = generatedApi.enhanceEndpoints({
  addTagTypes: ['Form', 'Response'],
  endpoints: {
    Forms: {
      providesTags: ['Form'],
    },
    Form: {
      providesTags: (_result, _error, arg) => [{ type: 'Form', id: arg.id }],
    },
    Responses: {
      providesTags: (_result, _error, arg) => [{ type: 'Response', id: arg.formId }],
    },
    CreateForm: {
      invalidatesTags: ['Form'],
    },
    SubmitResponse: {
      invalidatesTags: (_result, _error, arg) => [{ type: 'Response', id: arg.formId }],
    },
  },
});

export const {
  useCreateFormMutation,
  useFormQuery,
  useFormsQuery,
  useResponsesQuery,
  useSubmitResponseMutation,
} = formsApi;
