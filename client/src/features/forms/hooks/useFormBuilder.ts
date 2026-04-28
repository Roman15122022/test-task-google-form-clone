import { useAppDispatch, useAppSelector } from '@app/hooks';
import type { QuestionType } from '@google-forms-lite/shared';

import {
  addOption,
  addQuestion,
  removeOption,
  removeQuestion,
  resetBuilder,
  selectFormBuilder,
  setDescription,
  setTitle,
  toggleQuestionRequired,
  updateOption,
  updateQuestionTitle,
  updateQuestionType,
} from '../services/formBuilderSlice';

export const useFormBuilder = () => {
  const dispatch = useAppDispatch();
  const builder = useAppSelector(selectFormBuilder);

  return {
    builder,
    setTitle: (value: string) => dispatch(setTitle(value)),
    setDescription: (value: string) => dispatch(setDescription(value)),
    addQuestion: (type: QuestionType) => dispatch(addQuestion(type)),
    removeQuestion: (questionId: string) => dispatch(removeQuestion(questionId)),
    updateQuestionTitle: (questionId: string, value: string) =>
      dispatch(
        updateQuestionTitle({
          questionId,
          value,
        }),
      ),
    updateQuestionType: (questionId: string, type: QuestionType) =>
      dispatch(
        updateQuestionType({
          questionId,
          type,
        }),
      ),
    toggleQuestionRequired: (questionId: string) => dispatch(toggleQuestionRequired(questionId)),
    addOption: (questionId: string) => dispatch(addOption(questionId)),
    updateOption: (questionId: string, optionId: string, value: string) =>
      dispatch(
        updateOption({
          questionId,
          optionId,
          value,
        }),
      ),
    removeOption: (questionId: string, optionId: string) =>
      dispatch(
        removeOption({
          questionId,
          optionId,
        }),
      ),
    resetBuilder: () => dispatch(resetBuilder()),
  };
};
