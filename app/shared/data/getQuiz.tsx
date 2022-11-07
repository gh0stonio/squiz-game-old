import 'server-only';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from 'firebase/firestore';
import { cache } from 'react';

import { db, genericConverter } from '~/shared/lib/firebaseClient';
import type { Question, Quiz, Team, User } from '~/types';

const getQuizFromFirebase = cache(async (id: string, user?: User) => {
  const q = doc(db, 'quizzes', `${id}`).withConverter(genericConverter<Quiz>());

  const docSnap = await getDoc(q);

  if (!docSnap.exists()) return;

  const questionsQuerySnapshot = await getDocs(
    query(
      collection(db, 'quizzes', docSnap.id, 'questions'),
      orderBy('createdAt'),
    ).withConverter(genericConverter<Question>()),
  );

  const teamsQuerySnapshot = await getDocs(
    query(
      collection(db, 'quizzes', docSnap.id, 'teams'),
      orderBy('createdAt'),
    ).withConverter(genericConverter<Team>()),
  );
  const teams = teamsQuerySnapshot.docs.map((doc) => doc.data());

  return {
    ...docSnap.data(),
    questions: questionsQuerySnapshot.docs.map((doc) => doc.data()),
    teams,
    myTeam: teams.find((team) =>
      team.members.some((member) => member.name === user?.name),
    ),
  };
});

export function getQuiz(id?: string, user?: User) {
  if (!id) return;

  return getQuizFromFirebase(id, user);
}
