'use client';
import 'client-only';
import { data } from 'autoprefixer';
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  Unsubscribe,
} from 'firebase/firestore';
import React from 'react';

import { db, genericConverter } from '~/shared/lib/firebaseClient';
import type { Question, Quiz } from '~/types';

export const QuizContext = React.createContext<{
  quiz: Quiz;
  setQuiz: React.Dispatch<React.SetStateAction<Quiz>>;
}>({
  quiz: {} as Quiz,
  setQuiz: () => ({} as Quiz),
});

export default function QuizProvider({
  children,
  quiz: initialQuiz,
}: React.PropsWithChildren<{ quiz: Quiz }>) {
  const [quiz, setQuiz] = React.useState(initialQuiz);

  React.useEffect(() => {
    const unsubs: Unsubscribe[] = [];

    unsubs.push(
      onSnapshot(
        doc(db, 'quizzes', `${quiz.id}`).withConverter(
          genericConverter<Quiz>(),
        ),
        (quizDoc) => {
          const quizData = quizDoc.data();
          if (!quizData || quizDoc.metadata.hasPendingWrites) return;

          // subscribing to quiz questions updates
          unsubs.push(
            onSnapshot(
              query(
                collection(
                  db,
                  'quizzes',
                  `${quiz.id}`,
                  'questions',
                ).withConverter(genericConverter<Question>()),
                orderBy('createdAt'),
              ),
              (snapshot) => {
                const questions = snapshot.docs.map((doc) => doc.data());

                setQuiz((_quiz) => ({
                  ..._quiz,
                  questions,
                }));
              },
            ),
          );

          setQuiz(quizData);
        },
      ),
    );

    return () => unsubs.forEach((unsub) => unsub());
  }, [quiz.id]);

  return (
    <QuizContext.Provider value={{ quiz, setQuiz }}>
      {children}
    </QuizContext.Provider>
  );
}
