'use client';
import 'client-only';
import clsx from 'clsx';

import useQuiz from '~/quiz/[id]/hooks/useQuiz';

export default function TeamList() {
  const { quiz, isTeamUpdateLoading, joinTeam, leaveTeam } = useQuiz();

  return (
    <div>
      {quiz.teams?.map((team) => (
        <div key={team.id} className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">{team.name}</h2>
            <p>Members: {team.members.join(',')}</p>
            <div className="card-actions justify-end">
              {quiz.myTeam?.id === team.id ? (
                <button
                  onClick={() => leaveTeam(team)}
                  className={clsx('btn-sm btn', {
                    loading: isTeamUpdateLoading,
                    'btn-disabled': isTeamUpdateLoading,
                  })}
                >
                  Leave
                </button>
              ) : (
                !quiz.myTeam && (
                  <button
                    onClick={() => joinTeam(team)}
                    className={clsx('btn-secondary btn-sm btn', {
                      loading: isTeamUpdateLoading,
                      'btn-disabled': isTeamUpdateLoading,
                    })}
                  >
                    Join
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
