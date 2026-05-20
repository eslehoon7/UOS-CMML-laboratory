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
  const rawPw = pw.trim();
  const lowerPw = rawPw.toLowerCase();

  console.log('Login attempt for ID:', normalizedId);

  // Strictly require specific credentials as requested by user
  if (normalizedId === 'admin@cmml.com' && (rawPw === 'admincmml' || lowerPw === 'admincmml')) {
    // We use a specific internal email for the Firebase Auth singleton.
    const internalEmail = 'admin_v4@cmml.com'; 
    const internalPassword = 'admincmml'; 
    
    try {
      console.log('Attempting Firebase Auth sign-in...');
      const result = await signInWithEmailAndPassword(auth, internalEmail, internalPassword);
      console.log('Sign-in successful');
      return result;
    } catch (error: any) {
      console.error('Firebase Auth sign-in failed:', error.code, error.message);
      
      const errorCode = error.code || '';
      
      if (errorCode === 'auth/user-not-found' || errorCode === 'auth/invalid-credential') {
        try {
          console.log('Account not found or invalid credential. Attempting to bootstrap admin account...');
          const createResult = await createUserWithEmailAndPassword(auth, internalEmail, internalPassword);
          console.log('Bootstrap successful');
          return createResult;
        } catch (createError: any) {
          console.error('Bootstrap failed:', createError.code, createError.message);
          if (createError.code === 'auth/email-already-in-use') {
            console.log('Account already exists, retrying login one last time...');
            return await signInWithEmailAndPassword(auth, internalEmail, internalPassword);
          }
          throw createError;
        }
      }
      throw error;
    }
  }
  
  console.warn('Login blocked: Invalid ID or Password format in UI check');
  // Specific error for unauthorized credentials
  const error = new Error('Invalid ID or Password.');
  (error as any).code = 'auth/invalid-credential';
  throw error;
};

export const logout = () => signOut(auth);
