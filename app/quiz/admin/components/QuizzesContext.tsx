'use client';
import 'client-only';
import { onSnapshot, collection, orderBy, query } from 'firebase/firestore';
import React from 'react';

import { db, genericConverter } from '~/shared/lib/firebaseClient';
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

  React.useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'quizzes'), orderBy('createdAt')).withConverter(
        genericConverter<Quiz>(),
      ),
      (querySnapshot) => {
        setQuizzes(querySnapshot.docs.map((doc) => doc.data()));
      },
    );

    return unsubscribe;
  }, []);

  return (
    <QuizzesContext.Provider value={{ quizzes, setQuizzes }}>
      {children}
    </QuizzesContext.Provider>
  );
}
