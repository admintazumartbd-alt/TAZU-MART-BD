import React, { useState } from 'react';
import { 
  Globe, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Code,
  Activity,
  Terminal,
  Zap,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export default function WebsiteTracking() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [events, setEvents] = useState([
    { id: 'page_view', name: 'Page View', enabled: true, status: 'success' },
    { id: 'view_content', name: 'View Content', enabled: true, status: 'success' },
    { id: 'add_to_cart', name: 'Add To Cart', enabled: true, status: 'success' },
    { id: 'initiate_checkout', name: 'Initiate Checkout', enabled: true, status: 'success' },
    { id: 'purchase', name: 'Purchase', enabled: true, status: 'success' },
    { id: 'complete_registration', name: 'Complete Registration', enabled: true, status: 'success' },
  ]);

  const [scripts, setScripts] = useState({
    header: '',
    footer: '',
    global: ''
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
            <Globe size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Website Tracking</h1>
            <p className="text-sm text-gray-500 font-medium">Track user activity via browser-based pixels and scripts</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
          <span className={cn(
            "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg",
            isEnabled ? "bg-emerald-50 text-emerald-600" : "bg-gray-50 text-gray-400"
          )}>
            {isEnabled ? 'Tracking Active' : 'Tracking Disabled'}
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
        {/* Event Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[24px] shadow-sm border border-gray-50 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity size={18} className="text-indigo-600" />
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Event Tracking</h2>
              </div>
              <button className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:underline">
                Test Mode
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      event.status === 'success' ? "bg-emerald-500" : "bg-rose-500"
                    )} />
                    <span className="text-sm font-bold text-gray-700">{event.name}</span>
                  </div>
                  <button 
                    onClick={() => {
                      setEvents(events.map(e => e.id === event.id ? {...e, enabled: !e.enabled} : e));
                    }}
                    className={cn(
                      "transition-colors",
                      event.enabled ? "text-indigo-600" : "text-gray-300"
                    )}
                  >
                    {event.enabled ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Script Injection */}
          <div className="bg-white rounded-[24px] shadow-sm border border-gray-50 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center gap-2">
              <Code size={18} className="text-indigo-600" />
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Script Injection</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Header Script Injection</label>
                <textarea 
                  rows={4}
                  placeholder="<script>...</script>"
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl text-xs font-mono focus:bg-white focus:border-indigo-500 transition-all outline-none resize-none"
                  value={scripts.header}
                  onChange={(e) => setScripts({...scripts, header: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Footer Script Injection</label>
                <textarea 
                  rows={4}
                  placeholder="<script>...</script>"
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl text-xs font-mono focus:bg-white focus:border-indigo-500 transition-all outline-none resize-none"
                  value={scripts.footer}
                  onChange={(e) => setScripts({...scripts, footer: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Global Tracking Code</label>
                <textarea 
                  rows={4}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl text-xs font-mono focus:bg-white focus:border-indigo-500 transition-all outline-none resize-none"
                  value={scripts.global}
                  onChange={(e) => setScripts({...scripts, global: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Log */}
        <div className="space-y-6">
          <div className="bg-gray-900 rounded-[24px] shadow-xl overflow-hidden h-[600px] flex flex-col border border-gray-800">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/50 backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <Terminal size={16} className="text-emerald-400" />
                <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Real-time Event Log</h2>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">Live</span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-[10px] no-scrollbar">
              <div className="text-gray-500">[04:54:20] <span className="text-emerald-400">SUCCESS</span> PageView - /product/123</div>
              <div className="text-gray-500">[04:54:25] <span className="text-emerald-400">SUCCESS</span> ViewContent - "Premium T-Shirt"</div>
              <div className="text-gray-500">[04:54:30] <span className="text-emerald-400">SUCCESS</span> AddToCart - ID: 123, Value: ৳1200</div>
              <div className="text-gray-500">[04:54:35] <span className="text-emerald-400">SUCCESS</span> InitiateCheckout - Items: 1</div>
              <div className="text-gray-400 animate-pulse">Waiting for events...</div>
            </div>
            <div className="p-4 bg-gray-800/50 border-t border-gray-800">
              <button className="w-full py-2 bg-gray-700 text-gray-300 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-600 transition-all">
                Clear Logs
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-6 rounded-[24px] text-white shadow-lg shadow-indigo-200">
            <Zap size={24} className="mb-4" />
            <h3 className="text-sm font-bold uppercase tracking-tight">Pro Tip</h3>
            <p className="text-xs text-indigo-100 font-medium mt-2 leading-relaxed">
              Use Website Tracking for quick setup, but consider Server-Side Tracking for 100% accuracy and bypassing ad blockers.
            </p>
          </div>
        </div>
      </div>

      {/* Floating Save */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-2xl shadow-indigo-300 hover:scale-[1.05] active:scale-[0.95] transition-all">
          <Save size={20} />
          Save Tracking Config
        </button>
      </div>
    </div>
  );
}
