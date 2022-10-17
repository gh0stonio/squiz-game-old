import { match, P } from 'ts-pattern';

import { useAuth } from '~/hooks/useAuth';

import styles from './Login.module.scss';

export const Login: React.FC = () => {
  const { user, signInWithGoogle, signOut } = useAuth();

  return (
    <div className={styles.container}>
      {match(user)
        .with({ status: 'success', data: P.nullish }, () => (
          <button onClick={signInWithGoogle}>Sign In</button>
        ))
        .with({ status: 'success' }, ({ data }) => (
          <div className={styles.signedIn}>
            <p>Welcome {data.displayName}</p>
            <button onClick={signOut}>Sign Out</button>
          </div>
        ))
        .with({ status: 'loading' }, () => <p>...</p>)
        .with({ status: 'error' }, () => <p>shit happened</p>)
        .otherwise(() => null)}
    </div>
  );
};
