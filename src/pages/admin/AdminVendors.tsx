import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Store, 
  Plus, 
  ChevronRight, 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal, 
  Star, 
  Package, 
  DollarSign, 
  TrendingUp, 
  ShieldCheck, 
  Activity, 
  ArrowUpRight, 
  Mail, 
  Phone,
  MapPin,
  Building2,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import axios from '../../lib/api';

export default function AdminVendors() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/admin/vendors');
        setVendors(response.data);
      } catch (error) {
        console.error('Failed to fetch vendors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 text-[#FF6A00] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FF6A00] flex items-center justify-center text-white shadow-lg shadow-orange-100">
              <Building2 size={24} />
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">
              Vendor <span className="text-[#FF6A00]">Network</span>
            </h1>
          </div>
          <p className="text-sm text-gray-500 font-medium max-w-md">
            Manage your marketplace partners, inventory contributions, and vendor performance metrics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button className="bg-white text-gray-900 px-8 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest shadow-sm border border-gray-100 hover:shadow-md hover:bg-gray-50 transition-all flex items-center gap-3 group">
            <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
            Export Data
          </button>
          <button className="bg-[#FF6A00] text-white px-8 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-orange-100 hover:bg-[#E65F00] hover:scale-105 transition-all flex items-center gap-3">
            <Plus size={20} />
            Onboard Vendor
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Total Vendors', value: vendors.length.toString(), icon: Store, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+4' },
          { label: 'Vendor Products', value: '1,240', icon: Package, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+124' },
          { label: 'Marketplace Sales', value: '৳ 8.4M', icon: DollarSign, color: 'text-[#FF6A00]', bg: 'bg-orange-50', trend: '+18.5%' },
          { label: 'Avg. Rating', value: '4.6', icon: Star, color: 'text-purple-600', bg: 'bg-purple-50', trend: '+0.2' },
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Vendors Table */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[40px] shadow-sm border border-gray-50 overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-[#FF6A00]">
                  <Activity size={20} />
                </div>
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Partner Directory</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <input 
                    type="text" 
                    placeholder="Search vendors..." 
                    className="pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-[10px] font-bold outline-none focus:bg-white focus:border-[#FF6A00] transition-all w-48 shadow-inner"
                  />
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF6A00]" size={16} />
                </div>
                <button className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 hover:text-gray-600 transition-all">
                  <Filter size={18} />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Vendor</th>
                    <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Inventory</th>
                    <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Sales</th>
                    <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Rating</th>
                    <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {vendors.map((vendor) => (
                    <tr key={vendor.id} className="hover:bg-gray-50/50 transition-all group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-[#FF6A00] group-hover:bg-orange-50 transition-all border border-gray-100 shadow-sm">
                            <Store size={20} />
                          </div>
                          <div>
                            <p className="text-xs font-black text-gray-900 uppercase tracking-tight group-hover:text-[#FF6A00] transition-colors">{vendor.name}</p>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">{vendor.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <p className="text-xs font-black text-gray-900">{vendor.products}</p>
                        <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-1">Live Products</p>
                      </td>
                      <td className="px-6 py-6">
                        <p className="text-xs font-black text-gray-900">{vendor.sales}</p>
                        <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-1">Lifetime</p>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-1 text-[#FF6A00]">
                          <Star size={14} fill="currentColor" />
                          <span className="text-xs font-black">{vendor.rating}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border shadow-sm",
                          vendor.status === 'Active' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                          vendor.status === 'Pending' ? "bg-orange-50 text-[#FF6A00] border-orange-100" :
                          "bg-gray-50 text-gray-500 border-gray-100"
                        )}>
                          {vendor.status}
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

        {/* Vendor Insights Bento */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 space-y-8 relative overflow-hidden group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <TrendingUp size={20} />
              </div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Top Performers</h3>
            </div>

            <div className="space-y-6">
              {vendors.slice(0, 3).map((v, i) => (
                <div key={i} className="flex items-center justify-between group/item">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover/item:text-[#FF6A00] transition-colors">
                      <Store size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-900 uppercase tracking-tight">{v.name}</p>
                      <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-1">{v.sales} Sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-tight">Top {i + 1}</p>
                    <div className="flex items-center gap-1 text-[#FF6A00] mt-1">
                      <Star size={10} fill="currentColor" />
                      <span className="text-[9px] font-black">{v.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 p-6 rounded-[32px] border border-blue-100 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-[0.05] group-hover:scale-110 transition-transform duration-700">
                <ShieldCheck size={80} />
              </div>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">Compliance Check</p>
              <p className="text-[11px] font-bold text-blue-700 leading-relaxed uppercase tracking-wider relative z-10">
                94% of vendors meet the 24-hour dispatch requirement. 2 vendors are currently under review for shipping delays.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
