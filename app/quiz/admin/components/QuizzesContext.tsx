'use client';
import 'client-only';
import React from 'react';

import type { Quiz } from '~/types';

export const QuizzesContext = React.createContext<{
  quizzes: Quiz[];
  setQuizzes: React.Dispatch<React.SetStateAction<Quiz[]>>;
}>({
  quizzes: [],
  setQuizzes: () => [],
});

export default function QuizzesProvider({
  children,
  initialQuizzes = [],
}: React.PropsWithChildren<{ initialQuizzes?: Quiz[] }>) {
  const [quizzes, setQuizzes] = React.useState(initialQuizzes);

  return (
    <QuizzesContext.Provider value={{ quizzes, setQuizzes }}>
      {children}
    </QuizzesContext.Provider>
  );
}
