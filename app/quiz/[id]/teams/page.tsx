import { getQuiz } from '~/shared/data/getQuiz';
import { Quiz } from '~/types';

export default async function QuizTeamPage({
  params,
}: {
  params: { id: string };
}) {
  // Enforcing type here since the Layout will protect us if no Quiz found
  const quiz = (await getQuiz(params.id)) as Quiz;

  return (
    <div className="flex h-full w-full flex-col px-12">
      <h3 className="pt-4 pb-8 text-3xl font-bold">
        Team page for quiz {quiz.name}
      </h3>
    </div>
  );
}
