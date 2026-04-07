import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  ShoppingBag, 
  TrendingUp, 
  Calendar, 
  Clock,
  MessageSquare,
  ShieldCheck,
  ExternalLink,
  Package,
  ChevronRight,
  User,
  CreditCard,
  AlertCircle,
  History,
  Star,
  Zap,
  X,
  RefreshCw
} from 'lucide-react';
import { cn, formatPrice } from '@/src/lib/utils';

export default function AdminCustomerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customerRes, ordersRes] = await Promise.all([
          axios.get(`/api/admin/customers/${id}`),
          axios.get(`/api/admin/orders?userId=${id}`)
        ]);
        setCustomer(customerRes.data);
        setOrders(ordersRes.data);
      } catch (error) {
        console.error("Failed to fetch customer data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-8">
        <div className="w-20 h-20 border-4 border-orange-100 border-t-[#FF6A00] rounded-full animate-spin shadow-sm" />
        <div className="text-center">
          <p className="text-sm font-black text-gray-900 uppercase tracking-widest">Loading Profile</p>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">Retrieving customer insights...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-40 space-y-8 bg-white rounded-[40px] border border-gray-100 shadow-sm max-w-2xl mx-auto">
        <div className="w-24 h-24 bg-gray-50 rounded-[48px] flex items-center justify-center mx-auto text-gray-300 shadow-inner">
          <AlertCircle size={48} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Customer Not Found</h2>
          <p className="text-sm text-gray-500 font-medium mt-2 leading-relaxed">The customer profile you are looking for does not exist or has been removed.</p>
        </div>
        <button 
          onClick={() => navigate('/admin/customers')}
          className="bg-[#FF6A00] text-white px-10 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-orange-100 hover:bg-[#E65F00] transition-all inline-flex items-center gap-3"
        >
          <ArrowLeft size={18} />
          Back to Customers
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/admin/customers')}
            className="w-14 h-14 flex items-center justify-center bg-white border border-gray-100 rounded-[20px] text-gray-400 hover:text-[#FF6A00] hover:bg-orange-50 transition-all shadow-sm group"
          >
            <ArrowLeft size={28} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-[28px] overflow-hidden border-4 border-white shadow-xl">
              <img 
                src={customer.image || customer.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.fullName || 'User')}&background=random`} 
                alt={customer.fullName} 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none">{customer.fullName}</h1>
                <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm">
                  {customer.status || 'Active'}
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-3 flex items-center gap-2">
                <Zap size={14} className="text-[#FF6A00]" />
                Customer since {new Date(customer.createdAt || Date.now()).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-3 bg-white px-8 py-4 rounded-[20px] border border-gray-100 text-[10px] font-black text-gray-600 uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm group">
            <MessageSquare size={20} className="group-hover:scale-110 transition-transform" />
            Send Message
          </button>
          <button className="bg-[#FF6A00] text-white px-10 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-orange-100 hover:bg-[#E65F00] transition-all flex items-center gap-3">
            <ShieldCheck size={20} />
            Manage Access
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Stats & History (8 cols) */}
        <div className="lg:col-span-8 space-y-10">
          {/* Order Stats Bento */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 flex flex-col justify-between group hover:border-orange-100 transition-all">
              <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-[#FF6A00] mb-6 group-hover:scale-110 transition-transform">
                <ShoppingBag size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Orders</p>
                <p className="text-3xl font-black text-gray-900 tracking-tighter">{customer.totalOrders || 0}</p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 flex flex-col justify-between group hover:border-emerald-100 transition-all">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Spending</p>
                <p className="text-3xl font-black text-gray-900 tracking-tighter">{formatPrice(customer.totalSpend || 0)}</p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 flex flex-col justify-between group hover:border-rose-100 transition-all">
              <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 mb-6 group-hover:scale-110 transition-transform">
                <X size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Cancelled</p>
                <p className="text-3xl font-black text-gray-900 tracking-tighter">{orders.filter(o => o.status === 'Cancelled').length}</p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 flex flex-col justify-between group hover:border-amber-100 transition-all">
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-6 group-hover:scale-110 transition-transform">
                <RefreshCw size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Returned</p>
                <p className="text-3xl font-black text-gray-900 tracking-tighter">{orders.filter(o => o.status === 'Returned').length}</p>
              </div>
            </div>
          </div>

          {/* Order History Bento */}
          <div className="bg-white rounded-[40px] shadow-sm border border-gray-50 overflow-hidden">
            <div className="p-10 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-indigo-50 rounded-[20px] flex items-center justify-center text-indigo-600 shadow-inner">
                  <History size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Purchased Product History</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1.5">Last {orders.length} transactions</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Last Order Date</p>
                <p className="text-sm font-black text-gray-900 uppercase tracking-tight">
                  {orders.length > 0 ? new Date(orders[0].createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-50">
                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                    <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                    <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                    <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-10 py-20 text-center text-gray-400 text-sm font-bold uppercase tracking-widest">No orders found for this customer</td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50/50 transition-all group">
                        <td className="px-10 py-6">
                          <span className="text-xs font-black text-gray-900 uppercase tracking-tight">#{order.orderNumber || order.id.slice(0, 8)}</span>
                        </td>
                        <td className="px-6 py-6">
                          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </td>
                        <td className="px-6 py-6 font-black text-gray-900">{formatPrice(order.total)}</td>
                        <td className="px-6 py-6">
                          <span className="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest bg-gray-100 text-gray-600 border border-gray-200">
                            {order.status}
                          </span>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <button 
                            onClick={() => navigate(`/admin/orders/${order.id}`)}
                            className="text-[#FF6A00] hover:underline text-[10px] font-black uppercase tracking-widest"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Profile Details (4 cols) */}
        <div className="lg:col-span-4 space-y-10">
          {/* Contact Info Bento */}
          <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-50 space-y-8">
            <div className="flex items-center gap-5 pb-8 border-b border-gray-50">
              <div className="w-14 h-14 bg-gray-50 rounded-[20px] flex items-center justify-center text-gray-400 shadow-inner">
                <User size={28} />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Personal Info</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1.5">Contact & Identity</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</p>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-[20px] border border-transparent hover:border-orange-100 transition-all group">
                  <Mail size={20} className="text-gray-400 group-hover:text-[#FF6A00]" />
                  <span className="text-xs font-bold text-gray-600 truncate">{customer.email}</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Number</p>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-[20px] border border-transparent hover:border-orange-100 transition-all group">
                  <Phone size={20} className="text-gray-400 group-hover:text-[#FF6A00]" />
                  <span className="text-xs font-bold text-gray-600">{customer.phone || 'N/A'}</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Default Address</p>
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-[20px] border border-transparent hover:border-orange-100 transition-all group">
                  <MapPin size={20} className="text-gray-400 group-hover:text-[#FF6A00] mt-1 shrink-0" />
                  <span className="text-xs font-bold text-gray-600 leading-relaxed">{customer.address || 'No address saved'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Behavior Bento */}
          <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-50 space-y-8">
            <div className="flex items-center gap-5 pb-8 border-b border-gray-50">
              <div className="w-14 h-14 bg-gray-50 rounded-[20px] flex items-center justify-center text-gray-400 shadow-inner">
                <Zap size={28} />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Behavior</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1.5">Engagement Metrics</p>
              </div>
            </div>
            <div className="space-y-5">
              <div className="flex items-center justify-between p-5 bg-gray-50 rounded-[20px] shadow-inner">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Last Active</span>
                <span className="text-xs font-black text-gray-900 uppercase tracking-tight">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between p-5 bg-gray-50 rounded-[20px] shadow-inner">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Avg. Order Value</span>
                <span className="text-xs font-black text-gray-900 uppercase tracking-tight">
                  {formatPrice((customer.totalSpend || 0) / (customer.totalOrders || 1))}
                </span>
              </div>
              <div className="flex items-center justify-between p-5 bg-gray-50 rounded-[20px] shadow-inner">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Retention Rate</span>
                <span className="text-xs font-black text-emerald-600 uppercase tracking-tight">High</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
