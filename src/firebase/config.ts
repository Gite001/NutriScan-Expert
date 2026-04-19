
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAHbx1MNr32KKZcFQxa_YGv2BhHDtalYuM",
  authDomain: "estateflow-54561.firebaseapp.com",
  projectId: "estateflow-54561",
  storageBucket: "estateflow-54561.firebasestorage.app",
  messagingSenderId: "1010028490601",
  appId: "1:1010028490601:web:1b27e89ddd3a82945057f8"
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
