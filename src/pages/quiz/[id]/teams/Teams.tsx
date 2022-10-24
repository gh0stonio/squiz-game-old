import Link from 'next/link';
import { useRouter } from 'next/router';
import { match } from 'ts-pattern';

import { useQuiz } from '~/hooks/useQuiz';
import { QuizLayout } from '~/layouts/quiz/QuizLayout';
import { type NextPageWithLayout } from '~/types';

import styles from './Teams.module.scss';

export const Teams: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const quiz = useQuiz(id as string | undefined);

  console.log(quiz);

  return (
    <div className={styles.container}>
      Teams for quiz {id}
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
        .with({ status: 'ready' }, ({ quiz }) =>
          quiz.teams?.map((team) => <p key={team.id}>{team.id}</p>),
        )
        .with({ status: 'error' }, () => <p>shit happened ¯\_(ツ)_/¯</p>)
        .exhaustive()}
    </div>
  );
};

Teams.getLayout = (page) => <QuizLayout>{page}</QuizLayout>;

export default Teams;
