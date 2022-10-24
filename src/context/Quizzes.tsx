import { collection, onSnapshot, type Unsubscribe } from 'firebase/firestore';
import * as React from 'react';

import { db, converters } from '~/lib/firebase';
import { type Quiz } from '~/types';

export const QuizzesContext = React.createContext<Quiz[] | null>(null);

export function QuizzesProvider({
  children,
}: React.PropsWithChildren): JSX.Element {
  const [quizzes, setQuizzes] = React.useState<Quiz[] | null>(null);

  React.useEffect(() => {
    const unsubs: Unsubscribe[] = [];

    // subscribing to quizzes updates
    const q = collection(db, 'quizzes').withConverter(converters.quiz);
    unsubs.push(
      onSnapshot(q, (snapshot) => {
        const _quizzes = snapshot.docs.map((doc) => doc.data());

        // subscribing to quiz teams updates
        _quizzes?.forEach((quiz) => {
          unsubs.push(
            onSnapshot(
              collection(db, 'quizzes', `${quiz.id}`, 'teams').withConverter(
                converters.team,
              ),
              (snapshot) => {
                console.log('onSnapshot quiz teams', snapshot);
                setQuizzes((currentQuizzes) =>
                  (currentQuizzes || []).map((_quiz) => {
                    if (_quiz.id === quiz.id) {
                      return {
                        ..._quiz,
                        teams: snapshot.docs.map((doc) => doc.data()),
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
  }, []);

  return (
    <QuizzesContext.Provider value={quizzes}>
      {children}
    </QuizzesContext.Provider>
  );
}
