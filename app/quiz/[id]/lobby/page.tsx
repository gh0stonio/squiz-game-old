import 'server-only';
import { match, P } from 'ts-pattern';

import { getQuiz } from '~/shared/data/getQuiz';
import { Quiz } from '~/types';

export default async function QuizLobbyPage({
  params,
}: {
  params: { id: string };
}) {
  // Enforcing type here since the Layout will protect us if no Quiz found
  const quiz = (await getQuiz(params.id)) as Quiz;

  return (
    <div className="flex h-full w-full flex-col px-12">
      <header className="pt-4 pb-8 ">
        <h3 className="text-3xl font-bold">Lobby for quiz {quiz.name}</h3>
        <p className="italic">{quiz.description}</p>
      </header>

      {match(quiz)
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
        .exhaustive()}
    </div>
  );
}
