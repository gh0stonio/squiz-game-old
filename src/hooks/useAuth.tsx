import {
  type AuthError,
  type User,
  type UserCredential,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
} from 'firebase/auth';
import * as React from 'react';

import { auth } from '~/lib/firebase';

type AuthResult =
  | { status: 'disconnected'; logIn: () => Promise<UserCredential> }
  | { status: 'connected'; data: User; logOut: () => Promise<void> }
  | { status: 'error'; error: Error };

const FirebaseAuthContext = React.createContext<User | null>(null);

export function AuthProvider({
  children,
}: React.PropsWithChildren): JSX.Element {
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);

  return (
    <FirebaseAuthContext.Provider value={user}>
      {children}
    </FirebaseAuthContext.Provider>
  );
}

export function useAuth(): AuthResult {
  const context = React.useContext(FirebaseAuthContext);

  const logOut = React.useCallback(() => signOut(auth), []);
  const logIn = React.useCallback(
    () => signInWithPopup(auth, new GoogleAuthProvider()),
    [],
  );

  if (context === undefined) {
    throw new Error(
      'useFirebaseAuth must be used within a FirebaseAuthProvider',
    );
  }

  if (context) {
    return {
      status: 'connected',
      data: context,
      logOut,
    };
  }

  return { status: 'disconnected', logIn };
}
