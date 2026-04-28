import type { QuestionFieldsFragment } from '@app/api/generated';

import { textInput } from '../uiClasses';
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
    <fieldset className="grid gap-3 rounded-lg border border-slate-200 p-5">
      <legend className="px-2 font-extrabold">
        {question.title}
        {question.required ? <span className="ml-1 text-orange-700">*</span> : null}
      </legend>

      {question.type === 'TEXT' ? (
        <input
          className={textInput}
          placeholder="Your answer"
          value={value}
          onChange={(event) => onValueChange(question.id, event.target.value)}
        />
      ) : null}

      {question.type === 'DATE' ? (
        <input
          className={textInput}
          type="date"
          value={value}
          onChange={(event) => onValueChange(question.id, event.target.value)}
        />
      ) : null}

      {question.type === 'MULTIPLE_CHOICE' ? (
        <div className="grid gap-2.5">
          {question.options.map((option) => (
            <label className="inline-flex items-center gap-2 text-slate-700" key={option}>
              <input
                className="size-4 accent-blue-600"
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
        <div className="grid gap-2.5">
          {question.options.map((option) => (
            <label className="inline-flex items-center gap-2 text-slate-700" key={option}>
              <input
                className="size-4 accent-blue-600"
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
