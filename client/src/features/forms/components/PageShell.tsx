import { Link } from 'react-router-dom';

interface PageShellProps {
  eyebrow?: string;
  title: string;
  description?: string | undefined;
  action?: {
    label: string;
    to: string;
  };
  children: React.ReactNode;
}

export const PageShell = ({ action, children, description, eyebrow, title }: PageShellProps) => (
  <main className="page-shell">
    <header className="page-header">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {description ? <p className="page-description">{description}</p> : null}
      </div>
      {action ? (
        <Link className="button button-primary" to={action.to}>
          {action.label}
        </Link>
      ) : null}
    </header>
    {children}
  </main>
);
