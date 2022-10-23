import { query, collection, onSnapshot, doc } from 'firebase/firestore';

import { useCreateSubscriptionQuery } from '~/lib/data-fetcher';
import { converters, db } from '~/lib/firebase';
import { Quiz } from '~/types';

const queryKey = 'firestore_quiz';

export const useQuiz = (quizId?: string) => {
  const q = doc(db, 'quizzes', `${quizId}`).withConverter(converters.quiz);

  return useCreateSubscriptionQuery<Quiz, Error>(
    [queryKey, quizId],
    (onSuccess) => onSnapshot(q, (doc) => onSuccess(doc.data())),
    { enabled: !!quizId },
  );
};
