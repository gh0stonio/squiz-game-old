import * as React from 'react';

import { QuizzesContext } from '~/context/Quizzes';
import { type Quiz } from '~/types';

type QuizResult =
  | { status: 'not_found' }
  | { status: 'ready'; quiz: Quiz }
  | { status: 'loading' }
  | { status: 'error'; error: Error };

export function useQuiz(quizId?: string): QuizResult {
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
      quiz,
    };
  }

  return { status: 'loading' };
}
