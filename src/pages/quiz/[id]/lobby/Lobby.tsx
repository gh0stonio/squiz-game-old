import Link from 'next/link';
import { useRouter } from 'next/router';
import { match } from 'ts-pattern';

import { useQuiz } from '~/hooks/useQuizzes';
import { QuizLayout } from '~/layouts/quiz/QuizLayout';
import { type NextPageWithLayout } from '~/types';

import styles from './Lobby.module.scss';

export const Lobby: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const quiz = useQuiz(id as string | undefined);

  return (
    <div className={styles.container}>
      <p>Lobby for quiz {id}</p>

      {match(quiz)
        .with({ status: 'loading' }, () => <p>fetching ...</p>)
        .with({ status: 'not_found' }, () => (
          <p>
            No quiz found for this id, please go back{' '}
            <Link href={{ pathname: '/' }}>
              <a>Home</a>
            </Link>
          </p>
        ))
        .with({ status: 'ready', data: { isFinished: true } }, () => (
          <p>
            This quiz is over, please go back{' '}
            <Link href={{ pathname: '/' }}>
              <a>Home</a>
            </Link>
          </p>
        ))
        .with({ status: 'ready' }, () => <p>Quiz ongoing...</p>)
        .with({ status: 'error' }, () => <p>shit happened ¯\_(ツ)_/¯</p>)
        .exhaustive()}
    </div>
  );
};

Lobby.getLayout = (page) => <QuizLayout>{page}</QuizLayout>;

export default Lobby;
