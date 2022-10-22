import Image from 'next/image';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';
import { match, P } from 'ts-pattern';

import { useAuth } from '~/hooks/useAuth';
import { useQuizzes } from '~/hooks/useQuizzes';

import Logo from '../../../public/logo.png';

import styles from './Home.module.scss';

const Home: NextPage = () => {
  const router = useRouter();
  const authResult = useAuth();
  const quizzesResult = useQuizzes({ isDisabled: !authResult.data });

  return (
    <div className={styles.container}>
      <Image
        src={Logo}
        alt="logo"
        height={150}
        width={150}
        className={styles.logo}
      />

      <h1>Squiz Game</h1>

      {!authResult.data ? (
        <p>please Sign In first</p>
      ) : (
        match(quizzesResult)
          .with({ status: 'success', data: P.union(P.nullish, []) }, () => (
            <p>no quiz available</p>
          ))
          .with({ status: 'success' }, ({ data }) => (
            <div className={styles.quizzes}>
              {data
                .filter((quiz) => !quiz.isFinished)
                .map((quiz) => (
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
          ))
          .with({ status: 'loading' }, () => <p>fetching quizzes...</p>)
          .with({ status: 'error' }, () => <p>shit happened</p>)
          .otherwise(() => null)
      )}
    </div>
  );
};

export default Home;
