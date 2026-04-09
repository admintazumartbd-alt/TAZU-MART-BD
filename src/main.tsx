import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import axios from 'axios';
import App from './App.tsx';
import './index.css';

// Configure axios base URL for production
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || '';
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
