import 'server-only';
import React from 'react';

import NavBar from '~/shared/components/NavBar';

export default async function QuizLayout({
  children,
}: React.PropsWithChildren) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <NavBar />
      <div className="m-auto mb-10 h-5/6 w-11/12 rounded-xl bg-gray-100 shadow-xl [&>div]:h-full [&>div]:w-full">
        {children}
      </div>
    </div>
  );
}
