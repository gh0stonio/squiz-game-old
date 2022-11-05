import 'server-only';
import Link from 'next/link';

import FormTitle from './components/FormTitle';
import QuizForm from './components/QuizForm';

export default async function AdminQuizFormPage({
  params,
}: {
  params: { id?: string };
}) {
  return (
    <div className="flex h-full w-full flex-col p-10">
      <div className="flex w-full items-end justify-start pb-10">
        <Link href="/quiz/admin">
          <button className="btn-sm btn">Go back</button>
        </Link>
      </div>

      <FormTitle quizId={params.id} />
      <QuizForm quizId={params.id} />

      {/* <div id="form-modal" /> */}
    </div>
  );
}
