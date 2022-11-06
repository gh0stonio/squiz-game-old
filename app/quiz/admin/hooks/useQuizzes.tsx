'use client';
import 'client-only';
import { deleteDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import React from 'react';

import { QuizzesContext } from '~/quiz/admin/components/QuizzesContext';
import { db } from '~/shared/lib/firebaseClient';
import type { Quiz } from '~/types';

export default function useQuizzes() {
  const { quizzes, setQuizzes } = React.useContext(QuizzesContext);

  const deleteQuiz = React.useCallback(
    (quizId: Quiz['id']) => {
      deleteDoc(doc(db, 'quizzes', quizId)).then(
        () => {
          setQuizzes((_quizzes) =>
            _quizzes.filter((quiz) => quiz.id !== quizId),
          );
          toast.success('Quiz deleted !', {
            theme: 'colored',
          });
        },
        () => {
          toast.error('Failed deleting the Quiz !', {
            theme: 'colored',
          });
        },
      );
    },
    [setQuizzes],
  );

  return { quizzes, setQuizzes, deleteQuiz };
}
