import type { AnswerInput, FormFieldsFragment, QuestionFieldsFragment } from '@app/api/generated';

export interface AnswerDraft {
  value: string;
  values: string[];
}

export type AnswerDrafts = Record<string, AnswerDraft>;

export const createInitialAnswerDrafts = (form: FormFieldsFragment): AnswerDrafts =>
  form.questions.reduce<AnswerDrafts>((drafts, question) => {
    drafts[question.id] = {
      value: '',
      values: [],
    };

    return drafts;
  }, {});

export const setDraftValue = (
  drafts: AnswerDrafts,
  questionId: string,
  value: string,
): AnswerDrafts => ({
  ...drafts,
  [questionId]: {
    value,
    values: drafts[questionId]?.values ?? [],
  },
});

export const toggleDraftValue = (
  drafts: AnswerDrafts,
  questionId: string,
  value: string,
): AnswerDrafts => {
  const currentValues = drafts[questionId]?.values ?? [];
  const nextValues = currentValues.includes(value)
    ? currentValues.filter((item) => item !== value)
    : [...currentValues, value];

  return {
    ...drafts,
    [questionId]: {
      value: drafts[questionId]?.value ?? '',
      values: nextValues,
    },
  };
};

const isAnswered = (question: QuestionFieldsFragment, draft: AnswerDraft | undefined): boolean => {
  if (question.type === 'CHECKBOX') {
    return (draft?.values.length ?? 0) > 0;
  }

  return (draft?.value.trim().length ?? 0) > 0;
};

export const validateAnswerDrafts = (form: FormFieldsFragment, drafts: AnswerDrafts): string[] => {
  const errors: string[] = [];

  form.questions.forEach((question) => {
    if (question.required && !isAnswered(question, drafts[question.id])) {
      errors.push(`"${question.title}" is required.`);
    }
  });

  return errors;
};

export const serializeAnswerDrafts = (
  form: FormFieldsFragment,
  drafts: AnswerDrafts,
): AnswerInput[] =>
  form.questions.map((question) => {
    const draft = drafts[question.id] ?? {
      value: '',
      values: [],
    };

    if (question.type === 'CHECKBOX') {
      return {
        questionId: question.id,
        values: draft.values,
      };
    }

    return {
      questionId: question.id,
      value: draft.value.trim(),
    };
  });

export const formatAnswer = (
  question: QuestionFieldsFragment,
  answer: AnswerInput | undefined,
): string => {
  if (answer === undefined) {
    return 'No answer';
  }

  if (question.type === 'CHECKBOX') {
    return answer.values?.length ? answer.values.join(', ') : 'No answer';
  }

  return answer.value?.trim() ? answer.value : 'No answer';
};
