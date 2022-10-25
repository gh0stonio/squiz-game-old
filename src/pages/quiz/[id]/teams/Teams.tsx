import Link from 'next/link';
import { useRouter } from 'next/router';
import { match, P } from 'ts-pattern';

import { useQuiz } from '~/hooks/useQuiz';
import { QuizLayout } from '~/layouts/QuizLayout';
import { type NextPageWithLayout } from '~/types';

import styles from './Teams.module.scss';

export const Teams: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const quiz = useQuiz(id as string | undefined);

  return (
    <div className={styles.container}>
      Teams for quiz {id}
      {match(quiz)
        .with(
          { status: 'ready', quiz: { teams: P.union(P.nullish, []) } },
          () => <p>no teams available</p>,
        )
        .with({ status: 'ready' }, ({ quiz, joinTeam, leaveTeam }) =>
          quiz.teams?.map((team) => (
            <div key={team.id}>
              {team.id}
              {quiz.myTeam?.id === team.id ? (
                <button onClick={() => leaveTeam(team)}>leave</button>
              ) : (
                !quiz.myTeam && (
                  <button onClick={() => joinTeam(team)}>join</button>
                )
              )}
            </div>
          )),
        )
        .with({ status: 'error' }, () => <p>shit happened ¯\_(ツ)_/¯</p>)
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

Teams.getLayout = (page) => <QuizLayout>{page}</QuizLayout>;

export default Teams;
