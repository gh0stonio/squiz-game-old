import Link from 'next/link';
import { useRouter } from 'next/router';
import { match, P } from 'ts-pattern';

import { useQuiz } from '~/hooks/useQuiz';
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
        .with({ status: 'ready', quiz: { myTeam: P.nullish } }, () => (
          <p>
            Please choose your team first{' '}
            <Link href={{ pathname: '/quiz/[id]/teams', query: { id } }}>
              <a>Teams</a>
            </Link>
          </p>
        ))
        .with({ status: 'ready', quiz: { isStarted: false } }, () => {
          return <p>Please wait for the quiz to start</p>;
        })
        .with({ status: 'ready' }, () => {
          return <p>Quiz ongoing... wait for next question</p>;
        })
        .otherwise(() => (
          <p>
            You should not be here{' '}
            <Link href="/">
              <a>Go back home</a>
            </Link>
          </p>
        ))}
    </div>
  );
};

Lobby.getLayout = (page) => <QuizLayout>{page}</QuizLayout>;

export default Lobby;
