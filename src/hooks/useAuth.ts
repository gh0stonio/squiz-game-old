import {
  type AuthError,
  type User,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
} from 'firebase/auth';
import React from 'react';

import { useCreateSubscriptionQuery } from '~/lib/data-fetcher';
import { auth } from '~/lib/firebase';

export const useAuth = () => {
  return useCreateSubscriptionQuery<User, AuthError>(
    ['firebase_user'],
    (onSuccess) => auth.onAuthStateChanged(onSuccess),
  );
};

export const useAuthSignOut = () => {
  return React.useCallback(() => signOut(auth), []);
};

export const useAuthSignInWithPopup = () => {
  return React.useCallback(
    () => signInWithPopup(auth, new GoogleAuthProvider()),
    [],
  );
};
