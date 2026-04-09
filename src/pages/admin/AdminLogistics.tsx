import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  MapPin, 
  Package, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  ChevronRight, 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal, 
  Navigation, 
  Globe, 
  Smartphone, 
  Zap,
  Box,
  ArrowUpRight,
  ShieldCheck,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import axios from '../../lib/api';

export default function AdminLogistics() {
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/admin/shipments');
        setShipments(response.data);
      } catch (error) {
        console.error('Failed to fetch shipments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShipments();
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
              <Truck size={24} />
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">
              Logistics <span className="text-[#FF6A00]">Hub</span>
            </h1>
          </div>
          <p className="text-sm text-gray-500 font-medium max-w-md">
            Manage your delivery network, shipping partners, and real-time shipment tracking.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button className="bg-white text-gray-900 px-8 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest shadow-sm border border-gray-100 hover:shadow-md hover:bg-gray-50 transition-all flex items-center gap-3 group">
            <MapPin size={18} className="group-hover:translate-y-0.5 transition-transform" />
            Shipping Zones
          </button>
          <button className="bg-[#FF6A00] text-white px-8 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-orange-100 hover:bg-[#E65F00] hover:scale-105 transition-all flex items-center gap-3">
            <Plus size={20} />
            Add Partner
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Active Shipments', value: '124', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12%' },
          { label: 'Avg. Delivery Time', value: '1.8d', icon: Clock, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '-0.2d' },
          { label: 'Delivery Success', value: '98.5%', icon: ShieldCheck, color: 'text-[#FF6A00]', bg: 'bg-orange-50', trend: '+0.5%' },
          { label: 'Shipping Revenue', value: '৳ 12,450', icon: Zap, color: 'text-purple-600', bg: 'bg-purple-50', trend: '+8.4%' },
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
        {/* Shipment Tracking Table */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[40px] shadow-sm border border-gray-50 overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-[#FF6A00]">
                  <Navigation size={20} />
                </div>
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Live Shipments</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <input 
                    type="text" 
                    placeholder="Track shipment ID..." 
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
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Shipment ID</th>
                    <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer & Order</th>
                    <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Partner</th>
                    <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {shipments.map((ship) => (
                    <tr key={ship.id} className="hover:bg-gray-50/50 transition-all group">
                      <td className="px-8 py-6">
                        <p className="text-xs font-black text-gray-900 uppercase tracking-tight group-hover:text-[#FF6A00] transition-colors">{ship.id}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">{ship.date}</p>
                      </td>
                      <td className="px-6 py-6">
                        <p className="text-xs font-black text-gray-900 uppercase tracking-tight">{ship.customer}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">{ship.order}</p>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:text-[#FF6A00] transition-colors">
                            <Truck size={16} />
                          </div>
                          <p className="text-[10px] font-black text-gray-700 uppercase tracking-tight">{ship.method}</p>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border shadow-sm",
                          ship.status === 'Delivered' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                          ship.status === 'In Transit' ? "bg-blue-50 text-blue-600 border-blue-100" :
                          ship.status === 'Pending' ? "bg-orange-50 text-[#FF6A00] border-orange-100" :
                          "bg-gray-50 text-gray-500 border-gray-100"
                        )}>
                          {ship.status}
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

        {/* Logistics Partners & Map Bento */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 space-y-8 relative overflow-hidden group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Globe size={20} />
              </div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Delivery Partners</h3>
            </div>

            <div className="space-y-4">
              {[
                { name: 'Pathao Courier', status: 'Active', logo: 'https://seeklogo.com/images/P/pathao-logo-0B1C4B5E9D-seeklogo.com.png' },
                { name: 'RedX Delivery', status: 'Active', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8b/Nagad_Logo.svg/1200px-Nagad_Logo.svg.png' },
                { name: 'Paperfly', status: 'Maintenance', logo: 'https://cdn-icons-png.flaticon.com/512/1554/1554401.png' },
              ].map((partner, i) => (
                <div key={i} className="flex items-center justify-between p-5 bg-gray-50 rounded-[28px] border border-transparent hover:border-orange-100 hover:bg-white hover:shadow-md transition-all group/partner">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 group-hover/partner:scale-110 transition-transform">
                      <Truck size={20} className="text-gray-400 group-hover/partner:text-[#FF6A00]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-900 uppercase tracking-tight">{partner.name}</p>
                      <p className={cn(
                        "text-[8px] font-bold uppercase tracking-widest mt-1",
                        partner.status === 'Active' ? "text-emerald-500" : "text-orange-500"
                      )}>{partner.status}</p>
                    </div>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-[#FF6A00] transition-colors">
                    <ExternalLink size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-indigo-50 p-6 rounded-[32px] border border-indigo-100 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-[0.05] group-hover:scale-110 transition-transform duration-700">
                <MapPin size={80} />
              </div>
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">Network Status</p>
              <p className="text-[11px] font-bold text-indigo-700 leading-relaxed uppercase tracking-wider relative z-10">
                Dhaka & Chittagong zones are operating at 100% capacity. Sylhet zone experiencing slight delays due to weather.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
