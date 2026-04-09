import React, { useState, useEffect } from 'react';
import { useSettings } from '@/src/context/SettingsContext';
import { useAuth } from '@/src/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Save, Plus, Trash2, MoveVertical } from 'lucide-react';

export default function AdminFooterSettings() {
  const { footerSettings, updateFooterSettings } = useSettings();
  const { user } = useAuth();
  const adminEmails = ['admin.tazumart060@gmail.com', 'admin.tazumartbd@gmail.com'];
  const isAdmin = adminEmails.includes(user?.email.toLowerCase() || '');
  const navigate = useNavigate();
  const [localSettings, setLocalSettings] = useState(footerSettings);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  const handleSave = () => {
    setSaveStatus('saving');
    updateFooterSettings(localSettings);
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);
  };

  const handleLinkChange = (type: 'quickLinks' | 'customerServiceLinks', id: string, field: 'label' | 'url', value: string) => {
    setLocalSettings(prev => ({
      ...prev,
      [type]: prev[type].map(link => link.id === id ? { ...link, [field]: value } : link)
    }));
  };

  const addLink = (type: 'quickLinks' | 'customerServiceLinks') => {
    const newLink = { id: Date.now().toString(), label: 'New Link', url: '#' };
    setLocalSettings(prev => ({
      ...prev,
      [type]: [...prev[type], newLink]
    }));
  };

  const removeLink = (type: 'quickLinks' | 'customerServiceLinks', id: string) => {
    setLocalSettings(prev => ({
      ...prev,
      [type]: prev[type].filter(link => link.id !== id)
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 pb-32">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#111111]">Footer Settings</h1>
          <p className="text-gray-500">Manage your website footer content and links</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
          className="bg-[#E91E63] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#c2185b] transition-all shadow-lg shadow-pink-100 disabled:opacity-50"
        >
          <Save size={20} />
          {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-8">
        {/* Brand Area */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-xl font-bold border-b pb-4">Brand Identity</h2>
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-600">Footer Logo (Text or URL)</label>
              <input 
                type="text" 
                value={localSettings.logo}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, logo: e.target.value }))}
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-[#E91E63]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-600">Footer Description</label>
              <textarea 
                value={localSettings.description}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-[#E91E63] h-32"
              />
            </div>
          </div>
        </section>

        {/* Social Media */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-xl font-bold border-b pb-4">Social Media Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {['facebookUrl', 'instagramUrl', 'youtubeUrl', 'tiktokUrl'].map((field) => (
              <div key={field} className="space-y-2">
                <label className="text-sm font-bold text-gray-600 capitalize">{field.replace('Url', '')} URL</label>
                <input 
                  type="text" 
                  value={(localSettings as any)[field]}
                  onChange={(e) => setLocalSettings(prev => ({ ...prev, [field]: e.target.value }))}
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-[#E91E63]"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Contact Information */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-xl font-bold border-b pb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-gray-600">Address</label>
              <input 
                type="text" 
                value={localSettings.address}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-[#E91E63]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-600">Phone Number</label>
              <input 
                type="text" 
                value={localSettings.phone}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-[#E91E63]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-600">Email Address</label>
              <input 
                type="text" 
                value={localSettings.email}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-[#E91E63]"
              />
            </div>
          </div>
        </section>

        {/* Quick Links Manager */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-xl font-bold">Quick Links</h2>
            <button 
              onClick={() => addLink('quickLinks')}
              className="text-[#E91E63] font-bold text-sm flex items-center gap-1 hover:underline"
            >
              <Plus size={16} /> Add Link
            </button>
          </div>
          <div className="space-y-4">
            {localSettings.quickLinks.map((link) => (
              <div key={link.id} className="flex gap-4 items-end">
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Label</label>
                  <input 
                    type="text" 
                    value={link.label}
                    onChange={(e) => handleLinkChange('quickLinks', link.id, 'label', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#E91E63]"
                  />
                </div>
                <div className="flex-[2] space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">URL</label>
                  <input 
                    type="text" 
                    value={link.url}
                    onChange={(e) => handleLinkChange('quickLinks', link.id, 'url', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#E91E63]"
                  />
                </div>
                <button 
                  onClick={() => removeLink('quickLinks', link.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Customer Service Links Manager */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-xl font-bold">Customer Service Links</h2>
            <button 
              onClick={() => addLink('customerServiceLinks')}
              className="text-[#E91E63] font-bold text-sm flex items-center gap-1 hover:underline"
            >
              <Plus size={16} /> Add Link
            </button>
          </div>
          <div className="space-y-4">
            {localSettings.customerServiceLinks.map((link) => (
              <div key={link.id} className="flex gap-4 items-end">
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Label</label>
                  <input 
                    type="text" 
                    value={link.label}
                    onChange={(e) => handleLinkChange('customerServiceLinks', link.id, 'label', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#E91E63]"
                  />
                </div>
                <div className="flex-[2] space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">URL</label>
                  <input 
                    type="text" 
                    value={link.url}
                    onChange={(e) => handleLinkChange('customerServiceLinks', link.id, 'url', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#E91E63]"
                  />
                </div>
                <button 
                  onClick={() => removeLink('customerServiceLinks', link.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Copyright Text */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-xl font-bold border-b pb-4">Copyright Information</h2>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-600">Copyright Text</label>
            <input 
              type="text" 
              value={localSettings.copyrightText}
              onChange={(e) => setLocalSettings(prev => ({ ...prev, copyrightText: e.target.value }))}
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-[#E91E63]"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
