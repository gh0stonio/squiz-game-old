import 'react-toastify/dist/ReactToastify.css';
import 'server-only';

import '~/shared/styles/globals.css';

import React from 'react';

import ToastContainer from '~/shared/components/ToastContainer';
import AuthProvider from '~/shared/context/AuthContext';
import { getUser } from '~/shared/data/getUser';

export default async function RootLayout({
  children,
}: React.PropsWithChildren) {
  const user = await getUser();

  return (
    <html lang="en">
      <head>
        <title>Squiz Game</title>
        <meta name="google" content="notranslate" />
        <meta httpEquiv="Content-Language" content="en" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Squiz Game" />
      </head>
      <body>
        <div className="h-screen w-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-700 text-black antialiased">
          <AuthProvider userFromServerAuth={user}>{children}</AuthProvider>
        </div>

        <ToastContainer />
      </body>
    </html>
  );
}
