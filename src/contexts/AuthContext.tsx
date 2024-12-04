import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  encryptionKey: string | null;
  setEncryptionKey: (key: string) => void;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true, 
  encryptionKey: null,
  setEncryptionKey: () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [encryptionKey, setEncryptionKey] = useState<string | null>(null);

  // Load encryption key when user changes
  useEffect(() => {
    const loadEncryptionKey = async (userId: string) => {
      try {
        console.log('Loading encryption key for user:', userId);
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const key = userDoc.data().encryptionKey;
          console.log('Encryption key loaded:', !!key);
          setEncryptionKey(key);
        } else {
          console.error('User document not found');
          setEncryptionKey(null);
        }
      } catch (error) {
        console.error('Error loading encryption key:', error);
        setEncryptionKey(null);
      }
    };

    if (user) {
      loadEncryptionKey(user.uid);
    } else {
      setEncryptionKey(null);
    }
  }, [user]);

  // Handle auth state changes
  useEffect(() => {
    console.log('Setting up auth state listener');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', !!user);
      setUser(user);
      if (!user) {
        setEncryptionKey(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    loading,
    encryptionKey,
    setEncryptionKey
  };

  console.log('Auth context state:', {
    hasUser: !!user,
    loading,
    hasEncryptionKey: !!encryptionKey
  });

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 