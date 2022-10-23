import { query, collection, onSnapshot } from 'firebase/firestore';

import { useCreateSubscriptionQuery } from '~/lib/data-fetcher';
import { converters, db } from '~/lib/firebase';
import { Quiz } from '~/types';

const queryKey = 'firestore_quizzes';

export const useQuizzes = ({ isDisabled }: { isDisabled?: boolean } = {}) => {
  const q = collection(db, 'quizzes').withConverter(converters.quiz);

  return useCreateSubscriptionQuery<Quiz[], Error>(
    [queryKey],
    (onSuccess) =>
      onSnapshot(q, (snapshot) =>
        onSuccess(snapshot.docs.map((doc) => doc.data())),
      ),
    { enabled: !isDisabled },
  );
};
