import React from 'react';
import { 
  Megaphone, 
  Tag, 
  Mail, 
  MessageSquare, 
  TrendingUp, 
  Plus, 
  ChevronRight, 
  Calendar, 
  Users, 
  Zap, 
  Sparkles,
  Target,
  MousePointer2,
  BarChart3,
  Search,
  Filter,
  MoreHorizontal,
  ArrowUpRight,
  Gift,
  Ticket
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function AdminMarketing() {
  const campaigns = [
    { id: 1, name: 'Summer Flash Sale 2026', type: 'Flash Sale', status: 'Active', reach: '12.4k', conversion: '4.2%', budget: '৳ 15,000', end: '2 days left' },
    { id: 2, name: 'New Arrival Promo', type: 'Email Campaign', status: 'Scheduled', reach: '8.2k', conversion: '-', budget: '৳ 5,000', end: 'Starts in 1d' },
    { id: 3, name: 'Eid Special Collection', type: 'Social Media', status: 'Completed', reach: '45.8k', conversion: '6.8%', budget: '৳ 50,000', end: 'Ended' },
    { id: 4, name: 'First Order Discount', type: 'Coupon', status: 'Active', reach: '2.1k', conversion: '12.5%', budget: '৳ 0', end: 'Ongoing' },
  ];

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FF6A00] flex items-center justify-center text-white shadow-lg shadow-orange-100">
              <Megaphone size={24} />
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">
              Marketing <span className="text-[#FF6A00]">Engine</span>
            </h1>
          </div>
          <p className="text-sm text-gray-500 font-medium max-w-md">
            Drive growth through high-impact campaigns, promotions, and customer engagement strategies.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button className="bg-white text-gray-900 px-8 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest shadow-sm border border-gray-100 hover:shadow-md hover:bg-gray-50 transition-all flex items-center gap-3 group">
            <Gift size={18} className="group-hover:scale-110 transition-transform" />
            Create Coupon
          </button>
          <button className="bg-[#FF6A00] text-white px-8 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-orange-100 hover:bg-[#E65F00] hover:scale-105 transition-all flex items-center gap-3">
            <Plus size={20} />
            New Campaign
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Total Reach', value: '68.5k', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+18%' },
          { label: 'Avg. Conversion', value: '5.2%', icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+2.4%' },
          { label: 'Active Coupons', value: '12', icon: Ticket, color: 'text-[#FF6A00]', bg: 'bg-orange-50', trend: '0%' },
          { label: 'Marketing ROI', value: '4.8x', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50', trend: '+0.5x' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 hover:shadow-2xl transition-all group">
            <div className="flex items-center justify-between mb-6">
              <div className={cn("p-4 rounded-2xl transition-colors shadow-sm", stat.bg, stat.color)}>
                <stat.icon size={24} />
              </div>
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-tighter shadow-sm border border-emerald-100">
                <ArrowUpRight size={14} />
                {stat.trend}
              </div>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-gray-900 tracking-tight leading-none">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Campaign Management Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Active Campaigns Table */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[40px] shadow-sm border border-gray-50 overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-[#FF6A00]">
                  <Zap size={20} />
                </div>
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Active Campaigns</h3>
              </div>
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Search campaigns..." 
                  className="pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-[10px] font-bold outline-none focus:bg-white focus:border-[#FF6A00] transition-all w-48 shadow-inner"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF6A00]" size={16} />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Campaign</th>
                    <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Performance</th>
                    <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Budget</th>
                    <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {campaigns.map((camp) => (
                    <tr key={camp.id} className="hover:bg-gray-50/50 transition-all group">
                      <td className="px-8 py-6">
                        <p className="text-xs font-black text-gray-900 uppercase tracking-tight group-hover:text-[#FF6A00] transition-colors">{camp.name}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">{camp.type}</p>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-[10px] font-black text-gray-900">{camp.reach}</p>
                            <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Reach</p>
                          </div>
                          <div className="w-px h-6 bg-gray-100" />
                          <div>
                            <p className="text-[10px] font-black text-emerald-600">{camp.conversion}</p>
                            <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Conv.</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <p className="text-[10px] font-black text-gray-900">{camp.budget}</p>
                        <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-1">Allocated</p>
                      </td>
                      <td className="px-6 py-6">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border shadow-sm",
                          camp.status === 'Active' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                          camp.status === 'Scheduled' ? "bg-blue-50 text-blue-600 border-blue-100" :
                          "bg-gray-50 text-gray-500 border-gray-100"
                        )}>
                          {camp.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="p-2 text-gray-400 hover:text-[#FF6A00] hover:bg-orange-50 rounded-xl transition-all">
                          <MoreHorizontal size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Marketing Tools Bento */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 space-y-8 relative overflow-hidden group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                <Sparkles size={20} />
              </div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Growth Tools</h3>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Email Automations', icon: Mail, desc: 'Welcome, Abandoned Cart, etc.', color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'SMS Marketing', icon: MessageSquare, desc: 'Direct alerts to customers', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Discount Engine', icon: Tag, desc: 'Coupons & dynamic pricing', color: 'text-[#FF6A00]', bg: 'bg-orange-50' },
                { label: 'Analytics Insights', icon: BarChart3, desc: 'Campaign performance data', color: 'text-purple-600', bg: 'bg-purple-50' },
              ].map((tool, i) => (
                <button 
                  key={i}
                  className="w-full flex items-center justify-between p-5 bg-gray-50 rounded-[28px] border border-transparent hover:border-orange-100 hover:bg-white hover:shadow-md transition-all group/tool"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm group-hover/tool:scale-110 transition-transform", tool.bg, tool.color)}>
                      <tool.icon size={20} />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-black text-gray-900 uppercase tracking-tight">{tool.label}</p>
                      <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-1">{tool.desc}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 group-hover/tool:text-[#FF6A00] group-hover/tool:translate-x-1 transition-all" />
                </button>
              ))}
            </div>

            <div className="bg-orange-50 p-6 rounded-[32px] border border-orange-100 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-[0.05] group-hover:scale-110 transition-transform duration-700">
                <TrendingUp size={80} />
              </div>
              <p className="text-[10px] font-black text-[#FF6A00] uppercase tracking-widest mb-2">Pro Tip</p>
              <p className="text-[11px] font-bold text-orange-700 leading-relaxed uppercase tracking-wider relative z-10">
                Segmented email campaigns have a 14% higher open rate. Try creating a campaign for "Inactive Customers" today.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
