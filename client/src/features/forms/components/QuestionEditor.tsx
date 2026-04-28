import { Plus, Trash2 } from 'lucide-react';

import type { BuilderQuestion } from '../services/formBuilderSlice';
import { dangerButton, ghostButton, iconButton, secondaryButton, textInput } from '../uiClasses';
import { isChoiceQuestion, questionTypeOptions } from '../utils/questionTypes';

interface QuestionEditorProps {
  question: BuilderQuestion;
  index: number;
  canRemove: boolean;
  onTitleChange: (questionId: string, value: string) => void;
  onTypeChange: (questionId: string, value: BuilderQuestion['type']) => void;
  onRequiredToggle: (questionId: string) => void;
  onRemove: (questionId: string) => void;
  onAddOption: (questionId: string) => void;
  onOptionChange: (questionId: string, optionId: string, value: string) => void;
  onOptionRemove: (questionId: string, optionId: string) => void;
}

export const QuestionEditor = ({
  canRemove,
  index,
  onAddOption,
  onOptionChange,
  onOptionRemove,
  onRemove,
  onRequiredToggle,
  onTitleChange,
  onTypeChange,
  question,
}: QuestionEditorProps) => (
  <article className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
    <div className="grid items-center gap-3 md:grid-cols-[42px_1fr_minmax(180px,240px)]">
      <span className="inline-flex size-10 items-center justify-center rounded-full bg-slate-100 font-extrabold text-slate-500">
        {index + 1}
      </span>
      <input
        aria-label={`Question ${index + 1} title`}
        className={`${textInput} font-bold`}
        placeholder="Question title"
        value={question.title}
        onChange={(event) => onTitleChange(question.id, event.target.value)}
      />
      <select
        aria-label={`Question ${index + 1} type`}
        className={textInput}
        value={question.type}
        onChange={(event) =>
          onTypeChange(question.id, event.target.value as BuilderQuestion['type'])
        }
      >
        {questionTypeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>

    {isChoiceQuestion(question.type) ? (
      <div className="grid gap-2.5 md:pl-14">
        {question.options.map((option, optionIndex) => (
          <div className="grid grid-cols-[28px_1fr_40px] items-center gap-2.5" key={option.id}>
            <span className="inline-flex size-7 items-center justify-center rounded-full bg-slate-100 text-sm font-extrabold text-slate-500">
              {optionIndex + 1}
            </span>
            <input
              aria-label={`Option ${optionIndex + 1}`}
              className={textInput}
              value={option.value}
              onChange={(event) => onOptionChange(question.id, option.id, event.target.value)}
            />
            <button
              aria-label={`Remove option ${optionIndex + 1}`}
              className={iconButton}
              type="button"
              onClick={() => onOptionRemove(question.id, option.id)}
            >
              <Trash2 aria-hidden="true" size={16} />
            </button>
          </div>
        ))}
        <button className={ghostButton} type="button" onClick={() => onAddOption(question.id)}>
          <Plus aria-hidden="true" size={16} />
          Add option
        </button>
      </div>
    ) : null}

    <footer className="flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
      <label className="inline-flex items-center gap-2 text-sm font-bold text-slate-600">
        <input
          className="size-4 accent-blue-600"
          checked={question.required}
          type="checkbox"
          onChange={() => onRequiredToggle(question.id)}
        />
        Required
      </label>
      <button
        className={canRemove ? dangerButton : secondaryButton}
        disabled={!canRemove}
        type="button"
        onClick={() => onRemove(question.id)}
      >
        <Trash2 aria-hidden="true" size={16} />
        Remove
      </button>
    </footer>
  </article>
);
