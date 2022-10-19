import { useRouter } from 'next/router';

import { QuizLayout } from '~/layouts/quiz/QuizLayout';
import { type NextPageWithLayout } from '~/types';

import styles from './Teams.module.scss';

export const Teams: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;

  return <div className={styles.container}>Teams for quiz {id}</div>;
};

Teams.getLayout = (page) => <QuizLayout>{page}</QuizLayout>;
