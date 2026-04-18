import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDummyKeyForArchitectureOnly",
  authDomain: "estateflow-54561.firebaseapp.com",
  projectId: "estateflow-54561",
  storageBucket: "estateflow-54561.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:dummy"
};

export function getFirebaseApp(): FirebaseApp {
  return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}

export function getFirebaseAuth(app: FirebaseApp): Auth {
  return getAuth(app);
}

export function getFirebaseFirestore(app: FirebaseApp): Firestore {
  return getFirestore(app);
}
