'use client';
import 'client-only';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
} from 'firebase/firestore';
import { toast } from 'react-toastify';
import React from 'react';

import { QuizzesContext } from '~/quiz/admin/components/QuizzesContext';
import { db, genericConverter } from '~/shared/lib/firebaseClient';
import type { Question, Quiz } from '~/types';

export default function useQuizzes() {
  const { quizzes, setQuizzes } = React.useContext(QuizzesContext);

  const deleteQuiz = React.useCallback(
    async (quizId: Quiz['id']) => {
      const questionsQuerySnapshot = await getDocs(
        query(
          collection(db, 'quizzes', quizId, 'questions'),
          orderBy('createdAt'),
        ).withConverter(genericConverter<Question>()),
      );
      questionsQuerySnapshot.forEach(async (questionDoc) => {
        await deleteDoc(
          doc(db, 'quizzes', quizId, 'questions', questionDoc.id),
        );
      });

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
