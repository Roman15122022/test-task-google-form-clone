import type { QuestionFieldsFragment } from '@app/api/generated';

import type { AnswerDraft } from '../utils/answerDrafts';

interface QuestionFieldProps {
  draft: AnswerDraft | undefined;
  question: QuestionFieldsFragment;
  onValueChange: (questionId: string, value: string) => void;
  onToggleValue: (questionId: string, value: string) => void;
}

export const QuestionField = ({
  draft,
  onToggleValue,
  onValueChange,
  question,
}: QuestionFieldProps) => {
  const value = draft?.value ?? '';
  const values = draft?.values ?? [];

  return (
    <fieldset className="fill-question">
      <legend>
        {question.title}
        {question.required ? <span className="required-mark">*</span> : null}
      </legend>

      {question.type === 'TEXT' ? (
        <input
          className="text-input"
          placeholder="Your answer"
          value={value}
          onChange={(event) => onValueChange(question.id, event.target.value)}
        />
      ) : null}

      {question.type === 'DATE' ? (
        <input
          className="text-input"
          type="date"
          value={value}
          onChange={(event) => onValueChange(question.id, event.target.value)}
        />
      ) : null}

      {question.type === 'MULTIPLE_CHOICE' ? (
        <div className="choice-stack">
          {question.options.map((option) => (
            <label className="choice-row" key={option}>
              <input
                checked={value === option}
                name={question.id}
                type="radio"
                value={option}
                onChange={() => onValueChange(question.id, option)}
              />
              {option}
            </label>
          ))}
        </div>
      ) : null}

      {question.type === 'CHECKBOX' ? (
        <div className="choice-stack">
          {question.options.map((option) => (
            <label className="choice-row" key={option}>
              <input
                checked={values.includes(option)}
                type="checkbox"
                value={option}
                onChange={() => onToggleValue(question.id, option)}
              />
              {option}
            </label>
          ))}
        </div>
      ) : null}
    </fieldset>
  );
};
