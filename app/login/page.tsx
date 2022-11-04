import 'server-only';
import React from 'react';

import LoginButton from './components/LoginButton';
import LogoutButton from './components/LogoutButton';

export default function LoginPage() {
  return (
    <div>
      <h1>Login page</h1>
      <LoginButton />
      <LogoutButton />
    </div>
  );
}
