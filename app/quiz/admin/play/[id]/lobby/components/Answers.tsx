'use client';
import 'client-only';
import React from 'react';

import useQuiz from '~/quiz/admin/hooks/useQuiz';

export default function Answers() {
  const { quiz, currentQuestion } = useQuiz();

  if (!quiz || !quiz.teams || quiz.teams?.length === 0 || !currentQuestion)
    return <p>not supposed to happen</p>;

  return (
    <div className="relative h-full w-full overflow-auto">
      <div className="absolute top-0 left-0 right-0 bottom-0 flex h-full w-full flex-col">
        <div className="-mx-4 overflow-auto px-4 pb-8">
          <div className="grid grid-cols-4 gap-4">
            {quiz.teams.map((team) => (
              <div key={team.id} className="card h-60 bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title flex w-full items-center justify-between">
                    <p>{team.name}</p>
                  </h2>
                  <div className="h-24 overflow-auto">
                    <p className="italic">Admin: {team.leader.name}</p>
                    <p className="italic">Answer: PUT ANSWER HERE</p>
                  </div>

                  <select className="select-bordered select select-sm w-full max-w-xs">
                    <option disabled selected>
                      Score
                    </option>
                    {Array.from({
                      length: currentQuestion.maxPoints + 1,
                    }).map((_, index) => (
                      <option key={index}>{index}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
