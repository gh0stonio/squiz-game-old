import '~/styles/globals.scss';

import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';

import { BaseLayout } from '~/layouts/base/Base';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <BaseLayout>
        <Component {...pageProps} />
      </BaseLayout>
    </QueryClientProvider>
  );
}

export default MyApp;
