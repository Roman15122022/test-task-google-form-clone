import { configureStore } from '@reduxjs/toolkit';

import { formsApi } from '@app/api/formsApi';
import formBuilderReducer from '@features/forms/services/formBuilderSlice';

export const store = configureStore({
  reducer: {
    [formsApi.reducerPath]: formsApi.reducer,
    formBuilder: formBuilderReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(formsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
