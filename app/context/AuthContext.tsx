'use client';
import 'client-only';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { destroyCookie, setCookie } from 'nookies';
import React from 'react';

import { auth } from '~/misc/lib/firebaseClient';
import { User } from '~/types';

const AuthContext = React.createContext<User | undefined>(undefined);

async function logIn() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    login_hint: 'user@datadoghq.com',
  });
  const result = await signInWithPopup(auth, provider);

  if (!result.user.emailVerified)
    throw new Error('This email has not been verified by Google');

  if (!result.user.email?.endsWith('datadoghq.com'))
    throw new Error('This email is not of our pups !');

  const idToken = await result.user.getIdToken(true);
  setCookie(null, 'id_token', idToken, {
    maxAge: 24 * 60 * 60, // 1 day
    path: '/',
    sameSite: true,
  });
}
async function logOut() {
  await signOut(auth);
  destroyCookie(null, 'id_token');
}

export const useAuth = () => {
  const user = React.useContext(AuthContext);
  return { user, logIn, logOut };
};

export default function AuthProvider({
  children,
  userFromServerAuth,
}: React.PropsWithChildren<{ userFromServerAuth?: User }>) {
  const [user, setUser] = React.useState<User | undefined>(userFromServerAuth);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (!firebaseUser || user) return;

      setUser({
        uid: firebaseUser.uid,
        name: firebaseUser.displayName,
        email: firebaseUser.email!,
        emailVerified: firebaseUser.emailVerified,
        photoURL: firebaseUser.photoURL,
      });
    });
    return unsubscribe;
  }, [user]);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}
