import { useRouter } from 'next/router';
import React from 'react';

import { Quiz } from '~/types';

import styles from './QuizzesList.module.scss';

export function QuizzesList({ quizzes }: { quizzes: Quiz[] }) {
  const router = useRouter();

  const ongoingQuizzes = React.useMemo(
    () => quizzes.filter((quiz) => !quiz.isFinished),
    [quizzes],
  );

  return (
    <div className={styles.quizzes}>
      {ongoingQuizzes.map((quiz) => (
        <div key={quiz.id} className={styles.quizCard}>
          {quiz.id}
          <button
            onClick={() =>
              router.push({
                pathname: '/quiz/[id]/lobby',
                query: { id: quiz.id },
              })
            }
          >
            join
          </button>
        </div>
      ))}
    </div>
  );
}
