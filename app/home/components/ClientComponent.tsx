'use client';
import 'client-only';
import React from 'react';

import { useAuth } from '~/shared/context/AuthContext';

export default function ClientComponent() {
  const { user } = useAuth();
  console.log('rendering ClientComponent');

  React.useEffect(() => {
    console.log('post rendering ClientComponent');
  }, []);

  return <p>I am a client component {user?.name}</p>;
}
