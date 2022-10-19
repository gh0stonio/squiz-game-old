import { PropsWithChildren } from 'react';

import { Login } from '~/components/login/Login';

import styles from './BaseLayout.module.scss';

export const BaseLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Login />
      <main className={styles.container}>{children}</main>
    </>
  );
};
