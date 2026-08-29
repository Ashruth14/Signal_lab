import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { firebaseAuthService, UserProfile } from '../services/firebaseAuth';
import { isFirebaseConfigured, getActiveFirebaseConfig } from '../services/firebase';

export type CloudSyncStatus = 'connected' | 'offline' | 'syncing' | 'unconfigured';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
  isConfigured: boolean;
  cloudSyncStatus: CloudSyncStatus;
  setCloudSyncStatus: (status: CloudSyncStatus) => void;
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  isConfigModalOpen: boolean;
  setConfigModalOpen: (open: boolean) => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  signInAsGuest: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshConfigState: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    // Read cached local guest if any
    const cachedGuest = localStorage.getItem('devatlas_local_guest');
    if (cachedGuest) {
      try {
        return JSON.parse(cachedGuest);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isConfigured, setIsConfigured] = useState<boolean>(() => isFirebaseConfigured());
  const [cloudSyncStatus, setCloudSyncStatus] = useState<CloudSyncStatus>(() =>
    isFirebaseConfigured() ? 'connected' : 'unconfigured'
  );

  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isConfigModalOpen, setConfigModalOpen] = useState(false);

  const refreshConfigState = useCallback(() => {
    const configured = isFirebaseConfigured();
    setIsConfigured(configured);
    setCloudSyncStatus(configured ? 'connected' : 'unconfigured');
  }, []);

  // Listen to configuration changes at runtime
  useEffect(() => {
    const handleConfigChange = () => {
      refreshConfigState();
    };
    window.addEventListener('devatlas:firebase-config-changed', handleConfigChange);
    return () => window.removeEventListener('devatlas:firebase-config-changed', handleConfigChange);
  }, [refreshConfigState]);

  // Subscribe to Firebase Auth changes
  useEffect(() => {
    if (!isConfigured) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = firebaseAuthService.onAuthStateChange((authUser) => {
      if (authUser) {
        setUser(authUser);
        localStorage.removeItem('devatlas_local_guest');
        setCloudSyncStatus('connected');
      } else {
        // Fall back to local guest if none logged in
        const cached = localStorage.getItem('devatlas_local_guest');
        setUser(cached ? JSON.parse(cached) : null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [isConfigured]);

  const signInWithGoogle = useCallback(async () => {
    setIsLoading(true);
    try {
      const u = await firebaseAuthService.signInWithGoogle();
      setUser(u);
      setCloudSyncStatus('connected');
      setAuthModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signInWithEmail = useCallback(async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const u = await firebaseAuthService.signInWithEmail(email, pass);
      setUser(u);
      setCloudSyncStatus('connected');
      setAuthModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signUpWithEmail = useCallback(async (email: string, pass: string, name: string) => {
    setIsLoading(true);
    try {
      const u = await firebaseAuthService.signUpWithEmail(email, pass, name);
      setUser(u);
      setCloudSyncStatus('connected');
      setAuthModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signInAsGuest = useCallback(async () => {
    setIsLoading(true);
    try {
      const u = await firebaseAuthService.signInAsGuest();
      setUser(u);
      if (!isFirebaseConfigured()) {
        localStorage.setItem('devatlas_local_guest', JSON.stringify(u));
      }
      setAuthModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      await firebaseAuthService.signOut();
      localStorage.removeItem('devatlas_local_guest');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const isAuthenticated = Boolean(user && !user.isAnonymous);
  const isGuest = Boolean(user && user.isAnonymous);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isGuest,
        isLoading,
        isConfigured,
        cloudSyncStatus,
        setCloudSyncStatus,
        isAuthModalOpen,
        setAuthModalOpen,
        isConfigModalOpen,
        setConfigModalOpen,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signInAsGuest,
        signOut,
        refreshConfigState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
