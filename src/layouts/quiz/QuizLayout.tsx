import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { PropsWithChildren } from 'react';

import { useAuth } from '~/hooks/useAuth';
import { BaseLayout } from '~/layouts/base/BaseLayout';

import styles from './QuizLayout.module.scss';

export const QuizLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const authResult = useAuth();

  React.useEffect(() => {
    if (authResult.status !== 'connected') router.push('/');
  });

  const { id } = router.query;

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
        <Link href={{ pathname: '/quiz/[id]/question', query: { id } }}>
          <a>Question</a>
        </Link>
        |
        <Link href={{ pathname: '/' }}>
          <a>Exit</a>
        </Link>
      </div>

      <main className={styles.container}>{children}</main>
    </BaseLayout>
  );
};
