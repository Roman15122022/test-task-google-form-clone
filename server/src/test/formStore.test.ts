import { describe, expect, it } from 'vitest';

import { FormStore } from '../store/formStore.js';

const createSurvey = (store: FormStore) =>
  store.createForm({
    title: 'Customer feedback',
    description: 'Small post-call survey',
    questions: [
      {
        title: 'Your name',
        type: 'TEXT',
        required: true,
      },
      {
        title: 'Score',
        type: 'MULTIPLE_CHOICE',
        required: true,
        options: ['Good', 'Average', 'Bad'],
      },
      {
        title: 'Topics',
        type: 'CHECKBOX',
        required: false,
        options: ['Support', 'Pricing', 'Product'],
      },
    ],
  });

describe('FormStore', () => {
  it('creates and lists forms', () => {
    const store = new FormStore();
    const form = createSurvey(store);

    expect(store.listForms()).toHaveLength(1);
    expect(store.getForm(form.id)?.title).toBe('Customer feedback');
    expect(form.questions).toHaveLength(3);
  });

  it('stores submitted responses', () => {
    const store = new FormStore();
    const form = createSurvey(store);
    const [nameQuestion, scoreQuestion, topicsQuestion] = form.questions;

    if (nameQuestion === undefined || scoreQuestion === undefined || topicsQuestion === undefined) {
      throw new Error('Expected seed questions');
    }

    const response = store.submitResponse({
      formId: form.id,
      answers: [
        {
          questionId: nameQuestion.id,
          value: 'Ada',
        },
        {
          questionId: scoreQuestion.id,
          value: 'Good',
        },
        {
          questionId: topicsQuestion.id,
          values: ['Support', 'Product'],
        },
      ],
    });

    expect(response.answers).toHaveLength(3);
    expect(store.listResponses(form.id)).toHaveLength(1);
  });

  it('rejects invalid choice answers', () => {
    const store = new FormStore();
    const form = createSurvey(store);
    const [nameQuestion, scoreQuestion] = form.questions;

    if (nameQuestion === undefined || scoreQuestion === undefined) {
      throw new Error('Expected seed questions');
    }

    expect(() =>
      store.submitResponse({
        formId: form.id,
        answers: [
          {
            questionId: nameQuestion.id,
            value: 'Ada',
          },
          {
            questionId: scoreQuestion.id,
            value: 'Excellent',
          },
        ],
      }),
    ).toThrow('invalid option');
  });

  it('rejects missing required answers', () => {
    const store = new FormStore();
    const form = createSurvey(store);

    expect(() =>
      store.submitResponse({
        formId: form.id,
        answers: [],
      }),
    ).toThrow('required');
  });
});
