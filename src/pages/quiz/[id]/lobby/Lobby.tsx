import Link from 'next/link';
import { useRouter } from 'next/router';
import { match } from 'ts-pattern';

import { useQuiz } from '~/hooks/useQuiz';
import { QuizLayout } from '~/layouts/quiz/QuizLayout';
import { type NextPageWithLayout } from '~/types';

import styles from './Lobby.module.scss';

export const Lobby: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const quizResult = useQuiz(id as string | undefined);

  return (
    <div className={styles.container}>
      <p>Lobby for quiz {id}</p>

      {match(quizResult)
        .with({ status: 'loading' }, () => <p>fetching ...</p>)
        .with({ status: 'success', data: { isFinished: true } }, ({ data }) => (
          <p>
            This quiz is over, please go back{' '}
            <Link href={{ pathname: '/' }}>
              <a>Home</a>
            </Link>
          </p>
        ))
        .with({ status: 'success' }, ({ data }) => <p>Quiz ongoing...</p>)
        .otherwise(() => null)}
    </div>
  );
};

Lobby.getLayout = (page) => <QuizLayout>{page}</QuizLayout>;

export default Lobby;
