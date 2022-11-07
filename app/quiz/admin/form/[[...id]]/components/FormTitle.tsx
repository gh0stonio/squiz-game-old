'use client';
import 'client-only';

import useQuiz from '~/quiz/admin/hooks/useQuiz';

interface QuizFormTitleProps {}
export default function QuizFormTitle({}: QuizFormTitleProps) {
  const { quiz } = useQuiz();

  return (
    <h3 className="py-3 text-xl font-bold">
      {quiz ? `Edit quiz "${quiz.name}"` : 'Create new quiz'}
    </h3>
  );
}
