import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/src/types';

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

import { useActivity } from './ActivityContext';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const { logActivity } = useActivity();

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity = 1) => {
    if (product.stock === 0) {
      alert('Product is out of stock');
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        const newQuantity = existing.quantity + quantity;
        if (newQuantity > product.stock) {
          alert(`Only ${product.stock} items available in stock`);
          return prev;
        }
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: newQuantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    logActivity('ADD_TO_CART', { productId: product.id, productName: product.name, quantity });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
    logActivity('REMOVE_FROM_CART', { productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        if (quantity > item.stock) {
          alert(`Only ${item.stock} items available in stock`);
          return item;
        }
        return { ...item, quantity };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const mergeCart = (guestItems: CartItem[]) => {
    setCart(prev => {
      const merged = [...prev];
      guestItems.forEach(guestItem => {
        const existing = merged.find(item => item.id === guestItem.id);
        if (existing) {
          existing.quantity += guestItem.quantity;
        } else {
          merged.push(guestItem);
        }
      });
      return merged;
    });
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
