import Image from 'next/image';
import type { NextPage } from 'next';
import { match, P } from 'ts-pattern';

import { useQuizzes } from '~/hooks/useQuizzes';

import Logo from '../../../public/logo.png';

import styles from './Home.module.scss';

const Home: NextPage = () => {
  const result = useQuizzes();

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

      {match(result)
        .with({ status: 'unauthenticated' }, () => <p>please Sign In first</p>)
        .with({ status: 'success', quizzes: P.union(P.nullish, []) }, () => (
          <p>no quiz available</p>
        ))
        .with({ status: 'success' }, ({ unfinishedQuizzes }) => (
          <div className={styles.quizzes}>
            {unfinishedQuizzes.map((quiz) => (
              <div key={quiz.id} className={styles.quizCard}>
                {quiz.id}
              </div>
            ))}
          </div>
        ))
        .with({ status: 'loading' }, () => <p>fetching quizzes...</p>)
        .with({ status: 'error' }, () => <p>shit happened</p>)
        .otherwise(() => null)}
    </div>
  );
};

export default Home;
