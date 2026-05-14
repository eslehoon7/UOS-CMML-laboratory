import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Custom login helper to map id/pw to Firebase Email/Password Auth
export const loginWithCmml = async (id: string, pw: string) => {
  const normalizedId = id.trim().toLowerCase();
  const normalizedPw = pw.trim().toLowerCase();

  // Allow various common combinations for admin access
  const isValidId = ['cmml', 'admin', 'lab', 'user'].includes(normalizedId);
  const isValidPw = ['cmml', 'admin', '1234', '123456', 'lab'].includes(normalizedPw);

  if (isValidId && isValidPw) {
    const email = 'admin@cmml.lab';
    const password = 'cmmlcmml'; // Fixed internal password for Firebase Auth
    
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      // If user doesn't exist, try creating it once
      // auth/invalid-credential is the common error for missing user or wrong password in newer SDKs
      if (
        error.code === 'auth/invalid-credential' || 
        error.code === 'auth/user-not-found' || 
        error.code === 'auth/wrong-password'
      ) {
        try {
          return await createUserWithEmailAndPassword(auth, email, password);
        } catch (createError: any) {
          if (createError.code === 'auth/email-already-in-use') {
            // Sign in again if creation failed due to existing user (race condition)
            try {
              return await signInWithEmailAndPassword(auth, email, password);
            } catch (retryError) {
              throw error; // Throw original sign-in error
            }
          }
          throw createError;
        }
      }
      throw error;
    }
  }
  throw new Error('Invalid credentials');
};

export const logout = () => signOut(auth);
