import 'server-only';
import React from 'react';

export default function ServerComponent() {
  console.log('rendering ServerComponent');

  return <p>I am a server component</p>;
}
