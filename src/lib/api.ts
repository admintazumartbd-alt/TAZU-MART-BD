import axios from 'axios';
import { supabase } from './supabase';

const api = axios.create({
  baseURL: typeof window !== 'undefined' ? window.location.origin : '',
  timeout: 10000, // 10 seconds timeout
});

api.interceptors.request.use(async (config) => {
  try {
    // Use a promise with timeout for getSession
    const sessionPromise = supabase.auth.getSession();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Session fetch timeout')), 2000)
    );
    
    const { data: { session } } = await Promise.race([sessionPromise, timeoutPromise]) as any;
    
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  } catch (err) {
    console.warn('Auth interceptor error or timeout:', err);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error Details:', {
      message: error.message,
      code: error.code,
      config: error.config ? {
        url: error.config.url,
        method: error.config.method,
        baseURL: error.config.baseURL,
      } : null,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data,
      } : 'No response',
    });
    return Promise.reject(error);
  }
);

export default api;
