import { collection, onSnapshot, type Unsubscribe } from 'firebase/firestore';
import * as React from 'react';

import { useAuth } from '~/hooks/useAuth';
import { db, converters } from '~/lib/firebase';
import { type Quiz } from '~/types';

const QuizzesContext = React.createContext<Quiz[] | null>(null);

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

export function useQuizzes():
  | { status: 'ready'; data: Quiz[]; ongoingQuizzes: Quiz[] }
  | { status: 'loading' }
  | { status: 'disabled' }
  | { status: 'error'; error: Error } {
  const auth = useAuth();
  const context = React.useContext(QuizzesContext);

  if (context === undefined) {
    throw new Error('useQuizzes must be used within a QuizzesProvider');
  }

  if (auth.status !== 'connected') {
    return { status: 'disabled' };
  }

  if (context) {
    return {
      status: 'ready',
      data: context,
      ongoingQuizzes: context.filter((quiz) => !quiz.isFinished),
    };
  }

  return { status: 'loading' };
}

export function useQuiz(
  quizId?: string,
):
  | { status: 'not_found' }
  | { status: 'ready'; data: Quiz }
  | { status: 'loading' }
  | { status: 'error'; error: Error } {
  const context = React.useContext(QuizzesContext);

  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizzesProvider');
  }

  if (context) {
    const quiz = context.find((quiz) => quiz.id === quizId);

    if (!quiz) {
      return { status: 'not_found' };
    }

    return {
      status: 'ready',
      data: quiz,
    };
  }

  return { status: 'loading' };
}
