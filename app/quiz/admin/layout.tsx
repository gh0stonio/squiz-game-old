import 'server-only';

import { getQuizzes } from '~/shared/data/getQuizzes';

import QuizzesContext from './components/QuizzesContext';

export default async function AdminLayout({
  children,
}: React.PropsWithChildren) {
  const quizzes = await getQuizzes();

  return (
    <QuizzesContext initialQuizzes={quizzes}>
      <div className="h-full w-full">{children}</div>
    </QuizzesContext>
  );
}
