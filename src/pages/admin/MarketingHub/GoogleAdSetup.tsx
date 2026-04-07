import React, { useState } from 'react';
import { 
  Search, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Shield, 
  ExternalLink,
  RefreshCw,
  BarChart3,
  Globe,
  Tag
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export default function GoogleAdSetup() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'not-connected' | 'error'>('not-connected');

  const [formData, setFormData] = useState({
    customerId: '',
    conversionId: '',
    conversionLabel: '',
    measurementId: '',
    gtmId: '',
    merchantCenterId: ''
  });

  const handleTest = async () => {
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
          <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
            <Search size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Google Ad Setup</h1>
            <p className="text-sm text-gray-500 font-medium">Configure Google Ads, GA4, and GTM</p>
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
          onClick={handleTest}
          className="px-4 py-2 bg-white border border-current rounded-xl text-xs font-bold hover:bg-opacity-50 transition-all"
        >
          Test Conversion
        </button>
      </div>

      {/* Config Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Google Ads */}
        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-50 space-y-6">
          <div className="flex items-center gap-2 text-orange-600">
            <Tag size={18} />
            <h2 className="text-sm font-bold uppercase tracking-wider">Google Ads</h2>
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Customer ID</label>
              <input 
                type="text"
                placeholder="xxx-xxx-xxxx"
                className="w-full h-11 px-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold outline-none focus:border-orange-500 transition-all"
                value={formData.customerId}
                onChange={(e) => setFormData({...formData, customerId: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Conversion ID</label>
              <input 
                type="text"
                className="w-full h-11 px-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold outline-none focus:border-orange-500 transition-all"
                value={formData.conversionId}
                onChange={(e) => setFormData({...formData, conversionId: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Conversion Label</label>
              <input 
                type="text"
                className="w-full h-11 px-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold outline-none focus:border-orange-500 transition-all"
                value={formData.conversionLabel}
                onChange={(e) => setFormData({...formData, conversionLabel: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Analytics & GTM */}
        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-50 space-y-6">
          <div className="flex items-center gap-2 text-blue-600">
            <BarChart3 size={18} />
            <h2 className="text-sm font-bold uppercase tracking-wider">Analytics & GTM</h2>
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">GA4 Measurement ID</label>
              <input 
                type="text"
                placeholder="G-XXXXXXXXXX"
                className="w-full h-11 px-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold outline-none focus:border-blue-500 transition-all"
                value={formData.measurementId}
                onChange={(e) => setFormData({...formData, measurementId: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Google Tag Manager ID</label>
              <input 
                type="text"
                placeholder="GTM-XXXXXXX"
                className="w-full h-11 px-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold outline-none focus:border-blue-500 transition-all"
                value={formData.gtmId}
                onChange={(e) => setFormData({...formData, gtmId: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Merchant Center ID</label>
              <input 
                type="text"
                className="w-full h-11 px-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold outline-none focus:border-blue-500 transition-all"
                value={formData.merchantCenterId}
                onChange={(e) => setFormData({...formData, merchantCenterId: e.target.value})}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl text-sm font-bold shadow-lg shadow-orange-200 hover:scale-[1.02] active:scale-[0.98] transition-all">
          <Save size={20} />
          Save Configuration
        </button>
      </div>
    </div>
  );
}
