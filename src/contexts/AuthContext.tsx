import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface UserProfile {
  uid: string;
  email: string;
  username: string;
  bio: string;
  personalLink: string;
  onPostLink?: string;
  animalPhoto?: string;
  animalName?: string;
  animalLocation?: string;
  petfinderLink?: string;
  isPremium: boolean;
  isAdmin: boolean;
  isFrozen: boolean;
  usernameChangedAt?: Date;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const generateRandomUsername = () => {
  return `User${Math.random().toString(36).substring(2, 10)}`;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await loadUserProfile(user.uid);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loadUserProfile = async (uid: string) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setUserProfile(docSnap.data() as UserProfile);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create user profile
    const userProfile: UserProfile = {
      uid: result.user.uid,
      email: result.user.email!,
      username: generateRandomUsername(),
      bio: "Thanks for checking out my profile!",
      personalLink: "Link (Optional)",
      isPremium: false,
      isAdmin: false,
      isFrozen: false,
      createdAt: new Date(),
    };

    await setDoc(doc(db, 'users', result.user.uid), userProfile);
    setUserProfile(userProfile);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !userProfile) return;
    
    const updatedProfile = { ...userProfile, ...updates };
    await setDoc(doc(db, 'users', user.uid), updatedProfile);
    setUserProfile(updatedProfile);
  };

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    logout,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};