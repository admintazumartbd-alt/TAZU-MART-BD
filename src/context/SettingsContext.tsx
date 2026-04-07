import React, { createContext, useContext, useState, useEffect } from 'react';

interface FooterLink {
  id: string;
  label: string;
  url: string;
}

interface FooterSettings {
  logo: string;
  description: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  tiktokUrl: string;
  address: string;
  phone: string;
  email: string;
  businessHours: string;
  copyrightText: string;
  quickLinks: FooterLink[];
  customerServiceLinks: FooterLink[];
}

interface SettingsContextType {
  footerSettings: FooterSettings;
  updateFooterSettings: (settings: Partial<FooterSettings>) => void;
}

const defaultSettings: FooterSettings = {
  logo: 'TAZU MART BD',
  description: 'TAZU MART BD is a trusted online shopping platform in Bangladesh. We provide quality products, fast delivery, and reliable service for customers across the country.',
  facebookUrl: 'https://facebook.com',
  instagramUrl: 'https://instagram.com',
  youtubeUrl: 'https://youtube.com',
  tiktokUrl: 'https://tiktok.com',
  address: 'Jatrabari / Shonir Akhra Area, Dhaka, Bangladesh',
  phone: '01834800916',
  email: 'tazumartbd@gmail.com',
  businessHours: 'Sat - Thu, 10am - 8pm',
  copyrightText: '© 2026 TAZU MART BD. All Rights Reserved.',
  quickLinks: [
    { id: '1', label: 'Shop', url: '/shop' },
    { id: '2', label: 'About Us', url: '/about' },
    { id: '3', label: 'Contact Us', url: '/contact' },
    { id: '4', label: 'All Products', url: '/shop' },
    { id: '5', label: 'Become a Seller', url: '/contact' },
  ],
  customerServiceLinks: [
    { id: '1', label: 'Help Center', url: '/faq' },
    { id: '2', label: 'Contact Us', url: '/contact' },
    { id: '3', label: 'Order Tracking', url: '/track-order' },
    { id: '4', label: 'Return Policy', url: '/return-policy' },
    { id: '5', label: 'Refund Policy', url: '/return-policy' },
    { id: '6', label: 'Terms of Service', url: '/terms-of-service' },
    { id: '7', label: 'Privacy Policy', url: '/privacy-policy' },
  ]
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [footerSettings, setFooterSettings] = useState<FooterSettings>(() => {
    const saved = localStorage.getItem('website_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('website_settings', JSON.stringify(footerSettings));
  }, [footerSettings]);

  const updateFooterSettings = (newSettings: Partial<FooterSettings>) => {
    setFooterSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <SettingsContext.Provider value={{ footerSettings, updateFooterSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
}
