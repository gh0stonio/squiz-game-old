import 'server-only';

import NewQuizButton from './components/NewQuizButton';
import QuizList from './components/QuizList';

export default async function AdminPage() {
  return (
    <div className="flex flex-col p-10">
      <div className="flex w-full items-center justify-between pt-2 pb-6">
        <p className="w-full text-2xl font-bold">Quiz List</p>
        <div className="flex items-center justify-center pr-1">
          <NewQuizButton />
        </div>
      </div>

      <QuizList />
    </div>
  );
}
