import type { QuestionType } from '@google-forms-lite/shared';

export interface QuestionTypeOption {
  label: string;
  value: QuestionType;
  helper: string;
}

export const questionTypeOptions: readonly QuestionTypeOption[] = [
  {
    label: 'Text',
    value: 'TEXT',
    helper: 'Short free-text answer',
  },
  {
    label: 'Multiple choice',
    value: 'MULTIPLE_CHOICE',
    helper: 'Single option selection',
  },
  {
    label: 'Checkboxes',
    value: 'CHECKBOX',
    helper: 'Multiple option selection',
  },
  {
    label: 'Date',
    value: 'DATE',
    helper: 'Calendar date answer',
  },
];

export const isChoiceQuestion = (type: QuestionType): boolean =>
  type === 'MULTIPLE_CHOICE' || type === 'CHECKBOX';
