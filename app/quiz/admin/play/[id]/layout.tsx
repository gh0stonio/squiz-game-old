import 'server-only';

import QuizContext from '~/quiz/admin/components/QuizContext';
import { getQuiz } from '~/shared/data/getQuiz';

export default async function AdminPlayLayout({
  children,
  params,
}: React.PropsWithChildren<{
  params: { id?: string };
}>) {
  const quizId = params.id;
  const quiz = await getQuiz(quizId);

  return (
    <QuizContext initialQuiz={quiz}>
      <div className="h-full w-full">{children}</div>
    </QuizContext>
  );
}
