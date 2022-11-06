'use client';
import 'client-only';
import { deleteDoc, doc, setDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import React from 'react';
import { uid } from 'uid';

import { db, genericConverter } from '~/shared/lib/firebaseClient';
import { Question, Quiz } from '~/types';

const QuizzesContext = React.createContext<{
  quizzes: Quiz[];
  setQuizzes: React.Dispatch<React.SetStateAction<Quiz[]>>;
}>({
  quizzes: [],
  setQuizzes: () => [],
});

export function useQuizzes() {
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

export function useQuiz(quizId?: string) {
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
            questions,
            name: values.name,
            description: values.description,
            updatedAt: Date.now(),
          }
        : { ...values, id, questions, status: 'ready', createdAt: Date.now() };

      return save(
        doc(db, 'quizzes', quiz?.id || id).withConverter(
          genericConverter<Quiz>(),
        ),
        savedQuiz,
      ).then(
        () => {
          router.push('/quiz/admin');

          setQuizzes((_quizzes) => {
            if (isEdit) {
              return _quizzes.map((_quiz) =>
                _quiz.id === quiz.id ? savedQuiz : _quiz,
              );
            }

            return [..._quizzes, savedQuiz];
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

export default function QuizzesProvider({
  children,
  initialQuizzes = [],
}: React.PropsWithChildren<{ initialQuizzes?: Quiz[] }>) {
  const [quizzes, setQuizzes] = React.useState(initialQuizzes);

  return (
    <QuizzesContext.Provider value={{ quizzes, setQuizzes }}>
      {children}
    </QuizzesContext.Provider>
  );
}
