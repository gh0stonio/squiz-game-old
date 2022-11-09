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

  const currentQuestion = React.useMemo(() => {
    const onGoingQuestion = questions.find(
      (question) => question.status === 'in progress',
    );

    if (onGoingQuestion) return onGoingQuestion;

    return (questions
      .sort()
      .filter((question) => question.status === 'ready') || [])[0];
  }, [questions]);
  const nextQuestion = React.useMemo(() => {
    const onGoingQuestion = questions.find(
      (question) => question.status === 'in progress',
    );

    return (questions
      .sort()
      .filter((question) => question.status === 'ready') || [])[
      onGoingQuestion ? 0 : 1
    ];
  }, [questions]);

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
      delete savedQuiz.teams;

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

  const updateQuiz = React.useCallback(
    async (updatedQuiz: Quiz) => {
      // removing sub_collections to avoid storing them inside the quiz attribute in Firestore
      const savingQuiz = { ...updatedQuiz };
      delete savingQuiz.questions;
      delete savingQuiz.teams;

      await updateDoc(
        doc(db, 'quizzes', savingQuiz.id).withConverter(
          genericConverter<Quiz>(),
        ),
        savingQuiz,
      );

      setQuiz(updatedQuiz);
    },
    [setQuiz],
  );
  const start = React.useCallback(() => {
    if (!quiz) return;
    updateQuiz({ ...quiz, status: 'in progress' });
  }, [quiz, updateQuiz]);
  const reset = React.useCallback(async () => {
    if (!quiz) return;

    await Promise.all(
      (quiz.questions || []).map((question) =>
        setDoc(
          doc(db, 'quizzes', quiz.id, 'questions', question.id).withConverter(
            genericConverter<Question>(),
          ),
          { ...question, status: 'ready' },
        ),
      ),
    );

    await updateQuiz({
      ...quiz,
      questions: (quiz.questions || []).map((_question) => ({
        ..._question,
        status: 'ready',
      })),
      status: 'ready',
    });

    setQuestions((_questions) =>
      _questions.map((_question) => ({ ..._question, status: 'ready' })),
    );
  }, [quiz, setQuestions, updateQuiz]);
  const end = React.useCallback(() => {
    if (!quiz) return;
    updateQuiz({ ...quiz, status: 'finished' });
  }, [quiz, updateQuiz]);

  const pushQuestion = React.useCallback(async () => {
    if (!quiz || !currentQuestion) return;
    const startedAt = Date.now();

    await setDoc(
      doc(
        db,
        'quizzes',
        quiz.id,
        'questions',
        currentQuestion.id,
      ).withConverter(genericConverter<Question>()),
      { ...currentQuestion, status: 'in progress', startedAt },
    );

    setQuiz({
      ...quiz,
      questions: quiz.questions?.map((_question) =>
        _question.id === currentQuestion.id
          ? { ...currentQuestion, status: 'in progress', startedAt }
          : _question,
      ),
    });
    setQuestions((_questions) =>
      _questions.map((_question) =>
        _question.id === currentQuestion.id
          ? { ...currentQuestion, status: 'in progress', startedAt }
          : _question,
      ),
    );
  }, [currentQuestion, quiz, setQuestions, setQuiz]);

  return {
    quiz,
    saveQuiz,
    questions,
    addQuestion,
    editQuestion,
    deleteQuestion,
    currentQuestion,
    nextQuestion,
    pushQuestion,
    start,
    reset,
    end,
  };
}
