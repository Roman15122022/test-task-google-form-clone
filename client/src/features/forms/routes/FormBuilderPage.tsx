import { Plus, Save } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useCreateFormMutation } from '@app/api/formsApi';

import { PageShell } from '../components/PageShell';
import { QuestionEditor } from '../components/QuestionEditor';
import { useFormBuilder } from '../hooks/useFormBuilder';
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
      <form className="builder-layout" onSubmit={(event) => void handleSubmit(event)}>
        <section className="content-panel builder-panel">
          <label className="field-label">
            Form title
            <input
              className="text-input title-input"
              placeholder="Untitled form"
              value={builder.title}
              onChange={(event) => formBuilder.setTitle(event.target.value)}
            />
          </label>
          <label className="field-label">
            Description
            <textarea
              className="text-input textarea-input"
              placeholder="Describe what this form is for"
              value={builder.description}
              onChange={(event) => formBuilder.setDescription(event.target.value)}
            />
          </label>
        </section>

        {errors.length > 0 ? (
          <section className="alert-list" role="alert">
            {errors.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </section>
        ) : null}

        <section className="question-list">
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

        <section className="builder-actions">
          <div className="add-question-group">
            {questionTypeOptions.map((option) => (
              <button
                className="button button-secondary"
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
          <div className="submit-actions">
            <Link className="button button-ghost" to="/">
              Cancel
            </Link>
            <button
              className="button button-primary"
              disabled={createFormState.isLoading}
              type="submit"
            >
              <Save aria-hidden="true" size={16} />
              {createFormState.isLoading ? 'Saving...' : 'Save form'}
            </button>
          </div>
        </section>
      </form>
    </PageShell>
  );
};
