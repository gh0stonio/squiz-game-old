'use client';
import 'client-only';

import useQuiz from '~/quiz/admin/hooks/useQuiz';

export default function NextQuestion() {
  const { nextQuestion } = useQuiz();

  if (!nextQuestion) return <p>something wrong happened !</p>;

  return (
    <div>
      <h3 className="w-full text-2xl font-semibold">Next Question</h3>

      <p>{nextQuestion.text}</p>
      <p>{nextQuestion.answer}</p>
    </div>
  );
}
