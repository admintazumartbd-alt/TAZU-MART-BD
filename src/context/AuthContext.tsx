import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export type UserRole = 'ADMIN' | 'CUSTOMER';
export type LoginMethod = 'MANUAL' | 'GOOGLE' | 'FACEBOOK';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
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
  register: (data: { email: string; password?: string; name: string; phone?: string; address?: string }) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendMagicLink: (email: string) => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchUserData(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') { // Not found
          // Handle new user creation if needed, but usually Supabase Auth 
          // should be synced with a users table via triggers or manual insert
          setUser(null);
        } else {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUser(data as User);
      }
    } catch (err) {
      console.error('Unexpected error fetching user:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveUserToSupabase = async (userData: User) => {
    const { error } = await supabase
      .from('users')
      .upsert(userData);
    
    if (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  };

  const logActivity = async (userData: User, type: 'LOGIN' | 'REGISTRATION', method: LoginMethod) => {
    try {
      await supabase.from('activities').insert({
        userId: userData.id,
        userName: userData.name,
        type,
        method,
        timestamp: new Date().toISOString(),
        device: window.innerWidth < 768 ? 'Mobile' : 'Desktop'
      });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  const login = async (emailInput: string, password?: string) => {
    if (!password) throw new Error('Password is required for manual login');
    
    const email = emailInput.trim();
    let { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    const adminEmails = ['admin.tazumart060@gmail.com', 'admin.tazumartbd@gmail.com'];
    const isAdminEmail = adminEmails.includes(email.toLowerCase());

    // Improved Admin Login Logic
    if (error && isAdminEmail) {
      // If it's a rate limit error, pass it through with a helpful message
      if (error.message.includes('rate limit')) {
        throw new Error('Too many attempts. Please wait a few minutes before trying again.');
      }

      // If credentials are invalid, it might be the first time (account doesn't exist)
      // or the password is truly wrong.
      if (error.message.includes('Invalid login credentials') || error.status === 400) {
        try {
          // Try to bootstrap the admin account
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: 'Tazu Mart Admin',
              }
            }
          });

          if (signUpError) {
            // If user already exists, then the password was definitely wrong
            if (signUpError.message.toLowerCase().includes('already registered')) {
              throw new Error('The admin account exists but the password entered is incorrect. Please use the correct password or use the Magic Link.');
            }
            // If it's a rate limit during signup
            if (signUpError.message.toLowerCase().includes('rate limit')) {
              throw new Error('Too many attempts. Please wait a few minutes or use the Magic Link to log in.');
            }
            throw signUpError;
          }

          if (signUpData.user) {
            if (signUpData.session) {
              data = { user: signUpData.user, session: signUpData.session };
              error = null;
            } else {
              // Signup succeeded but session is null (likely email confirmation required)
              throw new Error('Admin account created! However, Supabase requires email confirmation by default. Please check your inbox OR disable "Confirm email" in Supabase Dashboard (Authentication > Providers > Email) to log in instantly.');
            }
          }
        } catch (bootstrapErr: any) {
          console.error('Admin bootstrap failed:', bootstrapErr);
          throw bootstrapErr;
        }
      }
    }

    if (error) throw error;
    if (!data.user) throw new Error('Login failed');
    
    // Fetch or create user record
    const { data: userRecord, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    let userData: User;
    
    if (userRecord) {
      userData = userRecord as User;
      // Ensure role is ADMIN if it's the admin email, even if it was changed in DB
      if (isAdminEmail && userData.role !== 'ADMIN') {
        userData.role = 'ADMIN';
        await supabase.from('users').update({ role: 'ADMIN' }).eq('id', data.user.id);
      }
      userData.lastLogin = new Date().toISOString();
      await supabase.from('users').update({ lastLogin: userData.lastLogin }).eq('id', data.user.id);
    } else {
      userData = {
        id: data.user.id,
        name: isAdminEmail ? 'Tazu Mart Admin' : data.user.email?.split('@')[0] || 'User',
        email: data.user.email || '',
        role: isAdminEmail ? 'ADMIN' : 'CUSTOMER',
        loginMethod: 'MANUAL',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        status: 'ACTIVE'
      };
      await saveUserToSupabase(userData);
    }
    
    setUser(userData);
    logActivity(userData, 'LOGIN', 'MANUAL');
  };

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) throw error;
  };

  const loginWithFacebook = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) throw error;
  };

  const register = async (data: { email: string; password?: string; name: string; phone?: string; address?: string }) => {
    if (!data.password) throw new Error('Password is required for registration');
    
    const email = data.email.trim();
    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password: data.password,
      options: {
        data: {
          full_name: data.name,
        }
      }
    });

    if (error) throw error;
    if (!authData.user) throw new Error('Registration failed');
    
    const adminEmails = ['admin.tazumart060@gmail.com', 'admin.tazumartbd@gmail.com'];
    const isAdminEmail = adminEmails.includes(authData.user.email?.toLowerCase() || '');
    const userData: User = {
      id: authData.user.id,
      name: data.name,
      email: authData.user.email || '',
      phone: data.phone,
      address: data.address,
      role: isAdminEmail ? 'ADMIN' : 'CUSTOMER',
      loginMethod: 'MANUAL',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      status: 'ACTIVE'
    };
    
    await saveUserToSupabase(userData);
    setUser(userData);
    logActivity(userData, 'REGISTRATION', 'MANUAL');
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth?type=recovery`,
    });
    if (error) throw error;
  };

  const sendMagicLink = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) throw error;
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
      resetPassword,
      sendMagicLink,
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
