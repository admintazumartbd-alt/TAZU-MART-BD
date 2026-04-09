import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Phone, MessageCircle, Mail, MapPin, Facebook, Map, Save, Loader2, CheckCircle2 } from 'lucide-react';
import axios from '../../lib/api';
import { ContactSettings } from '../../types';

export default function AdminContactSettings() {
  const [settings, setSettings] = useState<ContactSettings>({
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    messengerLink: '',
    googleMapEmbed: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/settings/contact');
      setSettings(response.data);
    } catch (err) {
      console.error("Failed to fetch contact settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await axios.post('/api/admin/settings/contact', settings);
      if (response.data.success || response.status === 200) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save contact settings:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-20 flex flex-col items-center justify-center gap-4 text-gray-400">
        <Loader2 className="w-10 h-10 animate-spin text-[#f85606]" />
        <p className="animate-pulse">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Settings</h1>
          <p className="text-sm text-gray-500">Update your store's contact information and social links</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#f85606] text-white px-8 py-2.5 rounded-xl font-bold hover:bg-[#d94800] transition-all shadow-lg shadow-orange-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? <Loader2 size={20} className="animate-spin" /> : success ? <CheckCircle2 size={20} /> : <Save size={20} />}
          {saving ? 'Saving...' : success ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Primary Contact */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-bold text-gray-900 border-b pb-4">Primary Contact</h2>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Phone size={14} className="text-[#f85606]" />
              Phone Number
            </label>
            <input 
              type="text" 
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#f85606] outline-none transition-all"
              placeholder="017XXXXXXXX"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <MessageCircle size={14} className="text-green-500" />
              WhatsApp Number
            </label>
            <input 
              type="text" 
              value={settings.whatsapp}
              onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#f85606] outline-none transition-all"
              placeholder="017XXXXXXXX"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Mail size={14} className="text-blue-500" />
              Email Address
            </label>
            <input 
              type="email" 
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#f85606] outline-none transition-all"
              placeholder="info@tazumartbd.com"
            />
          </div>
        </div>

        {/* Social & Location */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-bold text-gray-900 border-b pb-4">Social & Location</h2>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Facebook size={14} className="text-blue-600" />
              Messenger Link
            </label>
            <input 
              type="text" 
              value={settings.messengerLink}
              onChange={(e) => setSettings({ ...settings, messengerLink: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#f85606] outline-none transition-all"
              placeholder="https://m.me/..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <MapPin size={14} className="text-red-500" />
              Store Address
            </label>
            <textarea 
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#f85606] outline-none transition-all min-h-[100px]"
              placeholder="Enter full address..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Map size={14} className="text-indigo-500" />
              Google Map Embed URL
            </label>
            <input 
              type="text" 
              value={settings.googleMapEmbed}
              onChange={(e) => setSettings({ ...settings, googleMapEmbed: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#f85606] outline-none transition-all"
              placeholder="https://www.google.com/maps/embed?..."
            />
          </div>
        </div>

        {/* Preview */}
        <div className="md:col-span-2 bg-gray-50 rounded-2xl p-8 border border-gray-100">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Live Preview (Contact Us Page)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#f85606]">
                <Phone size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Call Us</h4>
                <p className="text-sm text-gray-500">{settings.phone || '017XXXXXXXX'}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-green-500">
                <MessageCircle size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">WhatsApp</h4>
                <p className="text-sm text-gray-500">{settings.whatsapp || '017XXXXXXXX'}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-500">
                <Mail size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Email</h4>
                <p className="text-sm text-gray-500">{settings.email || 'info@tazumartbd.com'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
