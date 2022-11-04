'use client';
import 'client-only';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { type User as FirebaseUser } from 'firebase/auth';
import { destroyCookie, setCookie } from 'nookies';
import React from 'react';

import { auth } from '~/misc/lib/firebaseClient';
import { User } from '~/types';

const AuthContext = React.createContext<User | undefined>(undefined);

async function updateCookieToken(user: FirebaseUser, auto: boolean = false) {
  const idToken = await user.getIdToken(true);
  console.log('renew token');
  setCookie(null, 'id_token', idToken, {
    maxAge: 60 * 60, // 1 hour
    path: '/',
    sameSite: true,
  });

  if (auto) {
    console.log('will auto renew token in 55min');
    setTimeout(() => {
      updateCookieToken(user, true);
    }, 3300000); // 55min
  }
}
async function logIn() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    login_hint: 'user@datadoghq.com',
  });
  const result = await signInWithPopup(auth, provider);

  if (!result.user.emailVerified) throw new Error('Not verified');
  if (!result.user.email?.endsWith('datadoghq.com'))
    throw new Error('Not a pup');

  await updateCookieToken(result.user);
}

async function logOut() {
  await signOut(auth);
  destroyCookie(null, 'id_token');
}

export function useAuth() {
  const user = React.useContext(AuthContext);
  return { user, logIn, logOut };
}

export default function AuthProvider({
  children,
  userFromServerAuth,
}: React.PropsWithChildren<{ userFromServerAuth?: User }>) {
  const [user, setUser] = React.useState<User | undefined>(userFromServerAuth);

  React.useEffect(() => {
    if (!user) {
      // enforce logging out if no user receive from the serve
      // might occur if token expire
      logOut();
    }
  }, []);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (!firebaseUser) return;

      await updateCookieToken(firebaseUser, true);

      setUser({
        uid: firebaseUser.uid,
        name: firebaseUser.displayName,
        email: firebaseUser.email!,
        emailVerified: firebaseUser.emailVerified,
        photoURL: firebaseUser.photoURL,
      });
    });

    return unsubscribe;
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}
