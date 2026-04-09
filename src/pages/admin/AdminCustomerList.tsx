import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../lib/api';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  MessageSquare, 
  UserPlus, 
  Download,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  Edit3,
  MapPin,
  Smartphone,
  Globe,
  Clock,
  ExternalLink,
  X,
  Users,
  CheckSquare,
  Square,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingBag,
  TrendingUp,
  Calendar,
  Zap,
  ShieldCheck,
  FilterX,
  RefreshCw
} from 'lucide-react';
import { cn, formatPrice } from '@/src/lib/utils';

export default function AdminCustomerList() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'LIST' | 'ACTIVITY' | 'FRAUD' | 'INSIGHTS'>('LIST');

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/admin/customers');
      setCustomers(response.data);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const [insights, setInsights] = useState<any>(null);
  const [fraudPhone, setFraudPhone] = useState('');
  const [fraudData, setFraudData] = useState<any>(null);
  const [isFraudLoading, setIsFraudLoading] = useState(false);

  const fetchInsights = async () => {
    try {
      const response = await axios.get('/api/admin/customer-insights');
      setInsights(response.data);
    } catch (error) {
      console.error("Failed to fetch insights:", error);
    }
  };

  const handleFraudCheck = async () => {
    if (!fraudPhone) return;
    setIsFraudLoading(true);
    try {
      const response = await axios.post('/api/admin/fraud-check', { phone: fraudPhone });
      setFraudData(response.data);
    } catch (error) {
      console.error("Fraud check failed:", error);
    } finally {
      setIsFraudLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchInsights();
  }, []);

  const tabs = [
    { id: 'LIST', label: 'Purchase List', icon: ShoppingBag },
    { id: 'ACTIVITY', label: 'Activity Log', icon: Clock },
    { id: 'FRAUD', label: 'Fraud Identifier', icon: ShieldCheck },
    { id: 'INSIGHTS', label: 'Customer Insights', icon: TrendingUp },
  ];

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'Returning' || c.status === 'Warm').length;
  const totalRevenue = customers.reduce((acc, c) => acc + (c.totalSpend || 0), 0);

  const filteredCustomers = customers.filter(c => 
    (c.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.phone || '').includes(searchTerm)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hot': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'Warm': return 'bg-orange-50 text-[#FF6A00] border-orange-100';
      case 'Returning': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FF6A00] flex items-center justify-center text-white shadow-lg shadow-orange-100">
              <Users size={24} />
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">
              Customer <span className="text-[#FF6A00]">Manager</span>
            </h1>
          </div>
          <p className="text-sm text-gray-500 font-medium max-w-md">
            Manage relationships, monitor lifetime value, and analyze customer behavior across your store.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button 
            onClick={fetchCustomers}
            className="bg-white text-gray-900 px-8 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest shadow-sm border border-gray-100 hover:shadow-md hover:bg-gray-50 transition-all flex items-center gap-3 group"
          >
            <RefreshCw size={18} className={cn(isLoading && "animate-spin")} />
            Refresh
          </button>
          <button className="bg-[#FF6A00] text-white px-8 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-orange-100 hover:bg-[#E65F00] hover:scale-105 transition-all flex items-center gap-3">
            <UserPlus size={20} />
            New Customer
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[32px] border border-gray-50 shadow-sm flex items-center gap-6 group hover:shadow-md transition-all">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
            <Users size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Customers</p>
            <h3 className="text-2xl font-black text-gray-900">{totalCustomers}</h3>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-gray-50 shadow-sm flex items-center gap-6 group hover:shadow-md transition-all">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner">
            <TrendingUp size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Active Customers</p>
            <h3 className="text-2xl font-black text-gray-900">{activeCustomers}</h3>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-gray-50 shadow-sm flex items-center gap-6 group hover:shadow-md transition-all">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center text-[#FF6A00] shadow-inner">
            <Zap size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Lifetime Value</p>
            <h3 className="text-2xl font-black text-gray-900">{formatPrice(totalRevenue)}</h3>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-[24px] border border-gray-100 shadow-sm overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-3 px-6 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all shrink-0",
              activeTab === tab.id 
                ? "bg-[#FF6A00] text-white shadow-lg shadow-orange-100" 
                : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
            )}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'LIST' && (
        <>
          {/* Filters & Search */}
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 flex flex-wrap items-center justify-between gap-8">
            <div className="flex items-center gap-6 flex-1 min-w-[300px]">
              <div className="relative flex-1 group">
                <input 
                  type="text" 
                  placeholder="Search by name, email or phone..." 
                  className="pl-14 pr-6 py-5 bg-gray-50 border border-transparent rounded-[24px] text-sm font-medium outline-none focus:border-[#FF6A00] focus:bg-white transition-all w-full shadow-inner"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF6A00] transition-colors" size={24} />
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-[40px] shadow-sm border border-gray-50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-50">
                    <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer ID</th>
                    <th className="px-6 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Name</th>
                    <th className="px-6 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone</th>
                    <th className="px-6 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</th>
                    <th className="px-6 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Orders</th>
                    <th className="px-6 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Spent</th>
                    <th className="px-6 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {isLoading && customers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-10 py-32 text-center">
                        <div className="flex flex-col items-center gap-6">
                          <div className="w-16 h-16 border-4 border-orange-100 border-t-[#FF6A00] rounded-full animate-spin shadow-sm" />
                          <p className="text-sm font-black text-gray-900 uppercase tracking-widest">Syncing Customers</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-10 py-32 text-center">
                        <div className="flex flex-col items-center gap-8">
                          <div className="w-32 h-32 bg-gray-50 rounded-[48px] flex items-center justify-center text-gray-200 shadow-inner">
                            <Users size={64} />
                          </div>
                          <p className="text-lg font-black text-gray-900 uppercase tracking-tight">No Data Available</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <tr 
                        key={customer.id} 
                        className="hover:bg-gray-50/80 transition-all group"
                      >
                        <td className="px-10 py-8">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">#{customer.id?.slice(0, 8).toUpperCase()}</span>
                        </td>
                        <td className="px-6 py-8">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-100 shadow-sm shrink-0">
                              <img 
                                src={customer.image || customer.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.fullName || 'User')}&background=random`} 
                                alt={customer.fullName} 
                                className="w-full h-full object-cover" 
                                onError={(e) => (e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.fullName || 'User')}&background=random`)}
                              />
                            </div>
                            <p className="text-xs font-black text-gray-900 leading-none uppercase tracking-tight group-hover:text-[#FF6A00] transition-colors">{customer.fullName || 'Anonymous'}</p>
                          </div>
                        </td>
                        <td className="px-6 py-8">
                          <p className="text-xs font-black text-gray-900">{customer.phone || 'No Phone'}</p>
                        </td>
                        <td className="px-6 py-8">
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{customer.email}</p>
                        </td>
                        <td className="px-6 py-8">
                          <div className="flex items-center gap-2 text-[10px] font-black text-gray-600 uppercase tracking-widest">
                            <ShoppingBag size={14} className="text-gray-400" />
                            {customer.totalOrders || 0}
                          </div>
                        </td>
                        <td className="px-6 py-8">
                          <p className="text-sm font-black text-gray-900">{formatPrice(customer.totalSpend || 0)}</p>
                        </td>
                        <td className="px-6 py-8">
                          <span className={cn("px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm", getStatusColor(customer.status || 'Cold'))}>
                            {customer.status || 'Cold'}
                          </span>
                        </td>
                        <td className="px-10 py-8 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button 
                              onClick={() => navigate(`/admin/customer/${customer.id}`)}
                              className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-[#FF6A00] hover:bg-orange-50 rounded-xl transition-all shadow-sm hover:shadow-md bg-white border border-gray-100"
                              title="View Profile"
                            >
                              <Eye size={18} />
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all bg-white border border-gray-100" title="Message">
                              <MessageSquare size={18} />
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all bg-white border border-gray-100" title="Block">
                              <ShieldCheck size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'ACTIVITY' && (
        <div className="bg-white rounded-[40px] shadow-sm border border-gray-50 p-10">
          <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-8">Login & Activity Log</h3>
          <div className="space-y-6">
            {customers.map((customer) => (
              <div key={customer.id} className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img 
                    src={customer.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.fullName || 'User')}`} 
                    className="w-12 h-12 rounded-xl" 
                    onError={(e) => (e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.fullName || 'User')}`)}
                  />
                  <div>
                    <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{customer.fullName}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Last Login: {customer.lastLogin ? new Date(customer.lastLogin).toLocaleString() : 'N/A'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Device: {customer.deviceType || 'Unknown'}</p>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">IP: {customer.ipAddress || 'N/A'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'FRAUD' && (
        <div className="bg-white rounded-[40px] shadow-sm border border-gray-50 p-10">
          <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-8">Fraud Customer Identifier</h3>
          <div className="max-w-md space-y-6">
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Enter Customer Phone Number..." 
                className="pl-14 pr-6 py-5 bg-gray-50 border border-transparent rounded-[24px] text-sm font-medium outline-none focus:border-[#FF6A00] focus:bg-white transition-all w-full shadow-inner"
                value={fraudPhone}
                onChange={(e) => setFraudPhone(e.target.value)}
              />
              <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF6A00] transition-colors" size={24} />
            </div>
            <button 
              onClick={handleFraudCheck}
              disabled={isFraudLoading}
              className="w-full bg-[#FF6A00] text-white py-5 rounded-[24px] text-sm font-black uppercase tracking-widest shadow-xl shadow-orange-100 hover:bg-[#E65F00] transition-all disabled:opacity-50"
            >
              {isFraudLoading ? 'Checking...' : 'Analyze Customer'}
            </button>
          </div>

          {fraudData && (
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in slide-in-from-top-4 duration-500">
              <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Orders</p>
                <p className="text-2xl font-black text-gray-900">{fraudData.totalOrders}</p>
              </div>
              <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Delivered</p>
                <p className="text-2xl font-black text-emerald-700">{fraudData.delivered}</p>
              </div>
              <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100">
                <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-2">Cancelled/Returned</p>
                <p className="text-2xl font-black text-rose-700">{fraudData.cancelled + fraudData.returned}</p>
              </div>
              <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
                <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2">Fraud Risk</p>
                <p className={cn(
                  "text-2xl font-black uppercase tracking-tight",
                  (fraudData.cancelled + fraudData.returned) > fraudData.delivered ? "text-rose-600" : "text-emerald-600"
                )}>
                  {(fraudData.cancelled + fraudData.returned) > fraudData.delivered ? 'High Risk' : 'Low Risk'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'INSIGHTS' && insights && (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-[32px] border border-gray-50 shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">New Customers (30d)</p>
              <h3 className="text-2xl font-black text-gray-900">{insights.newCustomers}</h3>
            </div>
            <div className="bg-white p-8 rounded-[32px] border border-gray-50 shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Repeat Rate</p>
              <h3 className="text-2xl font-black text-gray-900">{Math.round((insights.repeatCustomers / insights.totalCustomers) * 100)}%</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-50">
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-8">Top Customers</h3>
              <div className="space-y-6">
                {insights.topCustomers.map((c: any) => (
                  <div key={c.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <img src={c.image || `https://ui-avatars.com/api/?name=${c.fullName}`} className="w-10 h-10 rounded-xl" />
                      <div>
                        <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{c.fullName}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{c.totalOrders} Orders</p>
                      </div>
                    </div>
                    <p className="text-sm font-black text-[#FF6A00]">{formatPrice(c.totalSpending || 0)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-50">
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-8">Location Analytics</h3>
              <div className="space-y-6">
                {Object.entries(insights.locationStats).map(([loc, count]: [string, any]) => (
                  <div key={loc} className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest">
                      <span className="text-gray-500">{loc}</span>
                      <span className="text-gray-900">{count}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#FF6A00] rounded-full" 
                        style={{ width: `${(count / insights.totalCustomers) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl rounded-[40px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 border border-white/20">
            {/* Modal Header */}
            <div className="bg-gradient-to-br from-[#FF6A00] via-[#FF8C00] to-[#f85606] p-10 text-white relative">
              <button 
                onClick={() => setSelectedCustomer(null)}
                className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-2xl transition-all group"
              >
                <X size={20} className="group-hover:rotate-90 transition-transform" />
              </button>
              <div className="flex items-center gap-8">
                <div className="relative">
                  <img src={selectedCustomer.image || selectedCustomer.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedCustomer.fullName || 'User')}&background=random`} alt={selectedCustomer.fullName} className="w-32 h-32 rounded-[32px] object-cover border-4 border-white/20 shadow-2xl" />
                </div>
                <div>
                  <h2 className="text-4xl font-black tracking-tight leading-none uppercase">{selectedCustomer.fullName || 'Anonymous'}</h2>
                  <div className="flex items-center gap-4 mt-4">
                    <p className="text-white/90 font-bold flex items-center gap-2 text-sm">
                      <Mail size={18} className="text-white/60" /> {selectedCustomer.email}
                    </p>
                    <div className="w-1 h-1 rounded-full bg-white/40" />
                    <p className="text-white/90 font-bold flex items-center gap-2 text-sm">
                      <Smartphone size={18} className="text-white/60" /> {selectedCustomer.phone || 'No Phone'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-10">
                <div className="grid grid-cols-3 gap-6">
                  <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 shadow-inner">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Revenue</p>
                    <p className="text-2xl font-black text-gray-900">{formatPrice(selectedCustomer.totalSpend || 0)}</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 shadow-inner">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Orders</p>
                    <p className="text-2xl font-black text-gray-900">{selectedCustomer.totalOrders || 0}</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 shadow-inner">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Status</p>
                    <p className="text-2xl font-black text-gray-900">{selectedCustomer.status || 'Cold'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-gray-50 p-8 rounded-[32px] border border-gray-100">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 border-b border-gray-200 pb-4">Contact Details</h3>
                  <div className="space-y-5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 shadow-sm shrink-0">
                        <Smartphone size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Phone Number</p>
                        <p className="text-sm font-bold text-gray-900">{selectedCustomer.phone || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 shadow-sm shrink-0">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Shipping Address</p>
                        <p className="text-sm font-bold text-gray-900 leading-relaxed">{selectedCustomer.location || 'No address saved'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
