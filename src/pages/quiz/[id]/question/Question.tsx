import { useRouter } from 'next/router';

import { QuizLayout } from '~/layouts/quiz/QuizLayout';
import { type NextPageWithLayout } from '~/types';

import styles from './Question.module.scss';

export const Question: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;

  return <div className={styles.container}>Question for quiz {id}</div>;
};

Question.getLayout = (page) => <QuizLayout>{page}</QuizLayout>;
