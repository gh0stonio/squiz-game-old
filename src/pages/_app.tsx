import '~/styles/globals.scss';

import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';

import { AuthProvider } from '~/context/Auth';
import { QuizzesProvider } from '~/context/Quizzes';
import { BaseLayout } from '~/layouts/BaseLayout';
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
        <ChakraProvider>
          {getLayout(<Component {...pageProps} />)}
        </ChakraProvider>
      </QuizzesProvider>
    </AuthProvider>
  );
}

export default MyApp;
