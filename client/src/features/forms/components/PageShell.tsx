import { Link } from 'react-router-dom';

import {
  headingEyebrow,
  pageContent,
  pageDescription,
  pageFrame,
  pageTitle,
  primaryButton,
} from '../uiClasses';

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
  <main className={pageFrame}>
    <div className={pageContent}>
      <header className="mb-6 flex flex-col items-stretch gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          {eyebrow ? <p className={headingEyebrow}>{eyebrow}</p> : null}
          <h1 className={pageTitle}>{title}</h1>
          {description ? <p className={pageDescription}>{description}</p> : null}
        </div>
        {action ? (
          <Link className={primaryButton} to={action.to}>
            {action.label}
          </Link>
        ) : null}
      </header>
      {children}
    </div>
  </main>
);
