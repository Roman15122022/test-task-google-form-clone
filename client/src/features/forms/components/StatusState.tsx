import { errorStatusPanel, statusPanel } from '../uiClasses';

interface StatusStateProps {
  title: string;
  description?: string;
}

export const LoadingState = () => (
  <section className={statusPanel}>
    <div className="size-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
    <p>Loading...</p>
  </section>
);

export const EmptyState = ({ description, title }: StatusStateProps) => (
  <section className={statusPanel}>
    <h2 className="m-0 text-xl font-extrabold text-slate-950">{title}</h2>
    {description ? <p>{description}</p> : null}
  </section>
);

export const ErrorState = ({ description, title }: StatusStateProps) => (
  <section className={errorStatusPanel}>
    <h2 className="m-0 text-xl font-extrabold text-slate-950">{title}</h2>
    {description ? <p>{description}</p> : null}
  </section>
);
