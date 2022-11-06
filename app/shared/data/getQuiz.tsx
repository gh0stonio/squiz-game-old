import 'server-only';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { cache } from 'react';

import { db, genericConverter } from '~/shared/lib/firebaseClient';
import type { Question, Quiz } from '~/types';

const getQuizFromFirebase = cache(async (id: string) => {
  const q = doc(db, 'quizzes', `${id}`).withConverter(genericConverter<Quiz>());

  const docSnap = await getDoc(q);

  if (!docSnap.exists()) return;

  const questionsQuerySnapshot = await getDocs(
    collection(db, 'quizzes', docSnap.id, 'questions').withConverter(
      genericConverter<Question>(),
    ),
  );

  return {
    ...docSnap.data(),
    questions: questionsQuerySnapshot.docs.map((doc) => doc.data()),
  };
});

export function getQuiz(id?: string) {
  if (!id) return;

  return getQuizFromFirebase(id);
}
