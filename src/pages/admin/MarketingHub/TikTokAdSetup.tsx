import React, { useState } from 'react';
import { 
  Music2, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Shield, 
  ExternalLink,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export default function TikTokAdSetup() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'not-connected' | 'error'>('not-connected');

  const [formData, setFormData] = useState({
    businessAccountId: '',
    adAccountId: '',
    pixelId: '',
    accessToken: ''
  });

  const handleTestPixel = async () => {
    setIsValidating(true);
    setTimeout(() => {
      setIsValidating(false);
      setConnectionStatus('connected');
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white">
            <Music2 size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">TikTok Ad Setup</h1>
            <p className="text-sm text-gray-500 font-medium">Configure TikTok Business integration</p>
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

      {/* Status */}
      <div className={cn(
        "p-4 rounded-2xl border flex items-center gap-4 transition-all",
        connectionStatus === 'connected' ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-gray-50 border-gray-100 text-gray-500"
      )}>
        <RefreshCw size={20} className={isValidating ? "animate-spin" : ""} />
        <div className="flex-1">
          <p className="text-sm font-bold uppercase tracking-tight">Status: {connectionStatus === 'connected' ? 'Connected' : 'Not Tested'}</p>
        </div>
        <button 
          onClick={handleTestPixel}
          className="px-4 py-2 bg-white border border-current rounded-xl text-xs font-bold hover:bg-opacity-50 transition-all"
        >
          Test Pixel
        </button>
      </div>

      {/* Main Config Card */}
      <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center gap-2">
          <Shield size={18} className="text-gray-900" />
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">TikTok Business API</h2>
        </div>
        
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Business Account ID</label>
              <input 
                type="text"
                className="w-full h-12 px-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:bg-white focus:border-black transition-all outline-none"
                value={formData.businessAccountId}
                onChange={(e) => setFormData({...formData, businessAccountId: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Ad Account ID</label>
              <input 
                type="text"
                className="w-full h-12 px-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:bg-white focus:border-black transition-all outline-none"
                value={formData.adAccountId}
                onChange={(e) => setFormData({...formData, adAccountId: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">TikTok Pixel ID</label>
              <input 
                type="text"
                className="w-full h-12 px-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:bg-white focus:border-black transition-all outline-none"
                value={formData.pixelId}
                onChange={(e) => setFormData({...formData, pixelId: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Access Token</label>
            <div className="relative">
              <textarea 
                rows={3}
                placeholder="Enter TikTok API Access Token"
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-mono focus:bg-white focus:border-black transition-all outline-none resize-none"
                value={formData.accessToken}
                onChange={(e) => setFormData({...formData, accessToken: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-400">
            <Shield size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Encrypted Storage</span>
          </div>
          <button className="flex items-center gap-2 px-8 py-3 bg-black text-white rounded-xl text-sm font-bold shadow-lg shadow-gray-200 hover:scale-[1.02] active:scale-[0.98] transition-all">
            <Save size={18} />
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
