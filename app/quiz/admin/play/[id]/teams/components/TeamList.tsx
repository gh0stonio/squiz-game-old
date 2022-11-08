'use client';
import 'client-only';
import React from 'react';

import useQuiz from '~/quiz/admin/hooks/useQuiz';

export default function TeamList() {
  const { quiz } = useQuiz();

  return (
    <div className="relative h-full w-full">
      <div className="absolute top-0 left-0 right-0 bottom-0 flex h-full w-full flex-col">
        <div className="-mx-4 overflow-auto px-4 pb-8">
          {!quiz?.teams || quiz.teams.length === 0 ? (
            <p className="flex w-full items-center justify-center text-2xl">
              No team available yet
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {quiz.teams.map((team) => (
                <div key={team.id} className="card h-60 bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h2 className="card-title flex w-full items-center justify-between">
                      <p>{team.name}</p>
                      <p className="flex items-center justify-end">
                        {team.members.length} / {quiz.maxMembersPerTeam}
                      </p>
                    </h2>
                    <div className="h-24 overflow-auto">
                      <p className="italic">Admin: {team.leader.name}</p>
                      <p className="italic">
                        Members:{' '}
                        {team.members.map((member) => member.name).join(',')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
