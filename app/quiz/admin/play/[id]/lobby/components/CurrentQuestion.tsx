'use client';
import 'client-only';
import clsx from 'clsx';

import useQuiz from '~/quiz/admin/hooks/useQuiz';

export default function CurrentQuestion() {
  const { quiz, currentQuestion, pushQuestion } = useQuiz();

  if (!currentQuestion) return <p>something wrong happened !</p>;

  return (
    <div>
      <div className="flex w-full">
        <h3 className="w-full text-2xl font-bold">Current Question</h3>
        <button
          className={clsx('btn-secondary btn-sm btn', {
            'btn-disabled':
              quiz?.status !== 'in progress' ||
              currentQuestion.status !== 'ready',
          })}
          onClick={pushQuestion}
        >
          Push
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="w-6/12">
          <p className="pt-4 pb-2 text-xl font-semibold">Questions</p>
          <p className="">{currentQuestion.text}</p>
        </div>
        <div className="w-4/12">
          <p className="pt-4 pb-2 text-xl font-semibold">Correct Answer</p>
          <p className="">{currentQuestion.answer}</p>
        </div>
        <div className="flex w-2/12 justify-end gap-4">
          <div>
            <p className="pt-4 pb-2 text-xl font-semibold">Duration</p>
            <p className="">{currentQuestion.duration}</p>
          </div>
          <div>
            <p className="pt-4 pb-2 text-xl font-semibold">Points</p>
            <p className="">{currentQuestion.maxPoints}</p>
          </div>
        </div>
      </div>

      <div></div>
    </div>
  );
}
