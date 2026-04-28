import { Link, useParams } from 'react-router-dom';

import { useFormQuery, useResponsesQuery } from '@app/api/formsApi';

import { PageShell } from '../components/PageShell';
import { EmptyState, ErrorState, LoadingState } from '../components/StatusState';
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
      <section className="content-panel responses-layout">
        {responses.length === 0 ? (
          <EmptyState
            title="No responses yet"
            description="Share the fill link to collect answers."
          />
        ) : (
          responses.map((response) => (
            <article className="response-card" key={response.id}>
              <header>
                <h2>Response</h2>
                <span>{new Date(response.submittedAt).toLocaleString()}</span>
              </header>
              <dl className="response-answers">
                {form.questions.map((question) => {
                  const answer = response.answers.find((item) => item.questionId === question.id);

                  return (
                    <div key={question.id}>
                      <dt>{question.title}</dt>
                      <dd>{formatAnswer(question, answer)}</dd>
                    </div>
                  );
                })}
              </dl>
            </article>
          ))
        )}
        <Link className="button button-secondary" to="/">
          Back to forms
        </Link>
      </section>
    </PageShell>
  );
};
