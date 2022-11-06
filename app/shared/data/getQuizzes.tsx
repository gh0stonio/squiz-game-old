import { collection, getDocs, orderBy, query } from 'firebase/firestore';

import { db, genericConverter } from '~/shared/lib/firebaseClient';
import { type Question, type Quiz } from '~/types';

export async function getQuizzes() {
  const q = query(
    collection(db, 'quizzes'),
    orderBy('createdAt'),
  ).withConverter(genericConverter<Quiz>());

  const questionsQuerySnapshot = await getDocs(q);

  const promises = questionsQuerySnapshot.docs.map(async (doc) => {
    const questionsQuerySnapshot = await getDocs(
      query(
        collection(db, 'quizzes', doc.id, 'questions'),
        orderBy('createdAt'),
      ).withConverter(genericConverter<Question>()),
    );

    const quiz: Quiz = {
      ...doc.data(),
      questions: questionsQuerySnapshot.docs.map((doc) => doc.data()),
    };

    return quiz;
  });

  return await Promise.all(promises);
}
