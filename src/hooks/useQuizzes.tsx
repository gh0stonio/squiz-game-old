import * as React from 'react';

import { QuizzesContext } from '~/context/Quizzes';
import { useAuth } from '~/hooks/useAuth';
import { type Quiz } from '~/types';

type QuizzesResult =
  | { status: 'ready'; quizzes: Quiz[]; ongoingQuizzes: Quiz[] }
  | { status: 'loading' }
  | { status: 'disabled' }
  | { status: 'error'; error: Error };

export function useQuizzes(): QuizzesResult {
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
      quizzes: context,
      ongoingQuizzes: context.filter((quiz) => !quiz.isFinished),
    };
  }

  return { status: 'loading' };
}
