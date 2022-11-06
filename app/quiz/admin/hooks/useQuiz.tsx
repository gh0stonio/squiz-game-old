'use client';
import 'client-only';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import React from 'react';
import { uid } from 'uid';

import { db, genericConverter } from '~/shared/lib/firebaseClient';
import type { Question, Quiz } from '~/types';

import useQuizzes from './useQuizzes';

export default function useQuiz(quizId?: string) {
  const router = useRouter();
  const { quizzes, setQuizzes } = useQuizzes();

  const [quiz, setQuiz] = React.useState<Quiz | undefined>(
    quizzes.find((quiz) => quiz.id === quizId),
  );
  React.useEffect(() => {
    setQuiz(quizzes.find((quiz) => quiz.id === quizId));
  }, [quizId, quizzes]);

  const [questions, setQuestions] = React.useState<Question[]>(
    quiz?.questions || [],
  );
  React.useEffect(() => {
    if (quiz) setQuestions(quiz.questions || []);
  }, [quiz]);

  const saveQuiz = React.useCallback(
    (values: Pick<Quiz, 'name' | 'description'>) => {
      const id = uid(16);

      const isEdit = !!quiz;
      const save = isEdit ? updateDoc : setDoc;

      const savedQuiz: Quiz = isEdit
        ? {
            ...quiz,
            name: values.name,
            updatedAt: Date.now(),
          }
        : { ...values, id, status: 'ready', createdAt: Date.now() };
      delete savedQuiz.questions;

      return save(
        doc(db, 'quizzes', quiz?.id || id).withConverter(
          genericConverter<Quiz>(),
        ),
        savedQuiz,
      )
        .then(async () => {
          if (!isEdit) return;

          const questionsQuerySnapshot = await getDocs(
            query(
              collection(db, 'quizzes', quiz.id, 'questions'),
              orderBy('createdAt'),
            ).withConverter(genericConverter<Question>()),
          );
          questionsQuerySnapshot.forEach(async (questionDoc) => {
            console.log('deleting', questionDoc.id);
            await deleteDoc(
              doc(db, 'quizzes', quiz.id, 'questions', questionDoc.id),
            );
          });
        })
        .then(() =>
          Promise.all(
            questions.map((question) =>
              setDoc(
                doc(
                  db,
                  'quizzes',
                  quiz?.id || id,
                  'questions',
                  question.id,
                ).withConverter(genericConverter<Question>()),
                question,
              ),
            ),
          ),
        )
        .then(
          () => {
            if (!isEdit) router.push('/quiz/admin');

            setQuizzes((_quizzes) => {
              if (isEdit) {
                return _quizzes.map((_quiz) =>
                  _quiz.id === quiz.id ? { ...savedQuiz, questions } : _quiz,
                );
              }

              return [..._quizzes, { ...savedQuiz, questions }];
            });

            toast.success(`Quiz ${isEdit ? 'updated' : 'added'} !`, {
              theme: 'colored',
            });
          },
          () => {
            toast.error(`Failed ${isEdit ? 'updating' : 'adding'} the Quiz !`, {
              theme: 'colored',
            });
          },
        );
    },
    [questions, quiz, router, setQuizzes],
  );

  const addQuestion = React.useCallback((question: Question) => {
    setQuestions((questions) => [...questions, question]);
  }, []);
  const editQuestion = React.useCallback((question: Question) => {
    setQuestions((questions) =>
      questions.map((_question) =>
        _question.id === question.id ? question : _question,
      ),
    );
  }, []);
  const deleteQuestion = React.useCallback((question: Question) => {
    setQuestions((questions) =>
      questions.filter((_question) => _question.id !== question.id),
    );
  }, []);

  return {
    quiz,
    saveQuiz,
    questions,
    addQuestion,
    editQuestion,
    deleteQuestion,
  };
}
