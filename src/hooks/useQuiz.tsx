import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import * as React from 'react';

import { QuizzesContext } from '~/context/Quizzes';
import { db } from '~/lib/firebase';
import { Question, Team, type Quiz } from '~/types';

import { useAuth } from './useAuth';

type QuizResult =
  | { status: 'not_found' }
  | {
      status: 'ready';
      quiz: Quiz;
      lastQuestion?: Question;
      currentQuestion?: Question;
      joinTeam: (team: Team) => void;
      leaveTeam: (team: Team) => void;
    }
  | { status: 'error'; error: Error };

export function useQuiz(quizId?: string): QuizResult {
  const authResult = useAuth();
  const context = React.useContext(QuizzesContext);

  const quiz = React.useMemo(
    () => (context || []).find((quiz) => quiz.id === quizId),
    [context, quizId],
  );

  const joinTeam = React.useCallback(
    (team: Team) => {
      if (!quiz || authResult.status !== 'connected') return;

      updateDoc(doc(db, 'quizzes', quiz.id, 'teams', team.id), {
        membersUids: arrayUnion(authResult.user.uid),
      }).then(() => (quiz.myTeam = team));
    },
    [quiz, authResult],
  );
  const leaveTeam = React.useCallback(
    (team: Team) => {
      if (!quiz || authResult.status !== 'connected') return;

      updateDoc(doc(db, 'quizzes', quiz.id, 'teams', team.id), {
        membersUids: arrayRemove(authResult.user.uid),
      }).then(() => (quiz.myTeam = undefined));
    },
    [quiz, authResult],
  );

  const lastQuestion = React.useMemo(() => {
    if (!quiz || !quiz.isStarted || authResult.status !== 'connected') return;

    return (quiz.questions || []).filter((quiz) => quiz.isDone).at(-1);
  }, [authResult.status, quiz]);
  const currentQuestion = React.useMemo(() => {
    if (!quiz || !quiz.isStarted || authResult.status !== 'connected') return;

    const lastAvailableQuestion = (quiz.questions || [])
      .filter((quiz) => !quiz.isDone)
      .at(-1);
    return lastAvailableQuestion &&
      lastAvailableQuestion.startedAt &&
      lastAvailableQuestion.startedAt.seconds + lastAvailableQuestion.time >
        Date.now() / 1000
      ? lastAvailableQuestion
      : undefined;
  }, [authResult.status, quiz]);

  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizzesProvider');
  }

  if (!quiz) {
    return { status: 'not_found' };
  }

  return {
    status: 'ready',
    quiz,
    lastQuestion,
    currentQuestion,
    joinTeam,
    leaveTeam,
  };
}
