import 'server-only';
import { collection, getDocs } from 'firebase/firestore';

import { db, genericConverter } from '~/shared/lib/firebaseClient';
import { type Quiz } from '~/types';

export async function getQuizzes() {
  const q = collection(db, 'quizzes').withConverter(genericConverter<Quiz>());

  const questionsQuerySnapshot = await getDocs(q);

  return questionsQuerySnapshot.docs.map((doc) => doc.data());
}
