import type { AnswerInput, QuestionInput, QuestionType } from '@google-forms-lite/shared';

import type { StoredAnswer, StoredForm, StoredQuestion } from '../store/types.js';
import { badUserInput } from './errors.js';

const choiceQuestionTypes = new Set<QuestionType>(['MULTIPLE_CHOICE', 'CHECKBOX']);
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

export interface CreateFormPayload {
  title: string;
  description?: string | null | undefined;
  questions?: readonly QuestionInput[] | null | undefined;
}

export interface SubmitResponsePayload {
  form: StoredForm;
  answers: readonly AnswerInput[];
}

export interface NormalizedFormInput {
  title: string;
  description: string | null;
  questions: StoredQuestion[];
}

const normalizeText = (value: string): string => value.trim();

const normalizeOptionalText = (value: string | null | undefined): string | null => {
  const normalized = value?.trim() ?? '';
  return normalized.length > 0 ? normalized : null;
};

const normalizeOptions = (options: readonly string[] | null | undefined): string[] => {
  const normalized = (options ?? []).map((option) => option.trim()).filter(Boolean);
  const unique = new Set(normalized.map((option) => option.toLocaleLowerCase()));

  if (unique.size !== normalized.length) {
    throw badUserInput('Question options must be unique.');
  }

  return normalized;
};

const validateQuestionOptions = (type: QuestionType, options: string[]): string[] => {
  if (!choiceQuestionTypes.has(type)) {
    return [];
  }

  if (options.length < 2) {
    throw badUserInput('Multiple choice and checkbox questions require at least two options.');
  }

  return options;
};

export const normalizeFormInput = (payload: CreateFormPayload): NormalizedFormInput => {
  const title = normalizeText(payload.title);

  if (title.length === 0) {
    throw badUserInput('Form title is required.');
  }

  const questions = (payload.questions ?? []).map<StoredQuestion>((question) => {
    const questionTitle = normalizeText(question.title);

    if (questionTitle.length === 0) {
      throw badUserInput('Question title is required.');
    }

    const options = validateQuestionOptions(question.type, normalizeOptions(question.options));

    return {
      id: crypto.randomUUID(),
      title: questionTitle,
      type: question.type,
      required: question.required ?? false,
      options,
    };
  });

  return {
    title,
    description: normalizeOptionalText(payload.description),
    questions,
  };
};

const answerLabel = (question: StoredQuestion): string => `"${question.title}"`;

const normalizeSingleAnswer = (
  question: StoredQuestion,
  answer: AnswerInput | undefined,
): StoredAnswer => {
  const value = answer?.value?.trim() ?? '';

  if (question.required && value.length === 0) {
    throw badUserInput(`Question ${answerLabel(question)} is required.`);
  }

  if (value.length === 0) {
    return {
      questionId: question.id,
      value: null,
      values: [],
    };
  }

  if (question.type === 'DATE' && !datePattern.test(value)) {
    throw badUserInput(`Question ${answerLabel(question)} must be a valid date.`);
  }

  if (question.type === 'MULTIPLE_CHOICE' && !question.options.includes(value)) {
    throw badUserInput(`Question ${answerLabel(question)} has an invalid option.`);
  }

  return {
    questionId: question.id,
    value,
    values: [],
  };
};

const normalizeCheckboxAnswer = (
  question: StoredQuestion,
  answer: AnswerInput | undefined,
): StoredAnswer => {
  const values = (answer?.values ?? []).map((value) => value.trim()).filter(Boolean);
  const uniqueValues = [...new Set(values)];

  if (uniqueValues.length !== values.length) {
    throw badUserInput(`Question ${answerLabel(question)} has duplicate answers.`);
  }

  if (question.required && uniqueValues.length === 0) {
    throw badUserInput(`Question ${answerLabel(question)} is required.`);
  }

  const invalidValue = uniqueValues.find((value) => !question.options.includes(value));

  if (invalidValue !== undefined) {
    throw badUserInput(`Question ${answerLabel(question)} has an invalid option.`);
  }

  return {
    questionId: question.id,
    value: null,
    values: uniqueValues,
  };
};

export const normalizeResponseInput = (payload: SubmitResponsePayload): StoredAnswer[] => {
  const answersByQuestionId = new Map<string, AnswerInput>();

  for (const answer of payload.answers) {
    if (answersByQuestionId.has(answer.questionId)) {
      throw badUserInput('Each question can only have one answer entry.');
    }

    answersByQuestionId.set(answer.questionId, answer);
  }

  for (const questionId of answersByQuestionId.keys()) {
    const knownQuestion = payload.form.questions.some((question) => question.id === questionId);

    if (!knownQuestion) {
      throw badUserInput('Response contains an answer for an unknown question.');
    }
  }

  return payload.form.questions.map((question) => {
    const answer = answersByQuestionId.get(question.id);

    if (question.type === 'CHECKBOX') {
      return normalizeCheckboxAnswer(question, answer);
    }

    return normalizeSingleAnswer(question, answer);
  });
};
