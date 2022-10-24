import '~/styles/globals.scss';

import type { AppProps } from 'next/app';

import { AuthProvider } from '~/hooks/useAuth';
import { QuizzesProvider } from '~/hooks/useQuizzes';
import { BaseLayout } from '~/layouts/base/BaseLayout';
import { type NextPageWithLayout } from '~/types';

function MyApp({
  Component,
  pageProps,
}: AppProps & {
  Component: NextPageWithLayout;
}) {
  const getLayout =
    Component.getLayout ?? ((page) => <BaseLayout>{page}</BaseLayout>);

  return (
    <AuthProvider>
      <QuizzesProvider>
        {getLayout(<Component {...pageProps} />)}
      </QuizzesProvider>
    </AuthProvider>
  );
}

export default MyApp;
