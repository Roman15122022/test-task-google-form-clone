import { Plus, Save } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useCreateFormMutation } from '@app/api/formsApi';

import { PageShell } from '../components/PageShell';
import { QuestionEditor } from '../components/QuestionEditor';
import { useFormBuilder } from '../hooks/useFormBuilder';
import {
  alertPanel,
  fieldLabel,
  ghostButton,
  panel,
  primaryButton,
  secondaryButton,
  textInput,
} from '../uiClasses';
import { validateBuilderState, toQuestionInputs } from '../utils/builderValidation';
import { questionTypeOptions } from '../utils/questionTypes';

export const FormBuilderPage = () => {
  const navigate = useNavigate();
  const formBuilder = useFormBuilder();
  const [createForm, createFormState] = useCreateFormMutation();
  const [errors, setErrors] = useState<string[]>([]);
  const { builder } = formBuilder;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateBuilderState(builder);
    setErrors(validationErrors);

    if (validationErrors.length > 0) {
      return;
    }

    const result = await createForm({
      title: builder.title.trim(),
      description: builder.description.trim() || null,
      questions: toQuestionInputs(builder.questions),
    }).unwrap();

    formBuilder.resetBuilder();
    navigate(`/forms/${result.createForm.id}/fill`);
  };

  return (
    <PageShell
      eyebrow="Builder"
      title="Create a new form"
      description="Compose questions and save the form to the in-memory GraphQL store."
    >
      <form className="grid gap-5" onSubmit={(event) => void handleSubmit(event)}>
        <section className={`${panel} grid gap-4`}>
          <label className={fieldLabel}>
            Form title
            <input
              className={`${textInput} text-2xl font-extrabold`}
              placeholder="Untitled form"
              value={builder.title}
              onChange={(event) => formBuilder.setTitle(event.target.value)}
            />
          </label>
          <label className={fieldLabel}>
            Description
            <textarea
              className={`${textInput} min-h-24 resize-y`}
              placeholder="Describe what this form is for"
              value={builder.description}
              onChange={(event) => formBuilder.setDescription(event.target.value)}
            />
          </label>
        </section>

        {errors.length > 0 ? (
          <section className={alertPanel} role="alert">
            {errors.map((error) => (
              <p className="m-0" key={error}>
                {error}
              </p>
            ))}
          </section>
        ) : null}

        <section className="grid gap-4">
          {builder.questions.map((question, index) => (
            <QuestionEditor
              canRemove={builder.questions.length > 1}
              index={index}
              key={question.id}
              question={question}
              onAddOption={formBuilder.addOption}
              onOptionChange={formBuilder.updateOption}
              onOptionRemove={formBuilder.removeOption}
              onRemove={formBuilder.removeQuestion}
              onRequiredToggle={formBuilder.toggleQuestionRequired}
              onTitleChange={formBuilder.updateQuestionTitle}
              onTypeChange={formBuilder.updateQuestionType}
            />
          ))}
        </section>

        <section className="flex flex-col items-stretch justify-between gap-4 lg:flex-row lg:items-center">
          <div className="flex flex-wrap items-center gap-2.5">
            {questionTypeOptions.map((option) => (
              <button
                className={secondaryButton}
                key={option.value}
                type="button"
                title={option.helper}
                onClick={() => formBuilder.addQuestion(option.value)}
              >
                <Plus aria-hidden="true" size={16} />
                {option.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Link className={ghostButton} to="/">
              Cancel
            </Link>
            <button className={primaryButton} disabled={createFormState.isLoading} type="submit">
              <Save aria-hidden="true" size={16} />
              {createFormState.isLoading ? 'Saving...' : 'Save form'}
            </button>
          </div>
        </section>
      </form>
    </PageShell>
  );
};
