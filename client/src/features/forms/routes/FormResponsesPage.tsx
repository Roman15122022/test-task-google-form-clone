import { Link, useParams } from 'react-router-dom';

import { useFormQuery, useResponsesQuery } from '@app/api/formsApi';

import { PageShell } from '../components/PageShell';
import { EmptyState, ErrorState, LoadingState } from '../components/StatusState';
import { panel, secondaryButton } from '../uiClasses';
import { formatAnswer } from '../utils/answerDrafts';

export const FormResponsesPage = () => {
  const { id } = useParams<{ id: string }>();
  const formId = id ?? '';
  const formQuery = useFormQuery(
    {
      id: formId,
    },
    {
      skip: formId.length === 0,
    },
  );
  const responsesQuery = useResponsesQuery(
    {
      formId,
    },
    {
      skip: formId.length === 0,
    },
  );
  const form = formQuery.data?.form ?? null;
  const responses = responsesQuery.data?.responses ?? [];

  if (formQuery.isLoading || responsesQuery.isLoading) {
    return <LoadingState />;
  }

  if (formQuery.error || responsesQuery.error) {
    return (
      <ErrorState
        title="Could not load responses"
        description="Check that the server is running."
      />
    );
  }

  if (form === null) {
    return <EmptyState title="Form not found" description="Return home and choose another form." />;
  }

  return (
    <PageShell
      eyebrow="Responses"
      title={form.title}
      description={`${responses.length} submitted response${responses.length === 1 ? '' : 's'}`}
    >
      <section className={`${panel} grid gap-5`}>
        {responses.length === 0 ? (
          <EmptyState
            title="No responses yet"
            description="Share the fill link to collect answers."
          />
        ) : (
          responses.map((response) => (
            <article
              className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-panel"
              key={response.id}
            >
              <header className="flex items-center justify-between gap-4 text-slate-500">
                <h2 className="m-0 text-xl font-extrabold text-slate-950">Response</h2>
                <span>{new Date(response.submittedAt).toLocaleString()}</span>
              </header>
              <dl className="m-0 grid gap-2.5">
                {form.questions.map((question) => {
                  const answer = response.answers.find((item) => item.questionId === question.id);

                  return (
                    <div
                      className="grid gap-2 border-t border-slate-200 pt-2.5 md:grid-cols-[minmax(180px,280px)_1fr]"
                      key={question.id}
                    >
                      <dt className="font-bold text-slate-500">{question.title}</dt>
                      <dd className="m-0">{formatAnswer(question, answer)}</dd>
                    </div>
                  );
                })}
              </dl>
            </article>
          ))
        )}
        <Link className={`${secondaryButton} justify-self-start`} to="/">
          Back to forms
        </Link>
      </section>
    </PageShell>
  );
};
