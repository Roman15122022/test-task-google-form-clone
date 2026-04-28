import type { QuestionInput } from '@google-forms-lite/shared';

import type { BuilderQuestion, FormBuilderState } from '../services/formBuilderSlice';
import { isChoiceQuestion } from './questionTypes';

export const validateBuilderState = (builder: FormBuilderState): string[] => {
  const errors: string[] = [];

  if (builder.title.trim().length === 0) {
    errors.push('Form title is required.');
  }

  if (builder.questions.length === 0) {
    errors.push('Add at least one question.');
  }

  builder.questions.forEach((question, index) => {
    const label = `Question ${index + 1}`;

    if (question.title.trim().length === 0) {
      errors.push(`${label} needs a title.`);
    }

    if (isChoiceQuestion(question.type)) {
      const options = question.options.map((option) => option.value.trim()).filter(Boolean);
      const uniqueOptions = new Set(options.map((option) => option.toLocaleLowerCase()));

      if (options.length < 2) {
        errors.push(`${label} needs at least two options.`);
      }

      if (uniqueOptions.size !== options.length) {
        errors.push(`${label} has duplicate options.`);
      }
    }
  });

  return errors;
};

export const toQuestionInput = (question: BuilderQuestion): QuestionInput => ({
  title: question.title.trim(),
  type: question.type,
  required: question.required,
  options: isChoiceQuestion(question.type)
    ? question.options.map((option) => option.value.trim()).filter(Boolean)
    : [],
});

export const toQuestionInputs = (questions: readonly BuilderQuestion[]): QuestionInput[] =>
  questions.map(toQuestionInput);
