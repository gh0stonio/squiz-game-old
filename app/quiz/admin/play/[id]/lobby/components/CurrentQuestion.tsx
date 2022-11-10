'use client';
import 'client-only';
import clsx from 'clsx';
import React from 'react';
import { match } from 'ts-pattern';

import useQuiz from '~/quiz/admin/hooks/useQuiz';
import { useTimer } from '~/shared/hooks/useTimer';

import Answers from './Answers';

export default function CurrentQuestion() {
  const { quiz, currentQuestion, pushQuestion, sendQuestionExpired } =
    useQuiz();
  const timer = useTimer(currentQuestion);

  React.useEffect(() => {
    timer.setIsExpired(false);
    if (timer.isExpired) {
      sendQuestionExpired();
    }
  }, [sendQuestionExpired, timer]);

  if (!currentQuestion) return null;

  return (
    <div className="flex h-full flex-col">
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

      {currentQuestion.status === 'in progress' && (
        <div>Time left: {timer.timeLeft}</div>
      )}

      {match(currentQuestion)
        .with({ status: 'in progress' }, () => {
          return <div>Time left: {timer.timeLeft}</div>;
        })
        .with({ status: 'correcting' }, () => {
          return (
            <div className="h-full py-6">
              <Answers />
            </div>
          );
        })
        .otherwise(() => null)}
    </div>
  );
}
