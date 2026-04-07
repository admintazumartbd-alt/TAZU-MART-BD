import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { useSettings } from '@/src/context/SettingsContext';

export default function Footer() {
  const { footerSettings } = useSettings();

  return (
    <footer className="bg-[#111111] text-white pt-10 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* Section 1 — Brand Area */}
          <div className="space-y-4">
            <Link to="/" className="text-xl font-bold tracking-tighter text-[#f85606]">
              {footerSettings.logo}
            </Link>
            <p className="text-gray-400 text-xs leading-relaxed">
              {footerSettings.description}
            </p>
            <div className="flex gap-3">
              <a href={footerSettings.facebookUrl} target="_blank" rel="noreferrer" className="bg-white/5 p-2 rounded-full hover:bg-[#f85606] transition-all">
                <Facebook size={16} />
              </a>
              <a href={footerSettings.instagramUrl} target="_blank" rel="noreferrer" className="bg-white/5 p-2 rounded-full hover:bg-[#f85606] transition-all">
                <Instagram size={16} />
              </a>
              <a href={footerSettings.youtubeUrl} target="_blank" rel="noreferrer" className="bg-white/5 p-2 rounded-full hover:bg-[#f85606] transition-all">
                <Youtube size={16} />
              </a>
              <a href={footerSettings.tiktokUrl} target="_blank" rel="noreferrer" className="bg-white/5 p-2 rounded-full hover:bg-[#f85606] transition-all">
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Section 2 — Quick Links */}
          <div>
            <h3 className="text-sm font-bold mb-4 uppercase tracking-wider">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-[#f85606] transition-all text-xs">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-[#f85606] transition-all text-xs">Contact Us</Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-gray-400 hover:text-[#f85606] transition-all text-xs">Terms of Service</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-400 hover:text-[#f85606] transition-all text-xs">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-400 hover:text-[#f85606] transition-all text-xs">Shop All</Link>
              </li>
            </ul>
          </div>

          {/* Section 3 — Customer Service & Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-bold mb-4 uppercase tracking-wider">Customer Service</h3>
              <ul className="space-y-2">
                {footerSettings.customerServiceLinks.map((link) => (
                  <li key={link.id}>
                    <Link to={link.url} className="text-gray-400 hover:text-[#f85606] transition-all text-xs">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold mb-4 uppercase tracking-wider">Contact Us</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-[#f85606] shrink-0" />
                  <span className="text-gray-400 text-xs">{footerSettings.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-[#f85606] shrink-0" />
                  <span className="text-gray-400 text-xs">{footerSettings.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-[#f85606] shrink-0" />
                  <span className="text-gray-400 text-xs">{footerSettings.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-gray-500 text-[10px]">
            {footerSettings.copyrightText}
          </p>
          <p className="text-gray-500 text-[10px]">
            Developed by TAZU MART Tech Team
          </p>
        </div>
      </div>
    </footer>
  );
}
