import { Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { useFormQuery, useSubmitResponseMutation } from '@app/api/formsApi';

import { PageShell } from '../components/PageShell';
import { QuestionField } from '../components/QuestionField';
import { EmptyState, ErrorState, LoadingState } from '../components/StatusState';
import {
  createInitialAnswerDrafts,
  serializeAnswerDrafts,
  setDraftValue,
  toggleDraftValue,
  validateAnswerDrafts,
  type AnswerDrafts,
} from '../utils/answerDrafts';

export const FormFillerPage = () => {
  const { id } = useParams<{ id: string }>();
  const formId = id ?? '';
  const { data, error, isLoading } = useFormQuery(
    {
      id: formId,
    },
    {
      skip: formId.length === 0,
    },
  );
  const [submitResponse, submitResponseState] = useSubmitResponseMutation();
  const [drafts, setDrafts] = useState<AnswerDrafts>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const form = data?.form ?? null;

  useEffect(() => {
    if (form !== null) {
      setDrafts(createInitialAnswerDrafts(form));
      setErrors([]);
      setSubmitted(false);
    }
  }, [form]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (form === null) {
      return;
    }

    const validationErrors = validateAnswerDrafts(form, drafts);
    setErrors(validationErrors);

    if (validationErrors.length > 0) {
      return;
    }

    await submitResponse({
      formId: form.id,
      answers: serializeAnswerDrafts(form, drafts),
    }).unwrap();

    setSubmitted(true);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState title="Could not load form" description="Check that the form exists." />;
  }

  if (form === null) {
    return <EmptyState title="Form not found" description="Return home and choose another form." />;
  }

  return (
    <PageShell eyebrow="Fill form" title={form.title} description={form.description ?? undefined}>
      <form className="content-panel fill-layout" onSubmit={(event) => void handleSubmit(event)}>
        {errors.length > 0 ? (
          <section className="alert-list" role="alert">
            {errors.map((validationError) => (
              <p key={validationError}>{validationError}</p>
            ))}
          </section>
        ) : null}

        {submitted ? (
          <section className="success-panel" role="status">
            <h2>Form submitted successfully.</h2>
            <Link className="button button-secondary" to="/">
              Back to forms
            </Link>
          </section>
        ) : (
          <>
            {form.questions.map((question) => (
              <QuestionField
                draft={drafts[question.id]}
                key={question.id}
                question={question}
                onToggleValue={(questionId, value) =>
                  setDrafts((currentDrafts) => toggleDraftValue(currentDrafts, questionId, value))
                }
                onValueChange={(questionId, value) =>
                  setDrafts((currentDrafts) => setDraftValue(currentDrafts, questionId, value))
                }
              />
            ))}

            <button
              className="button button-primary submit-button"
              disabled={submitResponseState.isLoading}
              type="submit"
            >
              <Send aria-hidden="true" size={16} />
              {submitResponseState.isLoading ? 'Submitting...' : 'Submit'}
            </button>
          </>
        )}
      </form>
    </PageShell>
  );
};
