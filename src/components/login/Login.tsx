import { match, P } from 'ts-pattern';

import {
  useAuth,
  useAuthSignInWithPopup,
  useAuthSignOut,
} from '~/hooks/useAuth';

import styles from './Login.module.scss';

export const Login: React.FC = () => {
  const authResult = useAuth();
  const signIn = useAuthSignInWithPopup();
  const signOut = useAuthSignOut();

  return (
    <div className={styles.container}>
      {match(authResult)
        .with({ status: 'success', data: P.nullish }, () => (
          <button onClick={signIn}>Sign In</button>
        ))
        .with({ status: 'success' }, ({ data }) => (
          <div className={styles.signedIn}>
            <p>Welcome {data.displayName}</p>
            <button onClick={signOut}>Sign Out</button>
          </div>
        ))
        .with({ status: 'error' }, () => <p>shit happened</p>)
        .otherwise(() => null)}
    </div>
  );
};
