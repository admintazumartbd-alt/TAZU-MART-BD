import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  Download, 
  Calendar, 
  ChevronRight, 
  Search, 
  Filter, 
  MoreHorizontal, 
  PieChart, 
  Activity, 
  Zap, 
  ShieldCheck, 
  RefreshCw,
  Banknote,
  FileText
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import axios from '../../lib/api';

export default function AdminFinance() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [txRes, statsRes] = await Promise.all([
          axios.get('/api/admin/transactions'),
          axios.get('/api/admin/profit-stats')
        ]);
        setTransactions(txRes.data);
        setStats(statsRes.data);
      } catch (error) {
        console.error('Failed to fetch finance data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
              <DollarSign size={24} />
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">
              Finance <span className="text-[#FF6A00]">Vault</span>
            </h1>
          </div>
          <p className="text-sm text-gray-500 font-medium max-w-md">
            Monitor your store's financial health, transaction history, and payout management.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button className="bg-white text-gray-900 px-8 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest shadow-sm border border-gray-100 hover:shadow-md hover:bg-gray-50 transition-all flex items-center gap-3 group">
            <FileText size={18} className="group-hover:translate-y-0.5 transition-transform" />
            Tax Report
          </button>
          <button className="bg-[#FF6A00] text-white px-8 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-orange-100 hover:bg-[#E65F00] hover:scale-105 transition-all flex items-center gap-3">
            <Download size={20} />
            Export Ledger
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Total Revenue', value: `৳ ${stats?.revenue?.toLocaleString() || '0'}`, icon: Banknote, color: 'text-blue-600', bg: 'bg-blue-50', trend: `+${stats?.growth || '0'}%` },
          { label: 'Pending Payouts', value: '৳ 12,450', icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '-2.4%' },
          { label: 'Net Profit', value: '৳ 84,200', icon: TrendingUp, color: 'text-[#FF6A00]', bg: 'bg-orange-50', trend: '+5.8%' },
          { label: 'Refund Rate', value: '1.2%', icon: RefreshCw, color: 'text-rose-600', bg: 'bg-rose-50', trend: '-0.2%' },
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
        {/* Transactions Table */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[40px] shadow-sm border border-gray-50 overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-[#FF6A00]">
                  <Activity size={20} />
                </div>
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Recent Transactions</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <input 
                    type="text" 
                    placeholder="Search TX ID..." 
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
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Transaction ID</th>
                    <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer & Order</th>
                    <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Method</th>
                    <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                    <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50/50 transition-all group">
                      <td className="px-8 py-6">
                        <p className="text-xs font-black text-gray-900 uppercase tracking-tight group-hover:text-[#FF6A00] transition-colors">{tx.id}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">{tx.date}</p>
                      </td>
                      <td className="px-6 py-6">
                        <p className="text-xs font-black text-gray-900 uppercase tracking-tight">{tx.customer}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">{tx.order}</p>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:text-[#FF6A00] transition-colors">
                            <CreditCard size={16} />
                          </div>
                          <p className="text-[10px] font-black text-gray-700 uppercase tracking-tight">{tx.method}</p>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <p className="text-xs font-black text-gray-900">{tx.amount}</p>
                        <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-1">Total Paid</p>
                      </td>
                      <td className="px-6 py-6">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border shadow-sm",
                          tx.status === 'Completed' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                          tx.status === 'Pending' ? "bg-orange-50 text-[#FF6A00] border-orange-100" :
                          tx.status === 'Failed' ? "bg-rose-50 text-rose-600 border-rose-100" :
                          "bg-gray-50 text-gray-500 border-gray-100"
                        )}>
                          {tx.status}
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

        {/* Financial Insights Bento */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 space-y-8 relative overflow-hidden group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <PieChart size={20} />
              </div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Revenue Mix</h3>
            </div>

            <div className="space-y-6">
              {[
                { label: 'bKash Wallet', value: '42%', color: 'bg-[#FF6A00]' },
                { label: 'Cash on Delivery', value: '38%', color: 'bg-blue-500' },
                { label: 'Nagad Pay', value: '15%', color: 'bg-emerald-500' },
                { label: 'Others', value: '5%', color: 'bg-gray-300' },
              ].map((mix, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{mix.label}</span>
                    <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{mix.value}</span>
                  </div>
                  <div className="h-2 bg-gray-50 rounded-full overflow-hidden shadow-inner">
                    <div className={cn("h-full rounded-full transition-all duration-1000", mix.color)} style={{ width: mix.value }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-emerald-50 p-6 rounded-[32px] border border-emerald-100 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-[0.05] group-hover:scale-110 transition-transform duration-700">
                <ShieldCheck size={80} />
              </div>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Security Audit</p>
              <p className="text-[11px] font-bold text-emerald-700 leading-relaxed uppercase tracking-wider relative z-10">
                All transactions are verified and encrypted. No security anomalies detected in the last 24 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
