import { BarChart3, ClipboardList, Eye, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useFormsQuery } from '@app/api/formsApi';

import { EmptyState, ErrorState, LoadingState } from '../components/StatusState';
import {
  ghostButton,
  headingEyebrow,
  pageContent,
  pageFrame,
  panel,
  primaryButton,
  secondaryButton,
} from '../uiClasses';

export const HomePage = () => {
  const { data, error, isLoading } = useFormsQuery();
  const forms = data?.forms ?? [];

  return (
    <main className={pageFrame}>
      <div className={pageContent}>
        <section className="mb-6 flex min-h-64 flex-col items-stretch justify-between gap-6 rounded-lg border border-slate-200 bg-white bg-gradient-to-br from-blue-50 to-emerald-50 p-6 shadow-panel md:flex-row md:items-end md:p-10">
          <div>
            <p className={headingEyebrow}>Google Forms Lite</p>
            <h1 className="m-0 max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl">
              Build forms, collect answers, review responses.
            </h1>
          </div>
          <Link className={primaryButton} to="/forms/new">
            <Plus aria-hidden="true" size={18} />
            Create form
          </Link>
        </section>

        <section className={panel}>
          <div className="mb-5 flex items-center gap-2.5">
            <ClipboardList aria-hidden="true" size={20} />
            <h2 className="m-0 text-2xl font-extrabold">Forms</h2>
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {forms.map((form) => (
              <article
                className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-panel"
                key={form.id}
              >
                <div>
                  <h3 className="m-0 mb-2 text-lg font-extrabold">{form.title}</h3>
                  {form.description ? (
                    <p className="m-0 text-slate-500">{form.description}</p>
                  ) : (
                    <p className="m-0 text-slate-500">No description</p>
                  )}
                </div>
                <div className="flex items-center justify-between gap-3 text-sm text-slate-500">
                  <span>{form.questions.length} questions</span>
                  <span>{new Date(form.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <Link className={secondaryButton} to={`/forms/${form.id}/fill`}>
                    <Eye aria-hidden="true" size={16} />
                    Fill
                  </Link>
                  <Link className={ghostButton} to={`/forms/${form.id}/responses`}>
                    <BarChart3 aria-hidden="true" size={16} />
                    Responses
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};
