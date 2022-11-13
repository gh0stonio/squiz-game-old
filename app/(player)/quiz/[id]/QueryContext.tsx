'use client';
import 'client-only';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import type { Quiz } from '~/shared/types';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const QueryContext = React.createContext<{
  initialData: { quiz: Quiz };
}>({ initialData: { quiz: {} as Quiz } });

interface QueryContextProps {
  initialData: { quiz: Quiz };
}
export default function QueryContextProvider({
  children,
  initialData,
}: React.PropsWithChildren<QueryContextProps>) {
  return (
    <QueryContext.Provider value={{ initialData }}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </QueryContext.Provider>
  );
}
