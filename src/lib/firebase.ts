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

  console.log('Login attempt for ID:', normalizedId);

  // Strictly validate designated credentials
  const isAuthorizedId = normalizedId === 'rchang90' || normalizedId === 'rchang90@cmml.com' || normalizedId === 'eslehoon7@gmail.com';
  const isAuthorizedPw = rawPw === 'theochem90!';

  if (isAuthorizedId && isAuthorizedPw) {
    // We use a specific internal email for the Firebase Auth singleton.
    const internalEmail = 'rchang90_admin@cmml.com'; 
    const targetPassword = 'theochem90!'; 
    
    try {
      console.log('Attempting Firebase Auth sign-in...');
      const result = await signInWithEmailAndPassword(auth, internalEmail, targetPassword);
      console.log('Sign-in successful with the new password!');
      return result;
    } catch (error: any) {
      console.log('Firebase Auth sign-in with target password was not immediate (which is expected on first run):', error.code, error.message);
      
      const errorCode = error.code || '';
      if (errorCode === 'auth/user-not-found' || errorCode === 'auth/invalid-credential' || errorCode === 'auth/wrong-password') {
        try {
          console.log('Attempting to bootstrap/create fresh admin account...');
          const createResult = await createUserWithEmailAndPassword(auth, internalEmail, targetPassword);
          console.log('Bootstrap successful!');
          return createResult;
        } catch (createError: any) {
          console.error('Final bootstrap attempt failed:', createError.code, createError.message);
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
