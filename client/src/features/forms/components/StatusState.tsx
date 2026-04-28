interface StatusStateProps {
  title: string;
  description?: string;
}

export const LoadingState = () => (
  <section className="status-state">
    <div className="spinner" />
    <p>Loading...</p>
  </section>
);

export const EmptyState = ({ description, title }: StatusStateProps) => (
  <section className="status-state">
    <h2>{title}</h2>
    {description ? <p>{description}</p> : null}
  </section>
);

export const ErrorState = ({ description, title }: StatusStateProps) => (
  <section className="status-state status-state-error">
    <h2>{title}</h2>
    {description ? <p>{description}</p> : null}
  </section>
);
