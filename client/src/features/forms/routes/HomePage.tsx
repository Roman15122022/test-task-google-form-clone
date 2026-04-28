import { BarChart3, ClipboardList, Eye, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useFormsQuery } from '@app/api/formsApi';

import { EmptyState, ErrorState, LoadingState } from '../components/StatusState';

export const HomePage = () => {
  const { data, error, isLoading } = useFormsQuery();
  const forms = data?.forms ?? [];

  return (
    <main className="home-layout">
      <section className="home-hero">
        <div>
          <p className="eyebrow">Google Forms Lite</p>
          <h1>Build forms, collect answers, review responses.</h1>
          <p>A small in-memory GraphQL app with typed client and server contracts.</p>
        </div>
        <Link className="button button-primary" to="/forms/new">
          <Plus aria-hidden="true" size={18} />
          Create form
        </Link>
      </section>

      <section className="content-panel">
        <div className="section-heading">
          <ClipboardList aria-hidden="true" size={20} />
          <h2>Forms</h2>
        </div>

        {isLoading ? <LoadingState /> : null}
        {error ? (
          <ErrorState
            title="Could not load forms"
            description="Check that the server is running."
          />
        ) : null}
        {!isLoading && !error && forms.length === 0 ? (
          <EmptyState
            title="No forms yet"
            description="Create a form to start collecting responses."
          />
        ) : null}

        <div className="forms-grid">
          {forms.map((form) => (
            <article className="form-card" key={form.id}>
              <div>
                <h3>{form.title}</h3>
                {form.description ? <p>{form.description}</p> : <p>No description</p>}
              </div>
              <div className="form-card-meta">
                <span>{form.questions.length} questions</span>
                <span>{new Date(form.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="card-actions">
                <Link className="button button-secondary" to={`/forms/${form.id}/fill`}>
                  <Eye aria-hidden="true" size={16} />
                  Fill
                </Link>
                <Link className="button button-ghost" to={`/forms/${form.id}/responses`}>
                  <BarChart3 aria-hidden="true" size={16} />
                  Responses
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};
