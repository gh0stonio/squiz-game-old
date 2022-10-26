import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import type { AppProps } from 'next/app';

import { AuthProvider } from '~/context/Auth';
import { QuizzesProvider } from '~/context/Quizzes';
import { BaseLayout } from '~/layouts/BaseLayout';
import { type NextPageWithLayout } from '~/types';

const theme = extendTheme({
  initialColorMode: 'light',
  useSystemColorMode: false,
  styles: {
    global: {
      'html, body': {
        backgroundColor: 'gray.800',
        color: 'gray.50',
      },
      '*': {
        boxSizing: 'border-box',
      },
      '#content > div': {
        width: '100%',
        height: '100%',
      },
      a: {
        color: 'teal.500 !important',
      },
    },
  },
});

export default function MyApp({
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
        <ChakraProvider theme={theme}>
          {getLayout(<Component {...pageProps} />)}
        </ChakraProvider>
      </QuizzesProvider>
    </AuthProvider>
  );
}
