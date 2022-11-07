import 'server-only';
import { match, P } from 'ts-pattern';

import { getQuiz } from '~/shared/data/getQuiz';
import { getUser } from '~/shared/data/getUser';
import { Quiz } from '~/types';

import MainContent from './components/MainContent';

export default async function QuizLobbyPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getUser();
  // Enforcing type here since the Layout will protect us if no Quiz found
  const quiz = (await getQuiz(params.id, user)) as Quiz;

  return (
    <div className="flex h-full w-full flex-col p-10">
      <div className="pb-8">
        <h3 className="text-3xl font-bold">
          Let&apos;s play to the quiz {quiz.name}!
        </h3>
        <p className="text-sm italic">{quiz.description}</p>
      </div>

      <MainContent />
    </div>
  );
}
