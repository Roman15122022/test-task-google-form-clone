import { Route, Routes } from 'react-router-dom';

import { FormBuilderPage } from '@features/forms/routes/FormBuilderPage';
import { FormFillerPage } from '@features/forms/routes/FormFillerPage';
import { FormResponsesPage } from '@features/forms/routes/FormResponsesPage';
import { HomePage } from '@features/forms/routes/HomePage';

export const App = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/forms/new" element={<FormBuilderPage />} />
    <Route path="/forms/:id/fill" element={<FormFillerPage />} />
    <Route path="/forms/:id/responses" element={<FormResponsesPage />} />
  </Routes>
);
