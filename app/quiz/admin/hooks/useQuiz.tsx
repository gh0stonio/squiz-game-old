'use client';
import 'client-only';
import {
  updateDoc,
  setDoc,
  doc,
  getDocs,
  query,
  collection,
  orderBy,
  deleteDoc,
} from 'firebase/firestore';
import { toast } from 'react-toastify';
import React from 'react';
import { uid } from 'uid';

import { db, genericConverter } from '~/shared/lib/firebaseClient';
import type { Quiz, Question } from '~/types';

import { QuizContext } from '../components/QuizContext';

export default function useQuiz() {
  const { quiz, setQuiz, questions, setQuestions } =
    React.useContext(QuizContext);

  const addQuestion = React.useCallback(
    (question: Question) => {
      setQuestions((_questions) => [..._questions, question]);
    },
    [setQuestions],
  );
  const editQuestion = React.useCallback(
    (question: Question) => {
      setQuestions((_questions) =>
        _questions.map((_question) =>
          _question.id === question.id ? question : _question,
        ),
      );
    },
    [setQuestions],
  );
  const deleteQuestion = React.useCallback(
    (question: Question) => {
      setQuestions((_questions) =>
        _questions.filter((_question) => _question.id !== question.id),
      );
    },
    [setQuestions],
  );

  const saveQuiz = React.useCallback(
    (values: Pick<Quiz, 'name' | 'description' | 'maxMembersPerTeam'>) => {
      const id = quiz?.id || uid(16);

      const isEdit = !!quiz;
      const save = isEdit ? updateDoc : setDoc;

      const savedQuiz: Quiz = isEdit
        ? {
            ...quiz,
            ...values,
            updatedAt: Date.now(),
          }
        : { ...values, id, status: 'ready', createdAt: Date.now() };
      delete savedQuiz.questions;

      return save(
        doc(db, 'quizzes', id).withConverter(genericConverter<Quiz>()),
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
            setQuiz((_quiz) => ({ ...savedQuiz, questions }));

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
    [questions, quiz, setQuiz],
  );

  return {
    quiz,
    saveQuiz,
    questions,
    addQuestion,
    editQuestion,
    deleteQuestion,
  };
}
