'use client';
import 'client-only';
import { useRouter } from 'next/navigation';
import React from 'react';

import { useAuth } from '~/context/AuthContext';

export default function LogoutButton() {
  const auth = useAuth();
  const router = useRouter();

  const logOut = React.useCallback(() => {
    auth.logOut().then(() => {
      router.push('/login');
    });
  }, [auth, router]);

  return <button onClick={logOut}>Sign Out</button>;
}
