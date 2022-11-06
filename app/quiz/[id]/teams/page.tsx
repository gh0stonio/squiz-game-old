import 'server-only';
import { match, P } from 'ts-pattern';

import { getQuiz } from '~/shared/data/getQuiz';
import { getUser } from '~/shared/data/getUser';
import { Quiz } from '~/types';

import TeamList from './components/TeamList';

export default async function QuizTeamPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getUser();
  // Enforcing type here since the Layout will protect us if no Quiz found
  const quiz = (await getQuiz(params.id, user)) as Quiz;

  return (
    <div className="flex h-full w-full flex-col px-12">
      <h3 className="pt-4 pb-8 text-3xl font-bold">
        Team page for quiz {quiz.name}
      </h3>

      {match(quiz)
        .with(
          { status: 'ready', quiz: { teams: P.union(P.nullish, []) } },
          () => <p>no teams available</p>,
        )
        .with({ status: 'in progress' }, () => {
          return <p>Quiz ongoing... can&apos;t change now</p>;
        })
        .with({ status: 'ready' }, () => <TeamList />)
        .with({ status: 'finished' }, () => {
          return <p>Quiz over, thanks for your participation!</p>;
        })
        .exhaustive()}
    </div>
  );
}
