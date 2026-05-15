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

  // Strictly require specific credentials as requested by user
  if (normalizedId === 'admin@cmml.com' && normalizedPw === 'admincmml') {
    // We use a specific internal email for the Firebase Auth singleton.
    const internalEmail = 'admin_v4@cmml.com'; 
    const internalPassword = 'admincmml'; 
    
    try {
      console.log('Attempting admin login...');
      return await signInWithEmailAndPassword(auth, internalEmail, internalPassword);
    } catch (error: any) {
      const errorCode = error.code || '';
      console.warn('Initial login failed:', errorCode);
      
      if (errorCode === 'auth/user-not-found' || errorCode === 'auth/invalid-credential') {
        try {
          console.log('Bootstrapping admin account...');
          return await createUserWithEmailAndPassword(auth, internalEmail, internalPassword);
        } catch (createError: any) {
          if (createError.code === 'auth/email-already-in-use') {
            console.log('Account exists, retrying login...');
            return await signInWithEmailAndPassword(auth, internalEmail, internalPassword);
          }
          throw createError;
        }
      }
      throw error;
    }
  }
  
  // Specific error for unauthorized credentials
  const error = new Error('Invalid ID or Password.');
  (error as any).code = 'auth/invalid-credential';
  throw error;
};

export const logout = () => signOut(auth);
