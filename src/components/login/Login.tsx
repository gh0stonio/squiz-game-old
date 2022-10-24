import { match, P } from 'ts-pattern';

import { useAuth } from '~/hooks/useAuth';

import styles from './Login.module.scss';

export const Login: React.FC = () => {
  const authResult = useAuth();

  return (
    <div className={styles.container}>
      {match(authResult)
        .with({ status: 'disconnected' }, ({ logIn }) => (
          <button onClick={logIn}>Sign In</button>
        ))
        .with({ status: 'connected' }, ({ user, logOut }) => (
          <div className={styles.signedIn}>
            <p>Welcome {user.displayName}</p>
            <button onClick={logOut}>Sign Out</button>
          </div>
        ))
        .with({ status: 'error' }, ({ error }) => (
          <p>shit happened {error.message}</p>
        ))
        .otherwise(() => null)}
    </div>
  );
};
