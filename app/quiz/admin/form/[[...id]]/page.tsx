import 'server-only';

import FormTitle from './components/FormTitle';
import QuizForm from './components/QuizForm';

export default async function AdminQuizFormPage({
  params,
}: {
  params: { id?: string[] };
}) {
  const quizId = (params.id || [])[0];

  return (
    <div className="flex h-full w-full flex-col p-10">
      <FormTitle quizId={quizId} />
      <QuizForm quizId={quizId} />

      <div id="question-form-modal" />
    </div>
  );
}
