import 'server-only';

import { getQuizzes } from '~/shared/data/getQuizzes';

import QuizzesContext from './QuizzesContext';

export default async function AdminLayout({
  children,
}: React.PropsWithChildren) {
  const quizzes = await getQuizzes();

  return (
    <QuizzesContext initialQuizzes={quizzes}>
      <div className="h-full w-full [&>div]:h-full [&>div]:w-full [&>div>div]:h-full [&>div>div]:w-full">
        {children}
      </div>
    </QuizzesContext>
  );
}
