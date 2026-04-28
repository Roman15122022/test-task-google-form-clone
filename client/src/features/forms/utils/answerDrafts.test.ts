import { describe, expect, it } from 'vitest';

import type { FormFieldsFragment } from '@app/api/generated';

import {
  createInitialAnswerDrafts,
  serializeAnswerDrafts,
  setDraftValue,
  toggleDraftValue,
  validateAnswerDrafts,
} from './answerDrafts';

const form: FormFieldsFragment = {
  id: 'form-1',
  title: 'Feedback',
  description: null,
  createdAt: '2026-04-27T00:00:00.000Z',
  questions: [
    {
      id: 'question-1',
      title: 'Name',
      type: 'TEXT',
      required: true,
      options: [],
    },
    {
      id: 'question-2',
      title: 'Topics',
      type: 'CHECKBOX',
      required: false,
      options: ['Support', 'Product'],
    },
  ],
};

describe('answerDrafts', () => {
  it('creates empty drafts for all questions', () => {
    const drafts = createInitialAnswerDrafts(form);

    expect(Object.keys(drafts)).toEqual(['question-1', 'question-2']);
  });

  it('validates required answers', () => {
    const drafts = createInitialAnswerDrafts(form);

    expect(validateAnswerDrafts(form, drafts)).toEqual(['"Name" is required.']);
  });

  it('serializes text and checkbox answers', () => {
    const withName = setDraftValue(createInitialAnswerDrafts(form), 'question-1', 'Ada');
    const withTopic = toggleDraftValue(withName, 'question-2', 'Product');

    expect(serializeAnswerDrafts(form, withTopic)).toEqual([
      {
        questionId: 'question-1',
        value: 'Ada',
      },
      {
        questionId: 'question-2',
        values: ['Product'],
      },
    ]);
  });
});
