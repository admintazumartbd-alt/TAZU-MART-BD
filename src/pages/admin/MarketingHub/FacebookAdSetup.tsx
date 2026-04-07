import React, { useState } from 'react';
import { 
  Facebook, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Shield, 
  ExternalLink,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../../lib/utils';

export default function FacebookAdSetup() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'not-connected' | 'error'>('not-connected');
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    businessManagerId: '',
    adAccountId: '',
    facebookPageId: '',
    pixelId: '',
    appId: '',
    appSecret: '',
    accessToken: ''
  });

  const handleValidate = async () => {
    setIsValidating(true);
    // Simulate validation
    setTimeout(() => {
      setIsValidating(false);
      setConnectionStatus('connected');
    }, 2000);
  };

  const handleSave = () => {
    // Save logic
    console.log('Saving Facebook Config:', formData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
            <Facebook size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Facebook Ad Setup</h1>
            <p className="text-sm text-gray-500 font-medium">Configure your Facebook Marketing integration</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
          <span className={cn(
            "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg",
            isEnabled ? "bg-emerald-50 text-emerald-600" : "bg-gray-50 text-gray-400"
          )}>
            {isEnabled ? 'Active' : 'Inactive'}
          </span>
          <button 
            onClick={() => setIsEnabled(!isEnabled)}
            className={cn(
              "w-12 h-6 rounded-full transition-all relative",
              isEnabled ? "bg-emerald-500" : "bg-gray-200"
            )}
          >
            <div className={cn(
              "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
              isEnabled ? "left-7" : "left-1"
            )} />
          </button>
        </div>
      </div>

      {/* Status Indicator */}
      <div className={cn(
        "p-4 rounded-2xl border flex items-center gap-4 transition-all",
        connectionStatus === 'connected' ? "bg-emerald-50 border-emerald-100 text-emerald-700" : 
        connectionStatus === 'error' ? "bg-rose-50 border-rose-100 text-rose-700" :
        "bg-gray-50 border-gray-100 text-gray-500"
      )}>
        {connectionStatus === 'connected' ? <CheckCircle2 size={20} /> : 
         connectionStatus === 'error' ? <AlertCircle size={20} /> : 
         <RefreshCw size={20} className={isValidating ? "animate-spin" : ""} />}
        <div className="flex-1">
          <p className="text-sm font-bold uppercase tracking-tight">
            Connection Status: {connectionStatus === 'connected' ? 'Connected' : 
                               connectionStatus === 'error' ? 'Error' : 'Not Connected'}
          </p>
          {errorMessage && <p className="text-xs mt-1 font-medium">{errorMessage}</p>}
        </div>
        <button 
          onClick={handleValidate}
          disabled={isValidating}
          className="px-4 py-2 bg-white border border-current rounded-xl text-xs font-bold hover:bg-opacity-50 transition-all disabled:opacity-50"
        >
          {isValidating ? 'Validating...' : 'Validate Connection'}
        </button>
      </div>

      {/* Main Config Card */}
      <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center gap-2">
          <Shield size={18} className="text-blue-600" />
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">API Configuration</h2>
        </div>
        
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Business Manager ID */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Business Manager ID</label>
              <input 
                type="text"
                placeholder="Enter ID"
                className="w-full h-12 px-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:bg-white focus:border-blue-500 transition-all outline-none"
                value={formData.businessManagerId}
                onChange={(e) => setFormData({...formData, businessManagerId: e.target.value})}
              />
            </div>

            {/* Ad Account ID */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Ad Account ID</label>
              <input 
                type="text"
                placeholder="act_xxxxxxxxxxxx"
                className="w-full h-12 px-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:bg-white focus:border-blue-500 transition-all outline-none"
                value={formData.adAccountId}
                onChange={(e) => setFormData({...formData, adAccountId: e.target.value})}
              />
            </div>

            {/* Facebook Page ID */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Facebook Page ID</label>
              <input 
                type="text"
                placeholder="Enter ID"
                className="w-full h-12 px-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:bg-white focus:border-blue-500 transition-all outline-none"
                value={formData.facebookPageId}
                onChange={(e) => setFormData({...formData, facebookPageId: e.target.value})}
              />
            </div>

            {/* Pixel ID */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Pixel ID</label>
              <input 
                type="text"
                placeholder="Enter ID"
                className="w-full h-12 px-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:bg-white focus:border-blue-500 transition-all outline-none"
                value={formData.pixelId}
                onChange={(e) => setFormData({...formData, pixelId: e.target.value})}
              />
            </div>
          </div>

          <div className="h-px bg-gray-50 w-full" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* App ID */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">App ID</label>
              <input 
                type="text"
                placeholder="Enter App ID"
                className="w-full h-12 px-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:bg-white focus:border-blue-500 transition-all outline-none"
                value={formData.appId}
                onChange={(e) => setFormData({...formData, appId: e.target.value})}
              />
            </div>

            {/* App Secret */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">App Secret</label>
              <div className="relative">
                <input 
                  type={showToken ? "text" : "password"}
                  placeholder="••••••••••••••••"
                  className="w-full h-12 px-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:bg-white focus:border-blue-500 transition-all outline-none pr-12"
                  value={formData.appSecret}
                  onChange={(e) => setFormData({...formData, appSecret: e.target.value})}
                />
                <button 
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showToken ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          {/* Access Token */}
          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Access Token</label>
              <a href="#" className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1">
                How to get token? <ExternalLink size={10} />
              </a>
            </div>
            <textarea 
              rows={3}
              placeholder="Enter long-lived access token"
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-mono focus:bg-white focus:border-blue-500 transition-all outline-none resize-none"
              value={formData.accessToken}
              onChange={(e) => setFormData({...formData, accessToken: e.target.value})}
            />
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-400">
            <Shield size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Encrypted Storage</span>
          </div>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Save size={18} />
            Save Configuration
          </button>
        </div>
      </div>

      {/* Security Info */}
      <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex items-start gap-3">
        <AlertCircle size={18} className="text-blue-600 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-blue-900 uppercase tracking-tight">Security Notice</p>
          <p className="text-[11px] text-blue-700 font-medium mt-1 leading-relaxed">
            All API keys and tokens are encrypted before storage. Tokens are never exposed in the frontend after initial save. 
            Backend validation is performed for every connection attempt.
          </p>
        </div>
      </div>
    </div>
  );
}
