import 'server-only';
import { collection, getDocs } from 'firebase/firestore';

import { db, genericConverter } from '~/shared/lib/firebaseClient';
import { type Question, type Quiz } from '~/types';

export async function getQuizzes() {
  const q = collection(db, 'quizzes').withConverter(genericConverter<Quiz>());

  const questionsQuerySnapshot = await getDocs(q);

  const promises = questionsQuerySnapshot.docs.map(async (doc) => {
    const questionsQuerySnapshot = await getDocs(
      collection(db, 'quizzes', doc.id, 'questions').withConverter(
        genericConverter<Question>(),
      ),
    );

    const quiz: Quiz = {
      ...doc.data(),
      questions: questionsQuerySnapshot.docs.map((doc) => doc.data()),
    };

    return quiz;
  });

  return await Promise.all(promises);
}
