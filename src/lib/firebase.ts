import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export const loginWithCmml = async (id: string, pw: string) => {
  const normalizedId = id.trim().toLowerCase();
  const normalizedPw = pw.trim().toLowerCase();

  const isValidId = ['cmml', 'admin', 'lab', 'user'].includes(normalizedId);
  const isValidPw = ['cmml', 'admin', '1234', '123456', 'lab'].includes(normalizedPw);

  if (isValidId && isValidPw) {
    const email = 'admin@cmml.lab';
    const password = 'cmmlcmml';
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        return await createUserWithEmailAndPassword(auth, email, password);
      }
      throw error;
    }
  }
  throw new Error('Invalid credentials');
};

export const logout = () => signOut(auth);
