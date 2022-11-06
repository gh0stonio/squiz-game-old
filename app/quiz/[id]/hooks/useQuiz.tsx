import {
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
  setDoc,
} from 'firebase/firestore';
import React from 'react';
import { uid } from 'uid';

import { QuizContext } from '~/quiz/[id]/QuizContext';
import { useAuth } from '~/shared/context/AuthContext';
import { db, genericConverter } from '~/shared/lib/firebaseClient';
import type { Question, Team } from '~/types';

export default function useQuiz() {
  const { user } = useAuth();
  const { quiz, setQuiz } = React.useContext(QuizContext);
  const [isTeamUpdateLoading, setIsTeamUpdateLoading] = React.useState(false);

  const createTeam = React.useCallback(
    (name: string) => {
      if (!user) return;

      const team: Team = {
        id: uid(16),
        name,
        leader: user,
        members: [user],
      };

      setIsTeamUpdateLoading(true);

      return setDoc(
        doc(db, 'quizzes', quiz.id, 'teams', team.id).withConverter(
          genericConverter<Team>(),
        ),
        team,
      ).then(() => {
        setIsTeamUpdateLoading(false);
        setQuiz({
          ...quiz,
          teams: [...(quiz.teams || []), team],
          myTeam: team,
        });
      });
    },
    [quiz, setQuiz, user],
  );

  const joinTeam = React.useCallback(
    (team: Team) => {
      if (!user) return;

      setIsTeamUpdateLoading(true);
      return updateDoc(
        doc(db, 'quizzes', quiz.id, 'teams', team.id).withConverter(
          genericConverter<Team>(),
        ),
        {
          members: arrayUnion(user),
        },
      ).then(() => {
        setIsTeamUpdateLoading(false);
        setQuiz({
          ...quiz,
          teams: quiz.teams?.map((_team) => {
            return _team.id === team.id
              ? { ..._team, members: [..._team.members, user] }
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
      return updateDoc(doc(db, 'quizzes', quiz.id, 'teams', team.id), {
        members: arrayRemove(user),
      }).then(() => {
        setIsTeamUpdateLoading(false);
        setQuiz({
          ...quiz,
          teams: quiz.teams?.map((_team) => {
            return _team.id === team.id
              ? {
                  ..._team,
                  members: _team.members.filter(
                    (member) => member.name !== user.name,
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

  return { quiz, isTeamUpdateLoading, createTeam, joinTeam, leaveTeam };
}
