import { updateDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore';
import React from 'react';

import { QuizContext } from '~/quiz/[id]/QuizContext';
import { useAuth } from '~/shared/context/AuthContext';
import { db, genericConverter } from '~/shared/lib/firebaseClient';
import type { Question, Team } from '~/types';

export default function useQuiz() {
  const { user } = useAuth();
  const { quiz, setQuiz } = React.useContext(QuizContext);
  const [isTeamUpdateLoading, setIsTeamUpdateLoading] = React.useState(false);

  const joinTeam = React.useCallback(
    (team: Team) => {
      if (!user) return;

      setIsTeamUpdateLoading(true);
      updateDoc(
        doc(db, 'quizzes', quiz.id, 'teams', team.id).withConverter(
          genericConverter<Team>(),
        ),
        {
          members: arrayUnion(user.name),
        },
      ).then(() => {
        setIsTeamUpdateLoading(false);
        setQuiz({
          ...quiz,
          teams: quiz.teams?.map((_team) => {
            return _team.id === team.id
              ? { ..._team, members: [..._team.members, user.name] }
              : _team;
          }),
          myTeam: team,
        });
      });
    },
    [quiz, setQuiz, user],
  );

  const leaveTeam = React.useCallback(
    (team: Team) => {
      if (!user) return;

      setIsTeamUpdateLoading(true);
      updateDoc(doc(db, 'quizzes', quiz.id, 'teams', team.id), {
        members: arrayRemove(user.name),
      }).then(() => {
        setIsTeamUpdateLoading(false);
        setQuiz({
          ...quiz,
          teams: quiz.teams?.map((_team) => {
            return _team.id === team.id
              ? {
                  ..._team,
                  members: _team.members.filter(
                    (member) => member !== user.name,
                  ),
                }
              : _team;
          }),
          myTeam: undefined,
        });
      });
    },
    [quiz, setQuiz, user],
  );

  return { quiz, isTeamUpdateLoading, joinTeam, leaveTeam };
}
