import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

export interface FirebaseConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  measurementId?: string;
}

const STORAGE_KEY_CUSTOM_CONFIG = 'devatlas_firebase_custom_config';

// Returns active Firebase config (from custom localStorage override or env vars)
export function getActiveFirebaseConfig(): FirebaseConfig {
  try {
    const customConfigStr = localStorage.getItem(STORAGE_KEY_CUSTOM_CONFIG);
    if (customConfigStr) {
      const parsed = JSON.parse(customConfigStr);
      if (parsed && parsed.apiKey && parsed.projectId) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse custom Firebase config from localStorage', e);
  }

  const env = (import.meta as any).env || {};
  return {
    apiKey: env.VITE_FIREBASE_API_KEY || '',
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: env.VITE_FIREBASE_APP_ID || '',
    measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || '',
  };
}

export function isFirebaseConfigured(): boolean {
  const config = getActiveFirebaseConfig();
  return Boolean(
    config.apiKey &&
    config.apiKey.length > 5 &&
    !config.apiKey.includes('your_api_key') &&
    config.projectId &&
    !config.projectId.includes('your_project_id')
  );
}

export function saveCustomFirebaseConfig(config: FirebaseConfig | null) {
  if (!config) {
    localStorage.removeItem(STORAGE_KEY_CUSTOM_CONFIG);
  } else {
    localStorage.setItem(STORAGE_KEY_CUSTOM_CONFIG, JSON.stringify(config));
  }
  // Trigger page reload or reinit if needed
  window.dispatchEvent(new CustomEvent('devatlas:firebase-config-changed'));
}

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let googleProvider: GoogleAuthProvider | null = null;

export function initFirebase() {
  const config = getActiveFirebaseConfig();

  if (!isFirebaseConfigured()) {
    return { app: null, auth: null, db: null, googleProvider: null };
  }

  try {
    if (getApps().length === 0) {
      app = initializeApp(config);
    } else {
      app = getApp();
    }

    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });

    return { app, auth, db, googleProvider };
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    return { app: null, auth: null, db: null, googleProvider: null };
  }
}

// Initial auto-initialization attempt
initFirebase();

export { app, auth, db, googleProvider };
