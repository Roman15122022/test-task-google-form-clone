import type { AnswerInput, QuestionInput } from '@google-forms-lite/shared';

import { notFound } from '../validation/errors.js';
import { normalizeFormInput, normalizeResponseInput } from '../validation/formValidation.js';
import type { StoredForm, StoredResponse } from './types.js';

interface CreateFormInput {
  title: string;
  description?: string | null | undefined;
  questions?: readonly QuestionInput[] | null | undefined;
}

interface SubmitResponseInput {
  formId: string;
  answers: readonly AnswerInput[];
}

export class FormStore {
  private readonly forms = new Map<string, StoredForm>();

  private readonly responses = new Map<string, StoredResponse[]>();

  listForms(): StoredForm[] {
    return [...this.forms.values()].sort((left, right) =>
      right.createdAt.localeCompare(left.createdAt),
    );
  }

  getForm(id: string): StoredForm | null {
    return this.forms.get(id) ?? null;
  }

  listResponses(formId: string): StoredResponse[] {
    return [...(this.responses.get(formId) ?? [])].sort((left, right) =>
      right.submittedAt.localeCompare(left.submittedAt),
    );
  }

  createForm(input: CreateFormInput): StoredForm {
    const normalized = normalizeFormInput(input);
    const form: StoredForm = {
      id: crypto.randomUUID(),
      title: normalized.title,
      description: normalized.description,
      questions: normalized.questions,
      createdAt: new Date().toISOString(),
    };

    this.forms.set(form.id, form);
    this.responses.set(form.id, []);

    return form;
  }

  submitResponse(input: SubmitResponseInput): StoredResponse {
    const form = this.forms.get(input.formId);

    if (form === undefined) {
      throw notFound('Form was not found.');
    }

    const response: StoredResponse = {
      id: crypto.randomUUID(),
      formId: form.id,
      answers: normalizeResponseInput({
        form,
        answers: input.answers,
      }),
      submittedAt: new Date().toISOString(),
    };

    this.responses.set(form.id, [...this.listResponses(form.id), response]);

    return response;
  }
}
