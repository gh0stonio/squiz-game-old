import 'server-only';
import React from 'react';

import ClientComponent from './components/ClientComponent';
import ServerComponent from './components/ServerComponent';

export default function HomePage() {
  return (
    <div>
      <h1>Home page</h1>
      <ServerComponent />
      <ClientComponent />
    </div>
  );
}
