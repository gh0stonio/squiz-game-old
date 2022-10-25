import { collection, onSnapshot, type Unsubscribe } from 'firebase/firestore';
import * as React from 'react';

import { useAuth } from '~/hooks/useAuth';
import { db, converters } from '~/lib/firebase';
import { type Quiz } from '~/types';

export const QuizzesContext = React.createContext<Quiz[] | null>(null);

export function QuizzesProvider({
  children,
}: React.PropsWithChildren): JSX.Element {
  const authResult = useAuth();
  const [quizzes, setQuizzes] = React.useState<Quiz[] | null>(null);

  React.useEffect(() => {
    const unsubs: Unsubscribe[] = [];

    if (authResult.status !== 'connected') return;

    // subscribing to quizzes updates
    const q = collection(db, 'quizzes').withConverter(converters.quiz);
    unsubs.push(
      onSnapshot(q, (snapshot) => {
        const _quizzes = snapshot.docs.map((doc) => doc.data());

        _quizzes?.forEach((quiz) => {
          // subscribing to quiz teams updates
          unsubs.push(
            onSnapshot(
              collection(db, 'quizzes', `${quiz.id}`, 'teams').withConverter(
                converters.team,
              ),
              (snapshot) => {
                setQuizzes((currentQuizzes) =>
                  (currentQuizzes || []).map((_quiz) => {
                    if (_quiz.id === quiz.id) {
                      const teams = snapshot.docs.map((doc) => doc.data());
                      return {
                        ..._quiz,
                        teams,
                        myTeam: teams.find((team) =>
                          team.membersUids.some(
                            (membersUid) => membersUid === authResult.user.uid,
                          ),
                        ),
                      };
                    }

                    return _quiz;
                  }),
                );
              },
            ),
          );

          // subscribing to quiz questions updates
          unsubs.push(
            onSnapshot(
              collection(
                db,
                'quizzes',
                `${quiz.id}`,
                'questions',
              ).withConverter(converters.question),
              (snapshot) => {
                setQuizzes((currentQuizzes) =>
                  (currentQuizzes || []).map((_quiz) => {
                    if (_quiz.id === quiz.id) {
                      const questions = snapshot.docs.map((doc) => doc.data());
                      return {
                        ..._quiz,
                        questions,
                      };
                    }

                    return _quiz;
                  }),
                );
              },
            ),
          );
        });

        setQuizzes(_quizzes);
      }),
    );

    return () => unsubs.forEach((unsub) => unsub());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authResult.status]);

  return (
    <QuizzesContext.Provider value={quizzes}>
      {children}
    </QuizzesContext.Provider>
  );
}
