'use client';
import 'client-only';
import { match, P } from 'ts-pattern';

import useQuiz from '~/quiz/[id]/hooks/useQuiz';

export default function MainContent() {
  const { quiz } = useQuiz();

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
