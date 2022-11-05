'use client';
import 'client-only';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { type User as FirebaseUser } from 'firebase/auth';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { setCookie } from 'nookies';
import React from 'react';

import { auth } from '~/shared/lib/firebaseClient';
import { User } from '~/types';

const AuthContext = React.createContext<User | undefined>(undefined);

async function updateTokenCookie(user: FirebaseUser) {
  const idToken = await user.getIdToken(true);
  console.log('update token');
  setCookie(null, 'id_token', idToken, {
    maxAge: 60 * 60, // 1 hour
    path: '/',
  });
}
let autoRenewOn = false;
async function autoRenewTokenCookie(user: FirebaseUser) {
  if (autoRenewOn) return;

  autoRenewOn = true;
  setInterval(() => {
    updateTokenCookie(user);
  }, 600000); // 10min
}
function clearTokenCookie() {
  setCookie(null, 'id_token', '', {
    maxAge: 0,
    path: '/',
  });
}

export function useAuth() {
  const router = useRouter();
  const params = useSearchParams();

  const user = React.useContext(AuthContext);

  async function logIn() {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      login_hint: 'user@datadoghq.com',
    });
    const result = await signInWithPopup(auth, provider);

    if (!result.user.emailVerified) throw new Error('Not verified');
    if (!result.user.email?.endsWith('datadoghq.com'))
      throw new Error('Not a pup');

    await updateTokenCookie(result.user);

    router.push(params.get('referer') || '/');
  }

  async function logOut() {
    await signOut(auth);

    clearTokenCookie();

    router.push('/login');
  }

  return { user, logIn, logOut };
}

export default function AuthProvider({
  children,
  userFromServerAuth,
}: React.PropsWithChildren<{ userFromServerAuth?: User }>) {
  const pathname = usePathname();
  const [user, setUser] = React.useState<User | undefined>(userFromServerAuth);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (!firebaseUser || pathname === '/login') {
        setUser(undefined);
        clearTokenCookie();

        return;
      }

      autoRenewTokenCookie(firebaseUser);

      if (!user) {
        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email!,
          emailVerified: firebaseUser.emailVerified,
          photoURL: firebaseUser.photoURL,
        });
      }
    });

    return unsubscribe;
  }, [user, pathname]);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}
