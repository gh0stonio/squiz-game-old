import 'server-only';
import React from 'react';

import AuthProvider from './context/AuthContext';
import { getUser } from './misc/data/getUser';

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
        <AuthProvider userFromServerAuth={user}>{children}</AuthProvider>
      </body>
    </html>
  );
}
