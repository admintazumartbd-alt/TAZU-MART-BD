import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Plus, 
  ChevronRight, 
  Search, 
  Filter, 
  MoreHorizontal, 
  UserPlus, 
  Key, 
  Activity, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Lock, 
  Eye, 
  Edit3, 
  Trash2,
  UserCheck,
  ShieldAlert,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import axios from '../../lib/api';

export default function AdminManagement() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/admin/admins');
        setAdmins(response.data);
      } catch (error) {
        console.error('Failed to fetch admins:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
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
              <ShieldCheck size={24} />
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">
              Admin <span className="text-[#FF6A00]">Control</span>
            </h1>
          </div>
          <p className="text-sm text-gray-500 font-medium max-w-md">
            Manage administrative access, roles, and security permissions for your store's backend.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button className="bg-white text-gray-900 px-8 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest shadow-sm border border-gray-100 hover:shadow-md hover:bg-gray-50 transition-all flex items-center gap-3 group">
            <Key size={18} className="group-hover:translate-y-0.5 transition-transform" />
            Role Permissions
          </button>
          <button className="bg-[#FF6A00] text-white px-8 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-orange-100 hover:bg-[#E65F00] hover:scale-105 transition-all flex items-center gap-3">
            <UserPlus size={20} />
            Add Administrator
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Total Admins', value: admins.length.toString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+2' },
          { label: 'Active Sessions', value: '4', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '0' },
          { label: 'Security Score', value: '98%', icon: ShieldCheck, color: 'text-[#FF6A00]', bg: 'bg-orange-50', trend: '+1.5%' },
          { label: 'Pending Invites', value: '2', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50', trend: '-1' },
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
        {/* Admins Table */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[40px] shadow-sm border border-gray-50 overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-[#FF6A00]">
                  <UserCheck size={20} />
                </div>
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Administrator Directory</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <input 
                    type="text" 
                    placeholder="Search admins..." 
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
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Administrator</th>
                    <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Role & Access</th>
                    <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Last Activity</th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {admins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-gray-50/50 transition-all group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-[#FF6A00] group-hover:bg-orange-50 transition-all border border-gray-100 shadow-sm">
                            <Users size={20} />
                          </div>
                          <div>
                            <p className="text-xs font-black text-gray-900 uppercase tracking-tight group-hover:text-[#FF6A00] transition-colors">{admin.name}</p>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">{admin.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2">
                          <Lock size={12} className="text-gray-400" />
                          <p className="text-xs font-black text-gray-900 uppercase tracking-tight">{admin.role}</p>
                        </div>
                        <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-1">Full Access</p>
                      </td>
                      <td className="px-6 py-6">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border shadow-sm",
                          admin.status === 'Active' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                          "bg-gray-50 text-gray-500 border-gray-100"
                        )}>
                          {admin.status}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <p className="text-[10px] font-black text-gray-900 uppercase tracking-tight">{admin.lastLogin}</p>
                        <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-1">Timestamp</p>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="Edit Permissions">
                            <Edit3 size={18} />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all" title="Remove Admin">
                            <Trash2 size={18} />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-xl transition-all">
                            <MoreHorizontal size={18} />
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

        {/* Security Bento */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 space-y-8 relative overflow-hidden group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-[#FF6A00]">
                <ShieldAlert size={20} />
              </div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Security Audit</h3>
            </div>

            <div className="space-y-4">
              {[
                { label: '2FA Enforcement', status: 'Enabled', icon: ShieldCheck, color: 'text-emerald-500' },
                { label: 'Password Policy', status: 'Strict', icon: Lock, color: 'text-blue-500' },
                { label: 'Login Alerts', status: 'Active', icon: AlertCircle, color: 'text-[#FF6A00]' },
                { label: 'Audit Logs', status: 'Enabled', icon: Activity, color: 'text-purple-500' },
              ].map((sec, i) => (
                <div key={i} className="flex items-center justify-between p-5 bg-gray-50 rounded-[28px] border border-transparent hover:border-orange-100 hover:bg-white hover:shadow-md transition-all group/sec">
                  <div className="flex items-center gap-4">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shadow-sm group-hover/sec:scale-110 transition-transform bg-white border border-gray-100", sec.color)}>
                      <sec.icon size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-900 uppercase tracking-tight">{sec.label}</p>
                      <p className={cn("text-[8px] font-bold uppercase tracking-widest mt-1", sec.color)}>{sec.status}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 group-hover/sec:text-[#FF6A00] group-hover/sec:translate-x-1 transition-all" />
                </div>
              ))}
            </div>

            <div className="bg-emerald-50 p-6 rounded-[32px] border border-emerald-100 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-[0.05] group-hover:scale-110 transition-transform duration-700">
                <ShieldCheck size={80} />
              </div>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">System Status</p>
              <p className="text-[11px] font-bold text-emerald-700 leading-relaxed uppercase tracking-wider relative z-10">
                All administrative accounts are currently secured with 2FA. No unauthorized access attempts detected.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
