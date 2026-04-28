import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '@app/store';
import type { QuestionType } from '@google-forms-lite/shared';

import { isChoiceQuestion } from '../utils/questionTypes';

export interface BuilderOption {
  id: string;
  value: string;
}

export interface BuilderQuestion {
  id: string;
  title: string;
  type: QuestionType;
  required: boolean;
  options: BuilderOption[];
}

export interface FormBuilderState {
  title: string;
  description: string;
  questions: BuilderQuestion[];
}

const createBuilderOption = (value = ''): BuilderOption => ({
  id: nanoid(),
  value,
});

const createDefaultOptions = (type: QuestionType): BuilderOption[] =>
  isChoiceQuestion(type) ? [createBuilderOption('Option 1'), createBuilderOption('Option 2')] : [];

const createBuilderQuestion = (type: QuestionType): BuilderQuestion => ({
  id: nanoid(),
  title: '',
  type,
  required: false,
  options: createDefaultOptions(type),
});

const initialState: FormBuilderState = {
  title: '',
  description: '',
  questions: [createBuilderQuestion('TEXT')],
};

interface QuestionFieldPayload {
  questionId: string;
  value: string;
}

interface OptionFieldPayload {
  questionId: string;
  optionId: string;
  value: string;
}

const formBuilderSlice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    resetBuilder: () => ({
      ...initialState,
      questions: [createBuilderQuestion('TEXT')],
    }),
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    addQuestion: (state, action: PayloadAction<QuestionType>) => {
      state.questions.push(createBuilderQuestion(action.payload));
    },
    removeQuestion: (state, action: PayloadAction<string>) => {
      state.questions = state.questions.filter((question) => question.id !== action.payload);
    },
    updateQuestionTitle: (state, action: PayloadAction<QuestionFieldPayload>) => {
      const question = state.questions.find((item) => item.id === action.payload.questionId);

      if (question !== undefined) {
        question.title = action.payload.value;
      }
    },
    updateQuestionType: (
      state,
      action: PayloadAction<{
        questionId: string;
        type: QuestionType;
      }>,
    ) => {
      const question = state.questions.find((item) => item.id === action.payload.questionId);

      if (question !== undefined) {
        question.type = action.payload.type;
        question.options = createDefaultOptions(action.payload.type);
      }
    },
    toggleQuestionRequired: (state, action: PayloadAction<string>) => {
      const question = state.questions.find((item) => item.id === action.payload);

      if (question !== undefined) {
        question.required = !question.required;
      }
    },
    addOption: (state, action: PayloadAction<string>) => {
      const question = state.questions.find((item) => item.id === action.payload);

      if (question !== undefined) {
        question.options.push(createBuilderOption(`Option ${question.options.length + 1}`));
      }
    },
    updateOption: (state, action: PayloadAction<OptionFieldPayload>) => {
      const question = state.questions.find((item) => item.id === action.payload.questionId);
      const option = question?.options.find((item) => item.id === action.payload.optionId);

      if (option !== undefined) {
        option.value = action.payload.value;
      }
    },
    removeOption: (
      state,
      action: PayloadAction<{
        questionId: string;
        optionId: string;
      }>,
    ) => {
      const question = state.questions.find((item) => item.id === action.payload.questionId);

      if (question !== undefined) {
        question.options = question.options.filter(
          (option) => option.id !== action.payload.optionId,
        );
      }
    },
  },
});

export const {
  addOption,
  addQuestion,
  removeOption,
  removeQuestion,
  resetBuilder,
  setDescription,
  setTitle,
  toggleQuestionRequired,
  updateOption,
  updateQuestionTitle,
  updateQuestionType,
} = formBuilderSlice.actions;

export const selectFormBuilder = (state: RootState): FormBuilderState => state.formBuilder;

export default formBuilderSlice.reducer;
