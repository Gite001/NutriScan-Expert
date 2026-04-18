'use client';

import React, { ReactNode, useMemo } from 'react';
import { getFirebaseApp, getFirebaseAuth, getFirebaseFirestore } from './config';
import { FirebaseProvider } from './provider';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const { app, auth, firestore } = useMemo(() => {
    const app = getFirebaseApp();
    const auth = getFirebaseAuth(app);
    const firestore = getFirebaseFirestore(app);
    return { app, auth, firestore };
  }, []);

  return (
    <FirebaseProvider app={app} auth={auth} firestore={firestore}>
      <FirebaseErrorListener />
      {children}
    </FirebaseProvider>
  );
}
