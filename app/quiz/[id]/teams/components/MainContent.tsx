'use client';
import 'client-only';
import { match, P } from 'ts-pattern';

import useQuiz from '~/quiz/[id]/hooks/useQuiz';

import TeamList from './TeamList';

export default function MainContent() {
  const { quiz } = useQuiz();

  return match(quiz)
    .with({ status: 'ready', quiz: { teams: P.union(P.nullish, []) } }, () => (
      <p>no teams available</p>
    ))
    .with({ status: 'in progress' }, () => {
      return <p>Quiz ongoing... can&apos;t change now</p>;
    })
    .with({ status: 'ready' }, () => <TeamList />)
    .with({ status: 'finished' }, () => {
      return <p>Quiz over, thanks for your participation!</p>;
    })
    .exhaustive();
}
