import 'server-only';

import NavBar from '~/shared/components/NavBar';
import { getQuizzes } from '~/shared/data/getQuizzes';

import QuizzesContext from './components/QuizzesContext';

export default async function AdminLayout({
  children,
}: React.PropsWithChildren) {
  const quizzes = await getQuizzes();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <NavBar />
      <div className="m-auto mb-10 h-5/6 w-11/12 rounded-xl bg-gray-100 shadow-xl">
        <QuizzesContext initialQuizzes={quizzes}>
          <div className="h-full w-full">{children}</div>
        </QuizzesContext>
      </div>
    </div>
  );
}
