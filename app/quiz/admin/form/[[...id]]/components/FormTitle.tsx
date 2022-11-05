'use client';
import 'client-only';

import { useQuiz } from '~/quiz/admin/components/QuizzesContext';
import { type Quiz } from '~/types';

type QuizFormTitleProps = {
  quizId?: Quiz['id'];
};
export default function QuizFormTitle({ quizId }: QuizFormTitleProps) {
  const { quiz } = useQuiz(quizId);

  return (
    <h3 className="pt-4 pb-8 text-xl font-bold">
      {quiz ? `Edit quiz "${quiz.name}"` : 'Create new quiz'}
    </h3>
  );
}
