'use client';
import 'client-only';
import { deleteDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import React from 'react';

import { db } from '~/shared/lib/firebaseClient';
import { Quiz } from '~/types';

const QuizzesContext = React.createContext<{
  quizzes: Quiz[];
  setQuizzes: React.Dispatch<React.SetStateAction<Quiz[]>>;
}>({
  quizzes: [],
  setQuizzes: () => [],
});

export function useQuizzes() {
  const { quizzes, setQuizzes } = React.useContext(QuizzesContext);

  function deleteQuiz(quizId: Quiz['id']) {
    deleteDoc(doc(db, 'quizzes', quizId)).then(
      () => {
        setQuizzes((_quizzes) => _quizzes.filter((quiz) => quiz.id !== quizId));
        toast.success('Quiz deleted !', {
          theme: 'colored',
        });
      },
      () => {
        toast.error('Failed deleting the Quiz !', {
          theme: 'colored',
        });
      },
    );
  }

  return { quizzes, deleteQuiz };
}

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
