'use client';

export * from './provider';
export * from './client-provider';
export * from './auth/use-user';
export * from './firestore/use-doc';
export * from './firestore/use-collection';

import { getFirebaseApp, getFirebaseAuth, getFirebaseFirestore } from './config';

export function initializeFirebase() {
  const app = getFirebaseApp();
  const auth = getFirebaseAuth(app);
  const firestore = getFirebaseFirestore(app);
  return { app, auth, firestore };
}
