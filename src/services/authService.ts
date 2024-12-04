import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  AuthErrorCodes
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { auth } from '../config/firebase';
import { generateEncryptionKey } from './encryptionService';
import { initializeUserData } from './diaryService';

export const db = getFirestore();

export class AuthError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AuthError';
  }
}

const handleAuthError = (error: FirebaseError): never => {
  switch (error.code) {
    case AuthErrorCodes.USER_DELETED:
      throw new AuthError('No account exists with this email address.');
    case AuthErrorCodes.INVALID_PASSWORD:
      throw new AuthError('Incorrect password. Please try again.');
    case AuthErrorCodes.INVALID_EMAIL:
      throw new AuthError('Invalid email address format.');
    case AuthErrorCodes.USER_DISABLED:
      throw new AuthError('This account has been disabled.');
    case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER:
      throw new AuthError('Too many failed attempts. Please try again later.');
    case AuthErrorCodes.EMAIL_EXISTS:
      throw new AuthError('An account already exists with this email address.');
    case AuthErrorCodes.WEAK_PASSWORD:
      throw new AuthError('Password must be at least 6 characters long.');
    case AuthErrorCodes.OPERATION_NOT_ALLOWED:
      throw new AuthError('Email/password accounts are not enabled. Please contact support.');
    default:
      throw new AuthError('An unexpected error occurred. Please try again.', error.code);
  }
};

const storeEncryptionKey = async (userId: string, encryptionKey: string) => {
  console.log('Storing encryption key for user:', userId);
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, { 
    encryptionKey,
    updatedAt: new Date()
  }, { merge: true });
  console.log('Encryption key stored successfully');
};

const getEncryptionKey = async (userId: string): Promise<string> => {
  console.log('Getting encryption key for user:', userId);
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  if (!userDoc.exists()) {
    console.error('User document not found');
    throw new Error('User encryption key not found');
  }
  const key = userDoc.data().encryptionKey;
  console.log('Encryption key retrieved:', !!key);
  return key;
};

export const signUp = async (email: string, password: string) => {
  try {
    console.log('Starting signup process');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const encryptionKey = await generateEncryptionKey();
    
    // Create initial user document in Firestore
    const userRef = doc(db, 'users', userCredential.user.uid);
    await setDoc(userRef, {
      email: userCredential.user.email,
      encryptionKey,
      createdAt: new Date(),
      lastLogin: new Date()
    });

    console.log('User document created with encryption key');
    await initializeUserData(userCredential.user.uid);

    return { user: userCredential.user, encryptionKey };
  } catch (error) {
    console.error('Signup error:', error);
    if (error instanceof FirebaseError) {
      handleAuthError(error);
    }
    throw new AuthError('Failed to create account. Please try again.');
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    console.log('Starting signin process');
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Update last login
    const userRef = doc(db, 'users', userCredential.user.uid);
    await setDoc(userRef, {
      lastLogin: new Date()
    }, { merge: true });

    const encryptionKey = await getEncryptionKey(userCredential.user.uid);
    console.log('Sign in successful, encryption key retrieved');
    
    return { user: userCredential.user, encryptionKey };
  } catch (error) {
    console.error('Signin error:', error);
    if (error instanceof FirebaseError) {
      handleAuthError(error);
    }
    throw new AuthError('Failed to sign in. Please try again.');
  }
};

export const logOut = async () => {
  try {
    console.log('Starting logout process');
    await signOut(auth);
    console.log('Logout successful');
  } catch (error) {
    console.error('Logout error:', error);
    throw new AuthError('Failed to sign out. Please try again.');
  }
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
}; 