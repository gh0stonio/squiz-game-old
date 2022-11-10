'use client';
import 'client-only';
import { format } from 'date-fns';
import React from 'react';

import { useTimer } from '~/shared/hooks/useTimer';
import { type Question } from '~/types';

interface OngoingQuestionProps {
  question: Question;
}

export default function OngoingQuestion({ question }: OngoingQuestionProps) {
  const timer = useTimer(question);

  if (question.status === 'correcting') {
    return (
      <p>
        The quiz master is correcting the answers, please wait for next question
      </p>
    );
  }

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <h2 className="text-2xl font-bold">{question.text}</h2>
        <span>Time left: {timer.timeLeft}</span>
      </div>

      <textarea className="textarea-bordered textarea h-60" name="answer" />
    </>
  );
}
