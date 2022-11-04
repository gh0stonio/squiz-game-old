'use client';
import 'client-only';
import React from 'react';

import { useAuth } from '~/context/AuthContext';
import LogoutButton from '~/login/components/LogoutButton';

export default function ClientComponent() {
  const { user } = useAuth();
  console.log('rendering ClientComponent');

  React.useEffect(() => {
    console.log('post rendering ClientComponent');
  }, []);

  return (
    <p>
      I am a client component {user?.name} <LogoutButton />
    </p>
  );
}
