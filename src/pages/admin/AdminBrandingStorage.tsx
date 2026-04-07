import React, { useState, useEffect } from 'react';
import { 
  Globe2, 
  Server, 
  ShieldCheck, 
  Zap, 
  Database, 
  Palette, 
  HardDrive, 
  RefreshCw, 
  Lock, 
  Activity, 
  Terminal, 
  Clock, 
  Settings2, 
  CloudUpload, 
  Trash2, 
  Wand2,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Search,
  Plus,
  Save,
  Loader2,
  ExternalLink,
  Cpu,
  Smartphone,
  Layout,
  Type,
  MousePointer2,
  Image as ImageIcon,
  FileText,
  History,
  ShieldAlert,
  ArrowUpRight,
  Gauge
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';
import { cn } from '@/src/lib/utils';
import { InfrastructureSettings, BrandingSettings, StorageSettings, Domain, Hosting, Upgrade } from '@/src/types';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const usageData = [
  { time: '00:00', cpu: 12, ram: 45, disk: 30 },
  { time: '04:00', cpu: 18, ram: 48, disk: 30 },
  { time: '08:00', cpu: 35, ram: 55, disk: 31 },
  { time: '12:00', cpu: 45, ram: 62, disk: 32 },
  { time: '16:00', cpu: 28, ram: 58, disk: 32 },
  { time: '20:00', cpu: 15, ram: 50, disk: 33 },
  { time: '23:59', cpu: 10, ram: 46, disk: 33 },
];

type TabType = 'infrastructure' | 'server' | 'branding' | 'storage' | 'backups';

export default function AdminBrandingStorage() {
  const [activeTab, setActiveTab] = useState<TabType>('infrastructure');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<{
    infrastructure: InfrastructureSettings;
    branding: BrandingSettings;
    storage: StorageSettings;
  } | null>(null);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [hosting, setHosting] = useState<Hosting[]>([]);

  useEffect(() => {
    fetchSettings();
    fetchDomains();
    fetchHosting();
    initFreeHosting();
  }, []);

  const initFreeHosting = async () => {
    try {
      await axios.post('/api/admin/hosting/init-free');
      fetchHosting();
    } catch (error) {
      console.error("Failed to init free hosting:", error);
    }
  };

  const fetchDomains = async () => {
    try {
      const response = await axios.get('/api/admin/domains');
      setDomains(response.data);
    } catch (error) {
      console.error("Failed to fetch domains:", error);
    }
  };

  const fetchHosting = async () => {
    try {
      const response = await axios.get('/api/admin/hosting');
      setHosting(response.data);
    } catch (error) {
      console.error("Failed to fetch hosting:", error);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await axios.get('/api/admin/branding-storage');
      setSettings(response.data);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    setIsSaving(true);
    try {
      await axios.post('/api/admin/branding-storage', settings);
      // Show success toast or notification
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !settings) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#3F51B5]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Branding & Storage</h1>
          <p className="text-sm text-gray-500 font-medium">Premium Infrastructure & Domain Management System</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#3F51B5] text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-[#303F9F] transition-all disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={18} />}
          Save Changes
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-gray-100 shadow-sm overflow-x-auto no-scrollbar">
        {[
          { id: 'infrastructure', label: 'Infrastructure', icon: Globe2 },
          { id: 'branding', label: 'Branding', icon: Palette },
          { id: 'storage', label: 'Storage & Performance', icon: HardDrive },
          { id: 'backups', label: 'Backups & Maintenance', icon: Database },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
              activeTab === tab.id 
                ? "bg-[#3F51B5] text-white shadow-md" 
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'infrastructure' && (
            <InfrastructureTab 
              data={settings.infrastructure} 
              domains={domains}
              hosting={hosting}
              onRefreshDomains={fetchDomains}
              onRefreshHosting={fetchHosting}
              onChange={(val) => setSettings({ ...settings, infrastructure: val })} 
            />
          )}
          {activeTab === 'branding' && (
            <BrandingTab 
              data={settings.branding} 
              onChange={(val) => setSettings({ ...settings, branding: val })} 
            />
          )}
          {activeTab === 'storage' && (
            <StorageTab 
              data={settings.storage} 
              onChange={(val) => setSettings({ ...settings, storage: val })} 
            />
          )}
          {activeTab === 'backups' && (
            <BackupsTab 
              data={settings.infrastructure} 
              onChange={(val) => setSettings({ ...settings, infrastructure: val })} 
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function InfrastructureTab({ data, domains, hosting, onRefreshDomains, onRefreshHosting, onChange }: { 
  data: InfrastructureSettings, 
  domains: Domain[],
  hosting: Hosting[],
  onRefreshDomains: () => void,
  onRefreshHosting: () => void,
  onChange: (val: InfrastructureSettings) => void 
}) {
  const [newDomain, setNewDomain] = useState<Partial<Domain>>({
    dnsType: 'A',
    status: 'PENDING',
    forceHttps: true,
    txtRecord: '',
    mxRecord: ''
  });
  const [newHosting, setNewHosting] = useState<Partial<Hosting>>({
    isCustom: false,
    sslStatus: true,
    status: 'ACTIVE',
    port: '21'
  });
  const [isAddingDomain, setIsAddingDomain] = useState(false);
  const [isAddingHosting, setIsAddingHosting] = useState(false);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [isUpgrading, setIsUpgrading] = useState(false);

  const currentHosting = hosting[0]; // Assume single hosting for now
  const isPaid = currentHosting?.hostingType === 'PAID';

  useEffect(() => {
    if (currentHosting) {
      setNewHosting({
        ...currentHosting,
        isCustom: currentHosting.isCustom ?? false
      });
    }
  }, [currentHosting]);

  const handleAddDomain = async () => {
    if (!newDomain.domainName) return;
    setIsAddingDomain(true);
    try {
      await axios.post('/api/admin/domains', newDomain);
      setNewDomain({ dnsType: 'A', status: 'PENDING', forceHttps: true });
      onRefreshDomains();
    } catch (error) {
      console.error("Failed to add domain:", error);
    } finally {
      setIsAddingDomain(false);
    }
  };

  const handleAddHosting = async () => {
    if (newHosting.isCustom && (!newHosting.providerName || !newHosting.serverIp)) return;
    setIsAddingHosting(true);
    try {
      await axios.post('/api/admin/hosting', newHosting);
      setNewHosting({ isCustom: false, sslStatus: true, status: 'ACTIVE', port: '21' });
      onRefreshHosting();
    } catch (error) {
      console.error("Failed to add hosting:", error);
    } finally {
      setIsAddingHosting(false);
    }
  };

  const handleVerify = async (id: string) => {
    setVerifyingId(id);
    try {
      const res = await axios.post(`/api/admin/domains/${id}/verify`);
      if (res.data.success) {
        onRefreshDomains();
      } else {
        alert("DNS Verification failed. Please check your settings.");
      }
    } catch (error) {
      console.error("Failed to verify domain:", error);
    } finally {
      setVerifyingId(null);
    }
  };

  const handleUpgrade = async (plan: 'BASIC' | 'PRO') => {
    setIsUpgrading(true);
    try {
      await axios.post('/api/admin/hosting/upgrade', { plan });
      onRefreshHosting();
      alert(`Successfully upgraded to ${plan} plan!`);
    } catch (error) {
      console.error("Failed to upgrade:", error);
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Plan Overview & Upgrade */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-[#3F51B5] to-[#6366F1] text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                <Zap size={28} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-black uppercase tracking-tight">Current Plan: {currentHosting?.planName || 'FREE'}</h3>
                  <span className={cn(
                    "px-2 py-0.5 text-[10px] font-black uppercase rounded-full backdrop-blur-md",
                    isPaid ? "bg-green-400/20 text-green-100" : "bg-amber-400/20 text-amber-100"
                  )}>
                    {currentHosting?.status || 'ACTIVE'}
                  </span>
                </div>
                <p className="text-sm text-indigo-100 font-medium">
                  {isPaid ? `Premium features enabled. Expires in 30 days.` : `Using default free infrastructure. Upgrade for custom domains.`}
                </p>
              </div>
            </div>
            {!isPaid && (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleUpgrade('BASIC')}
                  disabled={isUpgrading}
                  className="px-6 py-2.5 bg-white text-[#3F51B5] rounded-xl font-bold text-sm shadow-lg hover:bg-indigo-50 transition-all disabled:opacity-50"
                >
                  Upgrade to Basic
                </button>
                <button 
                  onClick={() => handleUpgrade('PRO')}
                  disabled={isUpgrading}
                  className="px-6 py-2.5 bg-indigo-950 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-black transition-all disabled:opacity-50"
                >
                  Upgrade to Pro
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-50">
          <div className="p-6">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Storage</p>
            <div className="flex items-end gap-2">
              <h4 className="text-xl font-black text-gray-900">{currentHosting?.storageLimit || 500}MB</h4>
              <p className="text-xs text-gray-400 font-medium mb-1">/ {isPaid ? 'Unlimited' : '500MB'}</p>
            </div>
            <div className="mt-3 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#3F51B5] rounded-full" style={{ width: '20%' }} />
            </div>
          </div>
          <div className="p-6">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Bandwidth</p>
            <div className="flex items-center gap-2">
              <h4 className="text-xl font-black text-gray-900">{currentHosting?.bandwidthLimit || 'LIMITED'}</h4>
              <Zap size={14} className="text-amber-500" />
            </div>
            <p className="text-[10px] text-gray-400 font-bold mt-2">Resetting in 12 days</p>
          </div>
          <div className="p-6">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Website URL</p>
            <div className="flex items-center gap-2">
              <Globe2 size={14} className="text-[#3F51B5]" />
              <h4 className="text-sm font-bold text-gray-900 truncate">
                {currentHosting?.subdomain || 'site.platform.com'}
              </h4>
            </div>
            <a href={`https://${currentHosting?.subdomain}`} target="_blank" className="text-[10px] text-[#3F51B5] font-black uppercase tracking-widest mt-2 flex items-center gap-1 hover:underline">
              Visit Site <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Domain Configuration */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-[#3F51B5]">
                <Globe2 size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">Domain Configuration</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Connect your custom domain</p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              {domains.map((domain) => (
                <div key={domain.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-indigo-100 transition-all">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm",
                      domain.status === 'CONNECTED' ? "text-green-500" : "text-amber-500"
                    )}>
                      {domain.status === 'CONNECTED' ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{domain.domainName}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        {domain.dnsType} Record • {domain.status}
                      </p>
                      {domain.txtRecord && (
                        <p className="text-[9px] text-gray-400 font-mono mt-1">TXT: {domain.txtRecord.substring(0, 20)}...</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {domain.status === 'PENDING' && (
                      <button 
                        onClick={() => handleVerify(domain.id)}
                        disabled={verifyingId === domain.id}
                        className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-[10px] font-black uppercase hover:bg-gray-50 transition-all flex items-center gap-1.5"
                      >
                        {verifyingId === domain.id ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                        Verify DNS
                      </button>
                    )}
                    {domain.status === 'CONNECTED' && (
                      <span className="px-2 py-1 bg-green-100 text-green-600 text-[10px] font-black uppercase rounded-md">Connected</span>
                    )}
                  </div>
                </div>
              ))}
              {domains.length === 0 && (
                <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <Globe2 size={24} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">No custom domains added</p>
                </div>
              )}
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-50">
              <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Add New Domain</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">Domain Name *</label>
                  <input 
                    type="text" 
                    placeholder="example.com"
                    value={newDomain.domainName || ''}
                    onChange={(e) => setNewDomain({ ...newDomain, domainName: e.target.value })}
                    className="w-full h-11 px-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium outline-none focus:border-[#3F51B5] focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">Subdomain</label>
                  <input 
                    type="text" 
                    placeholder="www"
                    value={newDomain.subdomain || ''}
                    onChange={(e) => setNewDomain({ ...newDomain, subdomain: e.target.value })}
                    className="w-full h-11 px-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium outline-none focus:border-[#3F51B5] focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">DNS Type</label>
                  <select 
                    value={newDomain.dnsType}
                    onChange={(e) => setNewDomain({ ...newDomain, dnsType: e.target.value as any })}
                    className="w-full h-11 px-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold outline-none focus:border-[#3F51B5] focus:bg-white transition-all"
                  >
                    <option value="A">A Record</option>
                    <option value="CNAME">CNAME</option>
                    <option value="NS">Nameserver</option>
                  </select>
                </div>

                {newDomain.dnsType === 'A' && (
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">A Record IP</label>
                    <input 
                      type="text" 
                      placeholder="1.2.3.4"
                      value={newDomain.aRecordIp || ''}
                      onChange={(e) => setNewDomain({ ...newDomain, aRecordIp: e.target.value })}
                      className="w-full h-11 px-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium outline-none focus:border-[#3F51B5] focus:bg-white transition-all"
                    />
                  </div>
                )}

                {newDomain.dnsType === 'CNAME' && (
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">CNAME Target</label>
                    <input 
                      type="text" 
                      placeholder="ghs.google.com"
                      value={newDomain.cname || ''}
                      onChange={(e) => setNewDomain({ ...newDomain, cname: e.target.value })}
                      className="w-full h-11 px-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium outline-none focus:border-[#3F51B5] focus:bg-white transition-all"
                    />
                  </div>
                )}

                {newDomain.dnsType === 'NS' && (
                  <>
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">Nameserver 1</label>
                      <input 
                        type="text" 
                        placeholder="ns1.hostinger.com"
                        value={newDomain.nameserver1 || ''}
                        onChange={(e) => setNewDomain({ ...newDomain, nameserver1: e.target.value })}
                        className="w-full h-11 px-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium outline-none focus:border-[#3F51B5] focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">Nameserver 2</label>
                      <input 
                        type="text" 
                        placeholder="ns2.hostinger.com"
                        value={newDomain.nameserver2 || ''}
                        onChange={(e) => setNewDomain({ ...newDomain, nameserver2: e.target.value })}
                        className="w-full h-11 px-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium outline-none focus:border-[#3F51B5] focus:bg-white transition-all"
                      />
                    </div>
                  </>
                )}

                <div className="col-span-2 grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">TXT Record (Verification)</label>
                    <input 
                      type="text" 
                      placeholder="v=spf1 include:_spf.google.com ~all"
                      value={newDomain.txtRecord || ''}
                      onChange={(e) => setNewDomain({ ...newDomain, txtRecord: e.target.value })}
                      className="w-full h-11 px-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium outline-none focus:border-[#3F51B5] focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">MX Record (Email Support)</label>
                    <input 
                      type="text" 
                      placeholder="aspmx.l.google.com"
                      value={newDomain.mxRecord || ''}
                      onChange={(e) => setNewDomain({ ...newDomain, mxRecord: e.target.value })}
                      className="w-full h-11 px-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium outline-none focus:border-[#3F51B5] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="col-span-2 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck size={14} className="text-[#3F51B5]" />
                    <p className="text-[10px] font-black text-[#3F51B5] uppercase tracking-widest">DNS Guide</p>
                  </div>
                  <p className="text-xs text-indigo-700 font-medium">
                    Point your domain to this IP: <span className="font-black">{currentHosting?.serverIp || '1.2.3.4'}</span>
                  </p>
                </div>

                <div className="col-span-2 grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">Redirect To</label>
                    <input 
                      type="text" 
                      placeholder="www.example.com"
                      value={newDomain.redirectDomain || ''}
                      onChange={(e) => setNewDomain({ ...newDomain, redirectDomain: e.target.value })}
                      className="w-full h-11 px-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium outline-none focus:border-[#3F51B5] focus:bg-white transition-all"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">Force HTTPS</label>
                    <button 
                      onClick={() => setNewDomain({ ...newDomain, forceHttps: !newDomain.forceHttps })}
                      className={cn(
                        "w-12 h-6 rounded-full transition-all relative",
                        newDomain.forceHttps ? "bg-green-500" : "bg-gray-200"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                        newDomain.forceHttps ? "right-1" : "left-1"
                      )} />
                    </button>
                  </div>
                </div>

                <div className="col-span-2">
                  <button 
                    onClick={handleAddDomain}
                    disabled={isAddingDomain || !newDomain.domainName}
                    className="w-full h-11 bg-[#3F51B5] text-white rounded-xl font-bold text-sm hover:bg-[#303F9F] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
                  >
                    {isAddingDomain ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                    Connect Domain
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hosting Configuration (Hybrid System) */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                <Server size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">Hosting Configuration</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  Current Hosting: <span className={newHosting.isCustom ? "text-purple-600" : "text-green-600"}>{newHosting.isCustom ? 'CUSTOM' : 'FREE'}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Custom Hosting</span>
              <button 
                onClick={() => setNewHosting({ ...newHosting, isCustom: !newHosting.isCustom })}
                className={cn(
                  "w-12 h-6 rounded-full transition-all relative",
                  newHosting.isCustom ? "bg-purple-600" : "bg-gray-200"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                  newHosting.isCustom ? "right-1" : "left-1"
                )} />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-6">
              {!newHosting.isCustom ? (
                <div className="p-6 bg-green-50 rounded-2xl border border-green-100 text-center">
                  <CheckCircle2 size={32} className="mx-auto text-green-500 mb-3" />
                  <h4 className="text-sm font-black text-green-900 uppercase tracking-tight mb-1">Free Hosting Active</h4>
                  <p className="text-xs text-green-700 font-medium mb-4">Your website is running on our high-speed platform infrastructure.</p>
                  <div className="grid grid-cols-2 gap-4 text-left">
                    <div className="bg-white/50 p-3 rounded-xl">
                      <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest mb-1">Server IP</p>
                      <p className="text-xs font-black text-green-900">1.2.3.4 (Auto)</p>
                    </div>
                    <div className="bg-white/50 p-3 rounded-xl">
                      <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest mb-1">Status</p>
                      <p className="text-xs font-black text-green-900">Operational</p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">Provider Name</label>
                      <input 
                        type="text" 
                        placeholder="Hostinger"
                        value={newHosting.providerName || ''}
                        onChange={(e) => setNewHosting({ ...newHosting, providerName: e.target.value })}
                        className="w-full h-11 px-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium outline-none focus:border-[#3F51B5] focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">Server IP</label>
                      <input 
                        type="text" 
                        placeholder="1.2.3.4"
                        value={newHosting.serverIp || ''}
                        onChange={(e) => setNewHosting({ ...newHosting, serverIp: e.target.value })}
                        className="w-full h-11 px-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium outline-none focus:border-[#3F51B5] focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">Port</label>
                      <input 
                        type="text" 
                        placeholder="21"
                        value={newHosting.port || ''}
                        onChange={(e) => setNewHosting({ ...newHosting, port: e.target.value })}
                        className="w-full h-11 px-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium outline-none focus:border-[#3F51B5] focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 block">Root Directory</label>
                      <input 
                        type="text" 
                        placeholder="/public_html"
                        value={newHosting.rootDirectory || ''}
                        onChange={(e) => setNewHosting({ ...newHosting, rootDirectory: e.target.value })}
                        className="w-full h-11 px-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium outline-none focus:border-[#3F51B5] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                    <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">FTP & Database Info</h5>
                    <div className="grid grid-cols-2 gap-3">
                      <input 
                        type="text" 
                        placeholder="FTP Username"
                        value={newHosting.cpanelUser || ''}
                        onChange={(e) => setNewHosting({ ...newHosting, cpanelUser: e.target.value })}
                        className="w-full h-10 px-3 bg-white border border-gray-100 rounded-lg text-xs font-medium outline-none focus:border-[#3F51B5] transition-all"
                      />
                      <input 
                        type="password" 
                        placeholder="FTP Password"
                        value={newHosting.cpanelPass || ''}
                        onChange={(e) => setNewHosting({ ...newHosting, cpanelPass: e.target.value })}
                        className="w-full h-10 px-3 bg-white border border-gray-100 rounded-lg text-xs font-medium outline-none focus:border-[#3F51B5] transition-all"
                      />
                      <input 
                        type="text" 
                        placeholder="DB Name"
                        value={newHosting.dbName || ''}
                        onChange={(e) => setNewHosting({ ...newHosting, dbName: e.target.value })}
                        className="w-full h-10 px-3 bg-white border border-gray-100 rounded-lg text-xs font-medium outline-none focus:border-[#3F51B5] transition-all"
                      />
                      <input 
                        type="text" 
                        placeholder="DB User"
                        value={newHosting.dbUser || ''}
                        onChange={(e) => setNewHosting({ ...newHosting, dbUser: e.target.value })}
                        className="w-full h-10 px-3 bg-white border border-gray-100 rounded-lg text-xs font-medium outline-none focus:border-[#3F51B5] transition-all"
                      />
                    </div>
                  </div>
                </>
              )}

              <button 
                onClick={handleAddHosting}
                disabled={isAddingHosting || (newHosting.isCustom && !newHosting.providerName)}
                className="w-full h-11 bg-purple-600 text-white rounded-xl font-bold text-sm hover:bg-purple-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-purple-100"
              >
                {isAddingHosting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {newHosting.isCustom ? 'Save Custom Hosting' : 'Update Free Settings'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DNS Management Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Terminal size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">DNS Management</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Active DNS records and routing</p>
            </div>
          </div>
        </div>
        <div className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</th>
                  <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Name</th>
                  <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Value</th>
                  <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {domains.map((domain) => (
                  <tr key={domain.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-black rounded-md">{domain.dnsType}</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-700">{domain.domainName}</td>
                    <td className="px-6 py-4 text-xs font-medium text-gray-500 font-mono truncate max-w-[200px]">
                      {domain.dnsType === 'A' ? domain.aRecordIp : domain.dnsType === 'CNAME' ? domain.cname : `${domain.nameserver1}, ${domain.nameserver2}`}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          domain.status === 'CONNECTED' ? "bg-green-500" : "bg-amber-500"
                        )} />
                        <span className="text-[10px] font-bold text-gray-500 uppercase">{domain.status}</span>
                      </div>
                    </td>
                  </tr>
                ))}
                {domains.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Activity size={32} className="text-gray-200" />
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">No active DNS records found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}


function BrandingTab({ data, onChange }: { data: BrandingSettings, onChange: (val: BrandingSettings) => void }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Branding Controls */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-[#3F51B5]">
                <Palette size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">Store Branding</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Customize your store identity</p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-8">
            {/* Logo & Favicon */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Store Logo</label>
                <div className="relative group">
                  <div className="h-32 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 group-hover:border-[#3F51B5] transition-all">
                    <img src={data.logo} alt="Logo" className="max-h-12 object-contain mb-2" />
                    <button className="px-4 py-1.5 bg-white text-gray-600 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm border border-gray-100 hover:bg-gray-50 transition-all">
                      Change Logo
                    </button>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Favicon</label>
                <div className="relative group">
                  <div className="h-32 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 group-hover:border-[#3F51B5] transition-all">
                    <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center border border-gray-100">
                      <img src={data.favicon} alt="Favicon" className="w-6 h-6 object-contain" />
                    </div>
                    <button className="px-4 py-1.5 bg-white text-gray-600 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm border border-gray-100 hover:bg-gray-50 transition-all">
                      Change Favicon
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Primary Color</label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="w-10 h-10 rounded-xl shadow-inner border border-white" style={{ backgroundColor: data.primaryColor }} />
                  <input 
                    type="text" 
                    value={data.primaryColor} 
                    onChange={(e) => onChange({ ...data, primaryColor: e.target.value })}
                    className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-gray-700 uppercase"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Accent Color</label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="w-10 h-10 rounded-xl shadow-inner border border-white" style={{ backgroundColor: data.accentColor }} />
                  <input 
                    type="text" 
                    value={data.accentColor} 
                    onChange={(e) => onChange({ ...data, accentColor: e.target.value })}
                    className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-gray-700 uppercase"
                  />
                </div>
              </div>
            </div>

            {/* Typography & Style */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Font Family</label>
                <select 
                  value={data.fontFamily}
                  onChange={(e) => onChange({ ...data, fontFamily: e.target.value })}
                  className="w-full h-12 px-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:border-[#3F51B5] focus:bg-white transition-all appearance-none"
                >
                  <option value="Inter">Inter (Modern)</option>
                  <option value="Outfit">Outfit (Tech)</option>
                  <option value="Space Grotesk">Space Grotesk (Futuristic)</option>
                  <option value="Playfair Display">Playfair Display (Elegant)</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Button Style</label>
                <div className="flex gap-2 p-1 bg-gray-50 rounded-2xl border border-gray-100">
                  {(['rounded', 'square', 'pill'] as const).map((style) => (
                    <button
                      key={style}
                      onClick={() => onChange({ ...data, buttonStyle: style })}
                      className={cn(
                        "flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                        data.buttonStyle === style ? "bg-white text-[#3F51B5] shadow-sm" : "text-gray-400 hover:text-gray-600"
                      )}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="space-y-6">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">Live Preview</h3>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <div className="w-2 h-2 rounded-full bg-green-400" />
            </div>
          </div>
          <div className="p-6 bg-gray-50/50 min-h-[400px] flex flex-col gap-6">
            {/* Header Preview */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
              <img src={data.logo} alt="Logo" className="h-6 object-contain" />
              <div className="flex gap-3">
                <div className="w-4 h-4 rounded-full bg-gray-100" />
                <div className="w-4 h-4 rounded-full bg-gray-100" />
              </div>
            </div>

            {/* Content Preview */}
            <div className="space-y-4">
              <div className="h-4 w-2/3 bg-gray-200 rounded-full" />
              <div className="h-3 w-full bg-gray-100 rounded-full" />
              <div className="h-3 w-5/6 bg-gray-100 rounded-full" />
              
              <div className="pt-4 flex gap-3">
                <button 
                  className={cn(
                    "px-6 py-2.5 text-white text-xs font-bold transition-all",
                    data.buttonStyle === 'rounded' ? 'rounded-xl' : data.buttonStyle === 'square' ? 'rounded-none' : 'rounded-full'
                  )}
                  style={{ backgroundColor: data.primaryColor }}
                >
                  Primary Button
                </button>
                <button 
                  className={cn(
                    "px-6 py-2.5 text-xs font-bold border transition-all",
                    data.buttonStyle === 'rounded' ? 'rounded-xl' : data.buttonStyle === 'square' ? 'rounded-none' : 'rounded-full'
                  )}
                  style={{ borderColor: data.accentColor, color: data.accentColor }}
                >
                  Secondary
                </button>
              </div>
            </div>

            {/* Card Preview */}
            <div className="mt-4 bg-white p-4 rounded-3xl shadow-sm border border-gray-100 space-y-3">
              <div className="aspect-square bg-gray-50 rounded-2xl" />
              <div className="h-4 w-1/2 bg-gray-200 rounded-full" />
              <div className="flex justify-between items-center">
                <div className="h-4 w-1/4 bg-[#3F51B5]/10 rounded-full" />
                <div className="w-8 h-8 rounded-full bg-[#3F51B5]/5 flex items-center justify-center">
                  <Plus size={14} style={{ color: data.primaryColor }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StorageTab({ data, onChange }: { data: StorageSettings, onChange: (val: StorageSettings) => void }) {
  const percentage = (data.totalUsed / data.totalLimit) * 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Storage Overview */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-[#3F51B5]">
                <HardDrive size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">Storage Manager</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Manage your assets and server storage</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-xl font-bold text-xs hover:bg-gray-100 transition-all">
              <Trash2 size={16} /> Bulk Cleanup
            </button>
          </div>
          <div className="p-8 space-y-10">
            {/* Progress Bar */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Total Storage Used</p>
                  <h4 className="text-3xl font-black text-gray-900 tracking-tight">{data.totalUsed} <span className="text-lg text-gray-400">GB</span></h4>
                </div>
                <p className="text-sm font-bold text-gray-500">of {data.totalLimit} GB</p>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  className={cn(
                    "h-full rounded-full transition-all duration-1000",
                    percentage > 90 ? "bg-red-500" : percentage > 70 ? "bg-amber-500" : "bg-[#3F51B5]"
                  )}
                />
              </div>
              <div className="flex gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#3F51B5]" />
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Images (1.8 GB)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-400" />
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Database (0.4 GB)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-300" />
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Other (0.2 GB)</span>
                </div>
              </div>
            </div>

            {/* Asset Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Images', count: '1,240', icon: ImageIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Documents', count: '85', icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50' },
                { label: 'Backups', count: '12', icon: History, color: 'text-amber-600', bg: 'bg-amber-50' },
                { label: 'Logs', count: '450', icon: Terminal, color: 'text-gray-600', bg: 'bg-gray-50' },
              ].map((asset, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-indigo-100 transition-all cursor-pointer group">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform", asset.bg, asset.color)}>
                    <asset.icon size={20} />
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">{asset.label}</p>
                  <p className="text-sm font-black text-gray-900">{asset.count}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Layer */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                <Zap size={20} />
              </div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">Performance Layer</h3>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-amber-500 shadow-sm">
                    <Wand2 size={16} />
                  </div>
                  <span className="text-xs font-bold text-gray-700">Image Compression</span>
                </div>
                <button 
                  onClick={() => onChange({ ...data, imageCompression: !data.imageCompression })}
                  className={cn(
                    "w-10 h-5 rounded-full relative transition-all",
                    data.imageCompression ? "bg-amber-500" : "bg-gray-200"
                  )}
                >
                  <div className={cn("absolute top-1 w-3 h-3 bg-white rounded-full transition-all", data.imageCompression ? "left-6" : "left-1")} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-blue-500 shadow-sm">
                    <MousePointer2 size={16} />
                  </div>
                  <span className="text-xs font-bold text-gray-700">Lazy Load Images</span>
                </div>
                <button 
                  onClick={() => onChange({ ...data, lazyLoad: !data.lazyLoad })}
                  className={cn(
                    "w-10 h-5 rounded-full relative transition-all",
                    data.lazyLoad ? "bg-blue-500" : "bg-gray-200"
                  )}
                >
                  <div className={cn("absolute top-1 w-3 h-3 bg-white rounded-full transition-all", data.lazyLoad ? "left-6" : "left-1")} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-purple-500 shadow-sm">
                    <Terminal size={16} />
                  </div>
                  <span className="text-xs font-bold text-gray-700">Minify Assets</span>
                </div>
                <button 
                  onClick={() => onChange({ ...data, minifyAssets: !data.minifyAssets })}
                  className={cn(
                    "w-10 h-5 rounded-full relative transition-all",
                    data.minifyAssets ? "bg-purple-500" : "bg-gray-200"
                  )}
                >
                  <div className={cn("absolute top-1 w-3 h-3 bg-white rounded-full transition-all", data.minifyAssets ? "left-6" : "left-1")} />
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-50">
              <button className="w-full py-3 bg-[#3F51B5] text-white rounded-xl font-bold text-xs shadow-lg shadow-indigo-100 hover:bg-[#303F9F] transition-all flex items-center justify-center gap-2">
                <RefreshCw size={16} /> Clear System Cache
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BackupsTab({ data, onChange }: { data: InfrastructureSettings, onChange: (val: InfrastructureSettings) => void }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Backup Center */}
      <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-[#3F51B5]">
              <Database size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">Backup & Migration</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Secure your data with automated backups</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#3F51B5] text-white rounded-xl font-bold text-xs hover:bg-[#303F9F] transition-all">
            <Plus size={16} /> Create Backup
          </button>
        </div>
        <div className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Backup Name</th>
                  <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</th>
                  <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Size</th>
                  <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[
                  { name: 'Full_Backup_2024_04_06', type: 'FULL', size: '245 MB', date: 'Today, 02:15 AM' },
                  { name: 'DB_Backup_2024_04_05', type: 'DATABASE', size: '42 MB', date: 'Yesterday, 03:00 AM' },
                  { name: 'Files_Backup_2024_04_04', type: 'FILES', size: '180 MB', date: '2 days ago' },
                ].map((backup, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-gray-400" />
                        <span className="text-sm font-bold text-gray-700">{backup.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-indigo-50 text-[#3F51B5] text-[10px] font-black rounded-md uppercase">{backup.type}</span>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-500">{backup.size}</td>
                    <td className="px-6 py-4 text-xs font-medium text-gray-400">{backup.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 text-gray-400 hover:text-[#3F51B5] transition-colors">
                          <CloudUpload size={16} />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Maintenance Mode */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
              <ShieldAlert size={20} />
            </div>
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">Maintenance Mode</h3>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div>
                <p className="text-xs font-bold text-gray-900">System Status</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{data.maintenance.enabled ? 'Maintenance Active' : 'Live & Operational'}</p>
              </div>
              <button 
                onClick={() => onChange({ ...data, maintenance: { ...data.maintenance, enabled: !data.maintenance.enabled } })}
                className={cn(
                  "w-12 h-6 rounded-full relative transition-all",
                  data.maintenance.enabled ? "bg-amber-500" : "bg-gray-200"
                )}
              >
                <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full transition-all", data.maintenance.enabled ? "left-7" : "left-1")} />
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Custom Message</label>
              <textarea 
                value={data.maintenance.message}
                onChange={(e) => onChange({ ...data, maintenance: { ...data.maintenance, message: e.target.value } })}
                className="w-full h-24 p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium outline-none focus:border-amber-500 focus:bg-white transition-all resize-none"
              />
            </div>

            <div className="flex items-center justify-between px-1">
              <span className="text-xs text-gray-500 font-medium">Admin Bypass</span>
              <button 
                onClick={() => onChange({ ...data, maintenance: { ...data.maintenance, adminBypass: !data.maintenance.adminBypass } })}
                className={cn(
                  "w-10 h-5 rounded-full relative transition-all",
                  data.maintenance.adminBypass ? "bg-green-500" : "bg-gray-200"
                )}
              >
                <div className={cn("absolute top-1 w-3 h-3 bg-white rounded-full transition-all", data.maintenance.adminBypass ? "left-6" : "left-1")} />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#3F51B5] to-[#6366F1] p-6 rounded-3xl shadow-lg shadow-indigo-100 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
              <Zap size={20} />
            </div>
            <h3 className="text-sm font-black uppercase tracking-tight">Pro Tip</h3>
          </div>
          <p className="text-xs font-medium text-white/80 leading-relaxed">
            Enable "Auto DNS Verify" to automatically check DNS propagation status across global servers every 15 minutes.
          </p>
          <button className="mt-4 w-full py-2 bg-white/20 hover:bg-white/30 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all backdrop-blur-md">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}
