import React from 'react';
import { 
  ShoppingCart, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  ChevronRight, 
  Bell, 
  ArrowUpRight, 
  ArrowDownRight, 
  Users, 
  ShoppingBag, 
  TrendingUp,
  Filter,
  Download,
  Search,
  MoreHorizontal,
  Zap,
  AlertCircle,
  XCircle,
  Send
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function AdminAbandonedCart() {
  const abandonedCarts = [
    { id: 1, customer: 'Rahat Khan', email: 'rahat@example.com', phone: '01712345678', product: 'Premium Cotton T-Shirt', price: '৳ 1,200', time: '2 hours ago', items: 3, status: 'High Intent' },
    { id: 2, customer: 'Sumi Akter', email: 'sumi@example.com', phone: '01812345678', product: 'Slim Fit Denim Jeans', price: '৳ 2,500', time: '5 hours ago', items: 1, status: 'Medium Intent' },
    { id: 3, customer: 'Jasim Uddin', email: 'jasim@example.com', phone: '01912345678', product: 'Wireless Bluetooth Earbuds', price: '৳ 3,800', time: '12 hours ago', items: 2, status: 'Low Intent' },
    { id: 4, customer: 'Nila Islam', email: 'nila@example.com', phone: '01612345678', product: 'Leather Wallet', price: '৳ 900', time: '1 day ago', items: 1, status: 'High Intent' },
    { id: 5, customer: 'Abir Hasan', email: 'abir@example.com', phone: '01512345678', product: 'Casual Polo Shirt', price: '৳ 1,500', time: '2 days ago', items: 4, status: 'Medium Intent' },
  ];

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FF6A00] flex items-center justify-center text-white shadow-lg shadow-orange-100">
              <ShoppingCart size={24} />
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">
              Abandoned <span className="text-[#FF6A00]">Carts</span>
            </h1>
          </div>
          <p className="text-sm text-gray-500 font-medium max-w-md">
            Track and recover potential sales from customers who didn't complete their checkout process.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button className="bg-white text-gray-900 px-8 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest shadow-sm border border-gray-100 hover:shadow-md hover:bg-gray-50 transition-all flex items-center gap-3 group">
            <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
            Export List
          </button>
          <button className="bg-[#FF6A00] text-white px-8 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-orange-100 hover:bg-[#E65F00] hover:scale-105 transition-all flex items-center gap-3">
            <Bell size={20} />
            Send Reminders
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Abandoned Carts', value: '42', icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12%', up: true },
          { label: 'Potential Revenue', value: '৳ 84,200', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+8.4%', up: true },
          { label: 'Recovery Rate', value: '18.5%', icon: Zap, color: 'text-[#FF6A00]', bg: 'bg-orange-50', trend: '+2.1%', up: true },
          { label: 'Avg. Cart Value', value: '৳ 2,150', icon: ShoppingBag, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '-1.2%', up: false },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 hover:shadow-2xl transition-all group">
            <div className="flex items-center justify-between mb-6">
              <div className={cn("p-4 rounded-2xl transition-colors shadow-sm", stat.bg, stat.color)}>
                <stat.icon size={24} />
              </div>
              <div className={cn(
                "flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm",
                stat.up ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"
              )}>
                {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.trend}
              </div>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-gray-900 tracking-tight leading-none">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 flex flex-wrap items-center justify-between gap-8">
        <div className="flex items-center gap-6 flex-1 min-w-[300px]">
          <div className="relative flex-1 group">
            <input 
              type="text" 
              placeholder="Search by customer name or email..." 
              className="pl-14 pr-6 py-5 bg-gray-50 border border-transparent rounded-[24px] text-sm font-medium outline-none focus:border-[#FF6A00] focus:bg-white transition-all w-full shadow-inner"
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF6A00] transition-colors" size={24} />
          </div>
          <button className="flex items-center gap-3 bg-gray-50 px-8 py-5 rounded-[24px] border border-transparent text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-gray-100 transition-all">
            <Filter size={20} />
            Filters
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[40px] shadow-sm border border-gray-50 overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-50">
                <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                <th className="px-6 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product Info</th>
                <th className="px-6 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Cart Value</th>
                <th className="px-6 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Abandoned At</th>
                <th className="px-6 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Intent Level</th>
                <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {abandonedCarts.map((cart) => (
                <tr key={cart.id} className="hover:bg-gray-50/50 transition-all group cursor-pointer">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-[20px] bg-orange-50 flex items-center justify-center text-[#FF6A00] border border-orange-100 shadow-sm group-hover:shadow-md transition-all">
                        <User size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-gray-900 group-hover:text-[#FF6A00] transition-colors uppercase tracking-tight">{cart.customer}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">{cart.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-8">
                    <p className="text-xs font-black text-gray-900 uppercase tracking-tight line-clamp-1">{cart.product}</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">{cart.items} items in cart</p>
                  </td>
                  <td className="px-6 py-8">
                    <p className="text-sm font-black text-gray-900">{cart.price}</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Total Value</p>
                  </td>
                  <td className="px-6 py-8">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Clock size={16} className="text-[#FF6A00]" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{cart.time}</span>
                    </div>
                  </td>
                  <td className="px-6 py-8">
                    <span className={cn(
                      "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm",
                      cart.status === 'High Intent' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                      cart.status === 'Medium Intent' ? "bg-orange-50 text-[#FF6A00] border-orange-100" :
                      "bg-gray-50 text-gray-600 border-gray-100"
                    )}>
                      {cart.status}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-[#FF6A00] hover:bg-orange-50 rounded-2xl transition-all shadow-sm hover:shadow-md bg-white border border-gray-100" title="Send Email Reminder">
                        <Mail size={20} />
                      </button>
                      <button className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-2xl transition-all shadow-sm hover:shadow-md bg-white border border-gray-100" title="Send SMS Reminder">
                        <Send size={18} />
                      </button>
                      <button className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-all bg-white border border-gray-100">
                        <MoreHorizontal size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="px-10 py-8 bg-gray-50/50 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
            Showing <span className="text-gray-900">5</span> of <span className="text-gray-900">42</span> Abandoned Carts
          </p>
          <div className="flex items-center gap-3">
            <button className="w-12 h-12 flex items-center justify-center rounded-2xl border border-gray-200 text-gray-400 cursor-not-allowed bg-white shadow-sm">
              <ChevronRight size={24} className="rotate-180" />
            </button>
            <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#FF6A00] text-white text-xs font-black shadow-xl shadow-orange-100">1</button>
            <button className="w-12 h-12 flex items-center justify-center rounded-2xl border border-gray-200 text-gray-400 cursor-not-allowed bg-white shadow-sm">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
