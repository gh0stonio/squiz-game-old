import {
  useAuthSignInWithPopup,
  useAuthSignOut,
  useAuthUser,
} from '@react-query-firebase/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import React from 'react';

import { auth } from '~/lib/firebase';

const authKey = 'firebase_user';

export const useAuth = () => {
  const user = useAuthUser([authKey], auth);
  const signOutMutation = useAuthSignOut(auth);
  const signInMutation = useAuthSignInWithPopup(auth);

  const signInWithGoogle = React.useCallback(() => {
    signInMutation.mutate({
      provider: new GoogleAuthProvider(),
    });
  }, [signInMutation]);
  const signOut = React.useCallback(() => {
    signOutMutation.mutate();
  }, [signOutMutation]);

  return {
    user,
    signInWithGoogle,
    signOut,
  };
};
