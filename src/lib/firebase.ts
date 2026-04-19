import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCorrectKeyShouldBeHere",
  authDomain: "estateflow-54561.firebaseapp.com",
  projectId: "estateflow-54561",
  storageBucket: "estateflow-54561.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:dummy"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };
