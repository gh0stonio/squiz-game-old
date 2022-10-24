import {
  type User,
  type UserCredential,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
} from 'firebase/auth';
import * as React from 'react';

import { AuthContext } from '~/context/Auth';
import { auth } from '~/lib/firebase';

type AuthResult =
  | { status: 'disconnected'; logIn: () => Promise<UserCredential> }
  | { status: 'connected'; user: User; logOut: () => Promise<void> }
  | { status: 'error'; error: Error };

export function useAuth(): AuthResult {
  const context = React.useContext(AuthContext);

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
      user: context,
      logOut,
    };
  }

  return { status: 'disconnected', logIn };
}
