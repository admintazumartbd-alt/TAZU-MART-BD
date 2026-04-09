import axios from 'axios';
import { supabase } from './supabase';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
});

api.interceptors.request.use(async (config) => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.warn('Supabase session fetch error:', error.message);
      // If refresh token is invalid, we might want to sign out to clear it
      if (error.message.includes('Refresh Token Not Found') || error.message.includes('invalid refresh token')) {
        await supabase.auth.signOut();
      }
    }
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  } catch (err) {
    console.error('Unexpected error in API interceptor:', err);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
