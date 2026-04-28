import { Plus, Trash2 } from 'lucide-react';

import type { BuilderQuestion } from '../services/formBuilderSlice';
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
  <article className="question-card">
    <div className="question-card-header">
      <span className="question-number">{index + 1}</span>
      <input
        aria-label={`Question ${index + 1} title`}
        className="text-input question-title-input"
        placeholder="Question title"
        value={question.title}
        onChange={(event) => onTitleChange(question.id, event.target.value)}
      />
      <select
        aria-label={`Question ${index + 1} type`}
        className="select-input"
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
      <div className="options-list">
        {question.options.map((option, optionIndex) => (
          <div className="option-row" key={option.id}>
            <span className="option-dot">{optionIndex + 1}</span>
            <input
              aria-label={`Option ${optionIndex + 1}`}
              className="text-input"
              value={option.value}
              onChange={(event) => onOptionChange(question.id, option.id, event.target.value)}
            />
            <button
              aria-label={`Remove option ${optionIndex + 1}`}
              className="icon-button"
              type="button"
              onClick={() => onOptionRemove(question.id, option.id)}
            >
              <Trash2 aria-hidden="true" size={16} />
            </button>
          </div>
        ))}
        <button
          className="button button-ghost"
          type="button"
          onClick={() => onAddOption(question.id)}
        >
          <Plus aria-hidden="true" size={16} />
          Add option
        </button>
      </div>
    ) : null}

    <footer className="question-card-footer">
      <label className="switch-row">
        <input
          checked={question.required}
          type="checkbox"
          onChange={() => onRequiredToggle(question.id)}
        />
        Required
      </label>
      <button
        className="button button-danger"
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
