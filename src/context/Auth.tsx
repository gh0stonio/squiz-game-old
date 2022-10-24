import { type User } from 'firebase/auth';
import * as React from 'react';

import { auth } from '~/lib/firebase';

export const AuthContext = React.createContext<User | null>(null);

export function AuthProvider({
  children,
}: React.PropsWithChildren): JSX.Element {
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}
