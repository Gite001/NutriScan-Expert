import { getFirebaseApp, getFirebaseAuth, getFirebaseFirestore } from '@/firebase/config';

// Singleton instance to avoid multiple initializations
const app = getFirebaseApp();
const auth = getFirebaseAuth(app);
const db = getFirebaseFirestore(app);

export { auth, db };
