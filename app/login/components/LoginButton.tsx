'use client';
import 'client-only';
import { useRouter } from 'next/navigation';
import React from 'react';

import { useAuth } from '~/context/AuthContext';

export default function LoginButton() {
  const auth = useAuth();
  const router = useRouter();

  const [error, setError] = React.useState();

  const logIn = React.useCallback(() => {
    auth.logIn().then(
      () => router.push('/'),
      (e) => setError(e),
    );
  }, [auth, router]);

  return (
    <>
      <button onClick={logIn}>Sign In</button>
      {error && (
        <p>Only Datadog pups can join, retry with the proper Gmail account.</p>
      )}
    </>
  );
}
