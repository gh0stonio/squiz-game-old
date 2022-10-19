import { useFirestoreQuery } from '@react-query-firebase/firestore';
import { query, collection } from 'firebase/firestore';
import React from 'react';

import { useAuth } from '~/hooks/useAuth';
import { converters, db } from '~/lib/firebase';

const quizzesKey = 'firestore_quizzes';

export const useQuizzes = () => {
  const { user } = useAuth();

  const ref = query(collection(db, 'quizzes').withConverter(converters.quiz));
  const result = useFirestoreQuery([quizzesKey], ref, {
    subscribe: true,
  });

  const quizzes = React.useMemo(
    () => (result.data?.docs || []).map((docSnapshot) => docSnapshot.data()),
    [result.data],
  );
  const unfinishedQuizzes = React.useMemo(
    () => quizzes.filter((quiz) => !quiz.isFinished),
    [quizzes],
  );

  return {
    ...result,
    ...(!user.data ? { status: 'unauthenticated' } : {}),
    quizzes,
    unfinishedQuizzes,
  };
};
