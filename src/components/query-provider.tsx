'use client';

/**
 * React Query provider for the Talent Portal.
 *
 * Configured for a candidate-facing experience:
 *   - `retry: 1` so flaky sandbox networks do not surface errors immediately
 *   - `refetchOnWindowFocus: false` so backgrounded tabs do not refresh
 *     sensitive candidate data without user intent
 *   - `staleTime: 30_000` to deduplicate rapid navigations
 */

import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // `React.useState` (not bare `useState`) is intentional: the bundler's
  // automatic JSX runtime sometimes does not pull in `useState` when only
  // `useMemo`/`useEffect` are used elsewhere. Importing `* as React` keeps the
  // reference stable across the React 19 / Next.js 16 toolchain.
  const [client] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 30_000,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
