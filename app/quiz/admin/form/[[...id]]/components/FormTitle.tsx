'use client';
import 'client-only';

import useQuiz from '~/quiz/admin/hooks/useQuiz';
import { type Quiz } from '~/types';

type QuizFormTitleProps = {
  quizId?: Quiz['id'];
};
export default function QuizFormTitle({ quizId }: QuizFormTitleProps) {
  const { quiz } = useQuiz(quizId);

  return (
    <h3 className="py-3 text-xl font-bold">
      {quiz ? `Edit quiz "${quiz.name}"` : 'Create new quiz'}
    </h3>
  );
}
