'use client';
import 'client-only';

import useQuiz from '~/quiz/admin/hooks/useQuiz';

export default function CurrentQuestion() {
  const { currentQuestion } = useQuiz();

  console.log(currentQuestion);

  return <p>current question area</p>;
}
