import { useRouter } from 'next/router';

import { QuizLayout } from '~/layouts/quiz/QuizLayout';
import { type NextPageWithLayout } from '~/types';

import styles from './Lobby.module.scss';

export const Lobby: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;

  return <div className={styles.container}>Lobby for quiz {id}</div>;
};

Lobby.getLayout = (page) => <QuizLayout>{page}</QuizLayout>;
