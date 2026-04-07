import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signOut, 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection,
  addDoc
} from 'firebase/firestore';
import { auth, db, googleProvider, facebookProvider, handleFirestoreError, OperationType } from '../firebase';

export type UserRole = 'ADMIN' | 'CUSTOMER';
export type LoginMethod = 'MANUAL' | 'GOOGLE' | 'FACEBOOK';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  role: UserRole;
  loginMethod: LoginMethod;
  createdAt: string;
  lastLogin: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'BLOCKED';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  register: (data: { email: string; password?: string; name: string; phone?: string }) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setUser(userDoc.data() as User);
          } else {
            const isAdminEmail = firebaseUser.email?.toLowerCase() === 'admin.tazumartbd@gmail.com';
            const userData: User = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || (isAdminEmail ? 'Tazu Mart Admin' : firebaseUser.email?.split('@')[0] || 'User'),
              email: firebaseUser.email || '',
              image: firebaseUser.photoURL || undefined,
              role: isAdminEmail ? 'ADMIN' : 'CUSTOMER',
              loginMethod: 'MANUAL',
              createdAt: firebaseUser.metadata.creationTime ? new Date(firebaseUser.metadata.creationTime).toISOString() : new Date().toISOString(),
              lastLogin: firebaseUser.metadata.lastSignInTime ? new Date(firebaseUser.metadata.lastSignInTime).toISOString() : new Date().toISOString(),
              status: 'ACTIVE'
            };
            setUser(userData);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const saveUserToFirestore = async (userData: User) => {
    try {
      await setDoc(doc(db, 'users', userData.id), userData);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${userData.id}`);
    }
  };

  const logActivity = async (userData: User, type: 'LOGIN' | 'REGISTRATION', method: LoginMethod) => {
    try {
      await addDoc(collection(db, 'activities'), {
        id: Date.now(),
        userId: userData.id,
        userName: userData.name,
        type,
        method,
        timestamp: new Date().toISOString(),
        device: window.innerWidth < 768 ? 'Mobile' : 'Desktop'
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'activities');
    }
  };

  const login = async (email: string, password?: string) => {
    if (!password) throw new Error('Password is required for manual login');
    const result = await signInWithEmailAndPassword(auth, email, password);
    const isAdminEmail = result.user.email?.toLowerCase() === 'admin.tazumartbd@gmail.com';
    
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));
    let userData: User;
    
    if (userDoc.exists()) {
      userData = userDoc.data() as User;
      userData.lastLogin = new Date().toISOString();
      await updateDoc(doc(db, 'users', result.user.uid), { lastLogin: userData.lastLogin });
    } else {
      userData = {
        id: result.user.uid,
        name: result.user.displayName || (isAdminEmail ? 'Tazu Mart Admin' : result.user.email?.split('@')[0] || 'User'),
        email: result.user.email || '',
        image: result.user.photoURL || undefined,
        role: isAdminEmail ? 'ADMIN' : 'CUSTOMER',
        loginMethod: 'MANUAL',
        createdAt: result.user.metadata.creationTime ? new Date(result.user.metadata.creationTime).toISOString() : new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        status: 'ACTIVE'
      };
      await saveUserToFirestore(userData);
    }
    
    setUser(userData);
    logActivity(userData, 'LOGIN', 'MANUAL');
  };

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const isAdminEmail = result.user.email?.toLowerCase() === 'admin.tazumartbd@gmail.com';
    
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));
    let userData: User;
    
    if (userDoc.exists()) {
      userData = userDoc.data() as User;
      userData.lastLogin = new Date().toISOString();
      await updateDoc(doc(db, 'users', result.user.uid), { lastLogin: userData.lastLogin });
    } else {
      userData = {
        id: result.user.uid,
        name: result.user.displayName || (isAdminEmail ? 'Tazu Mart Admin' : result.user.email?.split('@')[0] || 'User'),
        email: result.user.email || '',
        image: result.user.photoURL || undefined,
        role: isAdminEmail ? 'ADMIN' : 'CUSTOMER',
        loginMethod: 'GOOGLE',
        createdAt: result.user.metadata.creationTime ? new Date(result.user.metadata.creationTime).toISOString() : new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        status: 'ACTIVE'
      };
      await saveUserToFirestore(userData);
    }
    
    setUser(userData);
    logActivity(userData, 'LOGIN', 'GOOGLE');
  };

  const loginWithFacebook = async () => {
    const result = await signInWithPopup(auth, facebookProvider);
    const isAdminEmail = result.user.email?.toLowerCase() === 'admin.tazumartbd@gmail.com';
    
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));
    let userData: User;
    
    if (userDoc.exists()) {
      userData = userDoc.data() as User;
      userData.lastLogin = new Date().toISOString();
      await updateDoc(doc(db, 'users', result.user.uid), { lastLogin: userData.lastLogin });
    } else {
      userData = {
        id: result.user.uid,
        name: result.user.displayName || (isAdminEmail ? 'Tazu Mart Admin' : result.user.email?.split('@')[0] || 'User'),
        email: result.user.email || '',
        image: result.user.photoURL || undefined,
        role: isAdminEmail ? 'ADMIN' : 'CUSTOMER',
        loginMethod: 'FACEBOOK',
        createdAt: result.user.metadata.creationTime ? new Date(result.user.metadata.creationTime).toISOString() : new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        status: 'ACTIVE'
      };
      await saveUserToFirestore(userData);
    }
    
    setUser(userData);
    logActivity(userData, 'LOGIN', 'FACEBOOK');
  };

  const register = async (data: { email: string; password?: string; name: string; phone?: string }) => {
    if (!data.password) throw new Error('Password is required for registration');
    const result = await createUserWithEmailAndPassword(auth, data.email, data.password);
    await updateProfile(result.user, { displayName: data.name });
    
    const isAdminEmail = result.user.email?.toLowerCase() === 'admin.tazumartbd@gmail.com';
    const userData: User = {
      id: result.user.uid,
      name: data.name,
      email: result.user.email || '',
      phone: data.phone,
      role: isAdminEmail ? 'ADMIN' : 'CUSTOMER',
      loginMethod: 'MANUAL',
      createdAt: result.user.metadata.creationTime ? new Date(result.user.metadata.creationTime).toISOString() : new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      status: 'ACTIVE'
    };
    
    await saveUserToFirestore(userData);
    setUser(userData);
    logActivity(userData, 'REGISTRATION', 'MANUAL');
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading,
      login, 
      loginWithGoogle,
      loginWithFacebook,
      register, 
      logout, 
      isAuthenticated: !!user,
      isAdmin: user?.role === 'ADMIN'
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
