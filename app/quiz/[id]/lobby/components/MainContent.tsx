'use client';
import 'client-only';
import { CgArrowTopRight } from 'react-icons/cg';
import { match, P } from 'ts-pattern';

import useQuiz from '~/quiz/[id]/hooks/useQuiz';
import { useAuth } from '~/shared/context/AuthContext';

export default function MainContent() {
  const { user } = useAuth();
  const { quiz } = useQuiz();

  if (!user) {
    return (
      <span className="flex h-full w-full items-center justify-center text-3xl">
        Please log in first, it&apos;s up there on the right{' '}
        <CgArrowTopRight className="h-10 w-10" />
      </span>
    );
  }

  return match(quiz)
    .with({ status: 'ready', myTeam: P.optional(P.nullish) }, () => {
      return <p>Please choose your team first</p>;
    })
    .with({ status: 'ready' }, () => {
      return <p>Please wait for the quiz to start</p>;
    })
    .with({ status: 'in progress' }, () => {
      return <p>Quiz ongoing... wait for next question</p>;
    })
    .with({ status: 'finished' }, () => {
      return <p>Quiz over, thanks for your participation!</p>;
    })
    .exhaustive();
}
