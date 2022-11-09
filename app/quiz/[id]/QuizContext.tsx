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

import { useAuth } from '~/shared/context/AuthContext';
import { db, genericConverter } from '~/shared/lib/firebaseClient';
import type { Question, Quiz, Team } from '~/types';

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
  const { user } = useAuth();
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

          // subscribing to quiz teams updates
          unsubs.push(
            onSnapshot(
              query(
                collection(db, 'quizzes', `${quiz.id}`, 'teams').withConverter(
                  genericConverter<Team>(),
                ),
              ),
              (snapshot) => {
                const teams = snapshot.docs.map((doc) => doc.data());
                const myTeam = teams.find((team) =>
                  team.members.some((member) => member.name === user?.name),
                );

                setQuiz((_quiz) => ({
                  ..._quiz,
                  teams,
                  myTeam,
                }));
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
                const questions = snapshot.docs.map((doc) => doc.data());
                const ongoingQuestion = questions.find(
                  (_question) => _question.status === 'in progress',
                );

                setQuiz((_quiz) => ({
                  ..._quiz,
                  ongoingQuestion: ongoingQuestion
                    ? {
                        ...ongoingQuestion,
                        answer: 'really ? stop trying to cheat',
                      }
                    : undefined,
                }));
              },
            ),
          );

          setQuiz((_quiz) => ({
            ..._quiz,
            ...quizData,
          }));
        },
      ),
    );

    return () => unsubs.forEach((unsub) => unsub());
  }, [quiz.id, user?.name]);

  return (
    <QuizContext.Provider value={{ quiz, setQuiz }}>
      {children}
    </QuizContext.Provider>
  );
}
