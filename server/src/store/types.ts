import type { QuestionType } from '@google-forms-lite/shared';

export interface StoredQuestion {
  id: string;
  title: string;
  type: QuestionType;
  required: boolean;
  options: string[];
}

export interface StoredForm {
  id: string;
  title: string;
  description: string | null;
  questions: StoredQuestion[];
  createdAt: string;
}

export interface StoredAnswer {
  questionId: string;
  value: string | null;
  values: string[];
}

export interface StoredResponse {
  id: string;
  formId: string;
  answers: StoredAnswer[];
  submittedAt: string;
}
