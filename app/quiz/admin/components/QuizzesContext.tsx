'use client';
import 'client-only';
import { deleteDoc, doc, setDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import React from 'react';
import { uid } from 'uid';

import { db, genericConverter } from '~/shared/lib/firebaseClient';
import { Quiz } from '~/types';

const QuizzesContext = React.createContext<{
  quizzes: Quiz[];
  setQuizzes: React.Dispatch<React.SetStateAction<Quiz[]>>;
}>({
  quizzes: [],
  setQuizzes: () => [],
});

export function useQuizzes() {
  const { quizzes, setQuizzes } = React.useContext(QuizzesContext);

  function deleteQuiz(quizId: Quiz['id']) {
    deleteDoc(doc(db, 'quizzes', quizId)).then(
      () => {
        setQuizzes((_quizzes) => _quizzes.filter((quiz) => quiz.id !== quizId));
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
  }

  return { quizzes, setQuizzes, deleteQuiz };
}

export function useQuiz(quizId?: string) {
  const router = useRouter();
  const { quizzes, setQuizzes } = useQuizzes();

  const quiz = React.useMemo(() => {
    return quizzes.find((quiz) => quiz.id === quizId);
  }, [quizId, quizzes]);

  function saveQuiz(values: Pick<Quiz, 'name' | 'description'>, quiz?: Quiz) {
    const id = uid(16);

    const isEdit = !!quiz;
    const save = isEdit ? updateDoc : setDoc;

    const savedQuiz: Quiz = isEdit
      ? { ...quiz, ...values, updatedAt: Date.now() }
      : { ...values, id, status: 'ready', createdAt: Date.now() };

    return (
      save(
        doc(db, 'quizzes', id).withConverter(genericConverter<Quiz>()),
        savedQuiz,
      )
        // .then(() =>
        //   Promise.all(
        //     questions.map((question) =>
        //       setDoc(
        //         doc(db, 'quizzes', id, 'questions', question.id).withConverter(
        //           questionConverter,
        //         ),
        //         question,
        //       ),
        //     ),
        //   ),
        // )
        .then(
          () => {
            router.push('/quiz/admin');

            setQuizzes((_quizzes) => [..._quizzes, savedQuiz]);
            toast.success('Quiz added !', {
              theme: 'colored',
            });
          },
          () => {
            toast.error('Failed adding the Quiz !', {
              theme: 'colored',
            });
          },
        )
    );
  }

  return { quiz, saveQuiz };
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
