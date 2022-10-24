import Image from 'next/image';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';
import { match, P } from 'ts-pattern';

import { useQuizzes } from '~/hooks/useQuizzes';

import Logo from '../../../public/logo.png';

import styles from './Home.module.scss';

const Home: NextPage = () => {
  const router = useRouter();
  const quizzes = useQuizzes();

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

      {match(quizzes)
        .with({ status: 'disabled' }, () => <p>Please sign in.</p>)
        .with({ status: 'ready', data: P.union(P.nullish, []) }, () => (
          <p>no quiz available</p>
        ))
        .with({ status: 'ready' }, ({ ongoingQuizzes }) => (
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
        ))
        .with({ status: 'loading' }, () => <p>fetching quizzes...</p>)
        .with({ status: 'error' }, () => <p>shit happened</p>)
        .exhaustive()}
    </div>
  );
};

export default Home;
