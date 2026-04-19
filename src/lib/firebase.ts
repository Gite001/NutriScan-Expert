
import { getFirebaseApp, getFirebaseAuth, getFirebaseFirestore } from '@/firebase/config';

const app = getFirebaseApp();
const auth = getFirebaseAuth(app);
const db = getFirebaseFirestore(app);

export { auth, db };
