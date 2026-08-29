import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured, initFirebase } from './firebase';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
  role?: string;
}

export const firebaseAuthService = {
  // Auth state listener
  onAuthStateChange(callback: (user: UserProfile | null) => void) {
    if (!isFirebaseConfigured()) {
      callback(null);
      return () => {};
    }

    const { auth: activeAuth } = initFirebase();
    if (!activeAuth) {
      callback(null);
      return () => {};
    }

    return onAuthStateChanged(activeAuth, (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        callback({
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || (fbUser.isAnonymous ? 'Guest Explorer' : fbUser.email?.split('@')[0] || 'User'),
          photoURL: fbUser.photoURL,
          isAnonymous: fbUser.isAnonymous,
        });
      } else {
        callback(null);
      }
    });
  },

  // Sign In with Google OAuth Popup
  async signInWithGoogle(): Promise<UserProfile> {
    if (!isFirebaseConfigured()) {
      throw new Error('Firebase is not configured. Please add your credentials in Settings.');
    }
    const { auth: activeAuth, googleProvider: activeProvider } = initFirebase();
    if (!activeAuth || !activeProvider) {
      throw new Error('Firebase Auth is not available.');
    }

    const result = await signInWithPopup(activeAuth, activeProvider);
    const fbUser = result.user;
    return {
      uid: fbUser.uid,
      email: fbUser.email,
      displayName: fbUser.displayName || 'Google User',
      photoURL: fbUser.photoURL,
      isAnonymous: false,
    };
  },

  // Sign In with Email and Password
  async signInWithEmail(email: string, pass: string): Promise<UserProfile> {
    if (!isFirebaseConfigured()) {
      throw new Error('Firebase is not configured. Please add your credentials in Settings.');
    }
    const { auth: activeAuth } = initFirebase();
    if (!activeAuth) throw new Error('Firebase Auth is not available.');

    const result = await signInWithEmailAndPassword(activeAuth, email, pass);
    const fbUser = result.user;
    return {
      uid: fbUser.uid,
      email: fbUser.email,
      displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
      photoURL: fbUser.photoURL,
      isAnonymous: false,
    };
  },

  // Sign Up with Email, Password and Display Name
  async signUpWithEmail(email: string, pass: string, displayName: string): Promise<UserProfile> {
    if (!isFirebaseConfigured()) {
      throw new Error('Firebase is not configured. Please add your credentials in Settings.');
    }
    const { auth: activeAuth } = initFirebase();
    if (!activeAuth) throw new Error('Firebase Auth is not available.');

    const result = await createUserWithEmailAndPassword(activeAuth, email, pass);
    const fbUser = result.user;

    if (displayName.trim()) {
      try {
        await updateProfile(fbUser, { displayName: displayName.trim() });
      } catch (e) {
        console.warn('Could not set displayName on Firebase user', e);
      }
    }

    return {
      uid: fbUser.uid,
      email: fbUser.email,
      displayName: displayName.trim() || fbUser.email?.split('@')[0] || 'User',
      photoURL: fbUser.photoURL,
      isAnonymous: false,
    };
  },

  // Quick Anonymous / Guest Login
  async signInAsGuest(): Promise<UserProfile> {
    if (!isFirebaseConfigured()) {
      throw new Error('Firebase is not configured. Please add your credentials in Settings.');
    }
    const { auth: activeAuth } = initFirebase();
    if (!activeAuth) throw new Error('Firebase Auth is not available.');

    const result = await signInAnonymously(activeAuth);
    const fbUser = result.user;
    return {
      uid: fbUser.uid,
      email: null,
      displayName: 'Guest Explorer',
      photoURL: null,
      isAnonymous: true,
    };
  },

  // Sign Out
  async signOut(): Promise<void> {
    const { auth: activeAuth } = initFirebase();
    if (activeAuth) {
      await signOut(activeAuth);
    }
  },
};
