import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { PropsWithChildren } from 'react';
import { match } from 'ts-pattern';

import { useAuth } from '~/hooks/useAuth';
import { useQuiz } from '~/hooks/useQuiz';
import { BaseLayout } from '~/layouts/base/BaseLayout';

import styles from './QuizLayout.module.scss';

export const QuizLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const authResult = useAuth();

  const { id } = router.query;
  const quiz = useQuiz(id as string | undefined);

  React.useEffect(() => {
    if (authResult.status !== 'connected') router.push('/');
  });

  return (
    <BaseLayout>
      <div className={styles.nav}>
        <Link href={{ pathname: '/quiz/[id]/lobby', query: { id } }}>
          <a>Lobby</a>
        </Link>
        |
        <Link href={{ pathname: '/quiz/[id]/teams', query: { id } }}>
          <a>Teams</a>
        </Link>
        |
        <Link href={{ pathname: '/' }}>
          <a>Exit</a>
        </Link>
      </div>

      <main className={styles.container}>
        {match(quiz)
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
          .with({ status: 'ready' }, () => children)
          .with({ status: 'error' }, () => <p>shit happened ¯\_(ツ)_/¯</p>)
          .exhaustive()}
      </main>
    </BaseLayout>
  );
};
