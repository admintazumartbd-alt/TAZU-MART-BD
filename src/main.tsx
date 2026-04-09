import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import axios from 'axios';
import App from './App.tsx';
import './index.css';

// Configure axios base URL for production
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
axios.defaults.baseURL = (apiBaseUrl && apiBaseUrl.startsWith('http') && !apiBaseUrl.includes('localhost:3000')) 
  ? apiBaseUrl 
  : '';
axios.defaults.withCredentials = true;
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider } from './context/AuthContext';
import { ActivityProvider } from './context/ActivityContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ActivityProvider>
        <SettingsProvider>
          <CartProvider>
            <WishlistProvider>
              <App />
            </WishlistProvider>
          </CartProvider>
        </SettingsProvider>
      </ActivityProvider>
    </AuthProvider>
  </StrictMode>,
);
