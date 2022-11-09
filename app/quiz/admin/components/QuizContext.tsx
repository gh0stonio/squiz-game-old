'use client';
import 'client-only';
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
import type { Question, Quiz, Team } from '~/types';

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

  React.useEffect(() => {
    const unsubs: Unsubscribe[] = [];

    if (!quiz) return;

    unsubs.push(
      onSnapshot(
        doc(db, 'quizzes', `${quiz.id}`).withConverter(
          genericConverter<Quiz>(),
        ),
        (quizDoc) => {
          const quizData = quizDoc.data();
          if (!quizData || quizDoc.metadata.hasPendingWrites) return;

          // subscribing to quiz teams updates
          unsubs.push(
            onSnapshot(
              query(
                collection(db, 'quizzes', `${quiz.id}`, 'teams').withConverter(
                  genericConverter<Team>(),
                ),
              ),
              (snapshot) => {
                setQuiz({
                  ...quiz,
                  teams: snapshot.docs.map((doc) => doc.data()),
                });
              },
            ),
          );

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
                setQuiz({
                  ...quiz,
                  questions: snapshot.docs.map((doc) => doc.data()),
                });
              },
            ),
          );

          setQuiz({
            ...quiz,
            ...quizData,
          });
        },
      ),
    );

    return () => unsubs.forEach((unsub) => unsub());
  }, []);

  return (
    <QuizContext.Provider value={{ quiz, setQuiz, questions, setQuestions }}>
      {children}
    </QuizContext.Provider>
  );
}
