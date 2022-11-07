'use client';
import 'client-only';
import React from 'react';

import type { Question, Quiz } from '~/types';

export const QuizContext = React.createContext<{
  quiz?: Quiz;
  setQuiz: React.Dispatch<React.SetStateAction<Quiz | undefined>>;
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
}>({
  quiz: undefined,
  setQuiz: () => ({}),
  questions: [],
  setQuestions: () => ({}),
});

export default function QuizProvider({
  children,
  initialQuiz,
}: React.PropsWithChildren<{ initialQuiz?: Quiz }>) {
  const [quiz, setQuiz] = React.useState<Quiz | undefined>(initialQuiz);
  const [questions, setQuestions] = React.useState<Question[]>(
    quiz?.questions || [],
  );

  return (
    <QuizContext.Provider value={{ quiz, setQuiz, questions, setQuestions }}>
      {children}
    </QuizContext.Provider>
  );
}
