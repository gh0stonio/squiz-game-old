'use client';
import 'client-only';
import {
  onSnapshot,
  collection,
  orderBy,
  query,
  Unsubscribe,
} from 'firebase/firestore';
import React from 'react';

import { db, genericConverter } from '~/shared/lib/firebaseClient';
import type { Question, Quiz, Team } from '~/types';

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

  React.useEffect(() => {
    const unsubs: Unsubscribe[] = [];

    unsubs.push(
      onSnapshot(
        query(collection(db, 'quizzes'), orderBy('createdAt')).withConverter(
          genericConverter<Quiz>(),
        ),
        (querySnapshot) => {
          querySnapshot.docs.map((quizDoc) => {
            const quizData = quizDoc.data();
            if (!quizData || quizDoc.metadata.hasPendingWrites) return;

            // subscribing to quiz teams updates
            unsubs.push(
              onSnapshot(
                query(
                  collection(
                    db,
                    'quizzes',
                    `${quizDoc.id}`,
                    'teams',
                  ).withConverter(genericConverter<Team>()),
                ),
                (snapshot) => {
                  setQuizzes((_quizzes) =>
                    _quizzes.map((_quiz) =>
                      _quiz.id === quizDoc.id
                        ? {
                            ..._quiz,
                            teams: snapshot.docs.map((doc) => doc.data()),
                          }
                        : _quiz,
                    ),
                  );
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
                    `${quizDoc.id}`,
                    'questions',
                  ).withConverter(genericConverter<Question>()),
                  orderBy('createdAt'),
                ),
                (snapshot) => {
                  setQuizzes((_quizzes) =>
                    _quizzes.map((_quiz) =>
                      _quiz.id === quizDoc.id
                        ? {
                            ..._quiz,
                            questions: snapshot.docs.map((doc) => doc.data()),
                          }
                        : _quiz,
                    ),
                  );
                },
              ),
            );
          });

          setQuizzes(querySnapshot.docs.map((doc) => doc.data()));
        },
      ),
    );

    return () => unsubs.forEach((unsub) => unsub());
  }, []);

  return (
    <QuizzesContext.Provider value={{ quizzes, setQuizzes }}>
      {children}
    </QuizzesContext.Provider>
  );
}
