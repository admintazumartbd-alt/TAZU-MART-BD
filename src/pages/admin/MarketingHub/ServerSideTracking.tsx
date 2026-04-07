import React, { useState } from 'react';
import { 
  Server, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Shield, 
  ExternalLink,
  RefreshCw,
  Eye,
  EyeOff,
  Activity,
  Terminal,
  Zap,
  ToggleLeft,
  ToggleRight,
  Database
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export default function ServerSideTracking() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [showTokens, setShowTokens] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [successRate, setSuccessRate] = useState(98.5);

  const [formData, setFormData] = useState({
    facebookApiToken: '',
    googleServerKey: '',
    tiktokApiToken: ''
  });

  const handleValidate = async () => {
    setIsValidating(true);
    setTimeout(() => setIsValidating(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
            <Server size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Server-Side Tracking</h1>
            <p className="text-sm text-gray-500 font-medium">Improve tracking accuracy and bypass ad blockers via API</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
          <span className={cn(
            "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg",
            isEnabled ? "bg-emerald-50 text-emerald-600" : "bg-gray-50 text-gray-400"
          )}>
            {isEnabled ? 'API Active' : 'API Disabled'}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* API Tokens */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[24px] shadow-sm border border-gray-50 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-emerald-600" />
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">API Tokens</h2>
              </div>
              <button 
                onClick={() => setShowTokens(!showTokens)}
                className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest hover:underline flex items-center gap-1"
              >
                {showTokens ? <EyeOff size={12} /> : <Eye size={12} />}
                {showTokens ? 'Hide Tokens' : 'Show Tokens'}
              </button>
            </div>
            <div className="p-8 space-y-8">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Facebook Conversion API Key</label>
                <textarea 
                  rows={2}
                  type={showTokens ? "text" : "password"}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl text-xs font-mono focus:bg-white focus:border-emerald-500 transition-all outline-none resize-none"
                  value={formData.facebookApiToken}
                  onChange={(e) => setFormData({...formData, facebookApiToken: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Google Server Conversion Key</label>
                <textarea 
                  rows={2}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl text-xs font-mono focus:bg-white focus:border-emerald-500 transition-all outline-none resize-none"
                  value={formData.googleServerKey}
                  onChange={(e) => setFormData({...formData, googleServerKey: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">TikTok Events API Token</label>
                <textarea 
                  rows={2}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl text-xs font-mono focus:bg-white focus:border-emerald-500 transition-all outline-none resize-none"
                  value={formData.tiktokApiToken}
                  onChange={(e) => setFormData({...formData, tiktokApiToken: e.target.value})}
                />
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button 
                onClick={handleValidate}
                disabled={isValidating}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-emerald-200 text-emerald-600 rounded-xl text-xs font-bold hover:bg-emerald-50 transition-all disabled:opacity-50"
              >
                {isValidating ? <RefreshCw size={16} className="animate-spin" /> : <Shield size={16} />}
                API Validation
              </button>
            </div>
          </div>

          {/* Events to Send */}
          <div className="bg-white rounded-[24px] shadow-sm border border-gray-50 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center gap-2">
              <Database size={18} className="text-emerald-600" />
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Events to Send</h2>
            </div>
            <div className="p-6 space-y-4">
              {['Purchase', 'AddToCart', 'InitiateCheckout'].map((event) => (
                <div key={event} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-emerald-600 shadow-sm">
                      <Zap size={16} />
                    </div>
                    <span className="text-sm font-bold text-gray-700">{event}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Include: Order ID, Value, Currency</span>
                    <button className="text-emerald-600"><ToggleRight size={28} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Server Log & Stats */}
        <div className="space-y-6">
          <div className="bg-emerald-600 p-6 rounded-[24px] text-white shadow-lg shadow-emerald-200">
            <div className="flex items-center justify-between mb-4">
              <Activity size={24} />
              <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-500 px-2 py-1 rounded-lg">Live Stats</span>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-black">{successRate}%</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-100">Success Rate Indicator</p>
            </div>
            <div className="mt-6 pt-6 border-t border-emerald-500/50 flex items-center justify-between">
              <div className="text-center">
                <p className="text-lg font-bold">1,240</p>
                <p className="text-[9px] font-bold uppercase tracking-tighter text-emerald-100">Events Sent</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">12</p>
                <p className="text-[9px] font-bold uppercase tracking-tighter text-emerald-100 text-rose-200">Failed</p>
              </div>
              <button className="px-3 py-1.5 bg-emerald-500 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-emerald-400 transition-all">
                Retry Failed
              </button>
            </div>
          </div>

          <div className="bg-gray-900 rounded-[24px] shadow-xl overflow-hidden h-[400px] flex flex-col border border-gray-800">
            <div className="p-4 border-b border-gray-800 flex items-center gap-2 bg-gray-900/50 backdrop-blur-xl">
              <Terminal size={16} className="text-emerald-400" />
              <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Server Event Logging</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-[10px] no-scrollbar">
              <div className="text-gray-500">[04:54:50] <span className="text-emerald-400">SENT</span> FB_API: Purchase - ৳1200</div>
              <div className="text-gray-500">[04:54:55] <span className="text-emerald-400">SENT</span> GOOGLE_API: AddToCart</div>
              <div className="text-gray-500">[04:55:00] <span className="text-emerald-400">SENT</span> TIKTOK_API: Purchase - ৳1200</div>
              <div className="text-rose-400">[04:55:05] <span className="text-rose-500">FAILED</span> FB_API: Connection Timeout</div>
              <div className="text-gray-400 animate-pulse">Waiting for server events...</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Save */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-2xl shadow-emerald-300 hover:scale-[1.05] active:scale-[0.95] transition-all">
          <Save size={20} />
          Save Server Config
        </button>
      </div>
    </div>
  );
}
