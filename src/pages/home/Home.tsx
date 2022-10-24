import Image from 'next/image';
import type { NextPage } from 'next';
import React from 'react';
import { match, P } from 'ts-pattern';

import { QuizzesList } from '~/components/quizzesList/QuizzesList';
import { useQuizzes } from '~/hooks/useQuizzes';

import Logo from '../../../public/logo.png';

import styles from './Home.module.scss';

const Home: NextPage = () => {
  const quizzesResult = useQuizzes();

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

      {match(quizzesResult)
        .with({ status: 'disabled' }, () => <p>Please sign in.</p>)
        .with(
          { status: 'ready', ongoingQuizzes: P.union(P.nullish, []) },
          () => <p>no quiz available</p>,
        )
        .with({ status: 'ready' }, ({ quizzes }) => (
          <QuizzesList quizzes={quizzes} />
        ))
        .with({ status: 'loading' }, () => <p>fetching quizzes...</p>)
        .with({ status: 'error' }, () => <p>shit happened</p>)
        .exhaustive()}
    </div>
  );
};

export default Home;
