import { describe, expect, it } from 'vitest';

import reducer, {
  addOption,
  addQuestion,
  resetBuilder,
  setTitle,
  updateQuestionType,
} from './formBuilderSlice';

describe('formBuilderSlice', () => {
  it('updates form title', () => {
    const state = reducer(undefined, setTitle('Registration'));

    expect(state.title).toBe('Registration');
  });

  it('creates choice defaults when type changes', () => {
    const state = reducer(
      undefined,
      updateQuestionType({ questionId: 'missing', type: 'CHECKBOX' }),
    );
    const baseQuestionId = state.questions[0]?.id;

    if (baseQuestionId === undefined) {
      throw new Error('Expected default question');
    }

    const nextState = reducer(
      state,
      updateQuestionType({
        questionId: baseQuestionId,
        type: 'CHECKBOX',
      }),
    );

    expect(nextState.questions[0]?.options).toHaveLength(2);
  });

  it('adds questions and options', () => {
    const withQuestion = reducer(undefined, addQuestion('MULTIPLE_CHOICE'));
    const choiceQuestion = withQuestion.questions[1];

    if (choiceQuestion === undefined) {
      throw new Error('Expected added question');
    }

    const withOption = reducer(withQuestion, addOption(choiceQuestion.id));

    expect(withOption.questions[1]?.options).toHaveLength(3);
  });

  it('resets to a fresh default question', () => {
    const dirtyState = reducer(undefined, setTitle('Draft'));
    const resetState = reducer(dirtyState, resetBuilder());

    expect(resetState.title).toBe('');
    expect(resetState.questions).toHaveLength(1);
  });
});
