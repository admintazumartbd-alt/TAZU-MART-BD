import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  Download, 
  Filter, 
  ChevronDown, 
  PieChart, 
  Activity, 
  Zap, 
  Target, 
  MousePointer2,
  Globe,
  Smartphone,
  Monitor,
  Clock,
  RefreshCw
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Cell,
  PieChart as RePieChart,
  Pie
} from 'recharts';
import { cn } from '@/src/lib/utils';
import axios from '../../lib/api';

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/admin/profit-stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch analytics stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [timeRange]);

  const chartData = stats?.chartData || [
    { name: 'Mon', revenue: 4000, orders: 24, conversion: 2.4 },
    { name: 'Tue', revenue: 3000, orders: 18, conversion: 1.8 },
    { name: 'Wed', revenue: 2000, orders: 12, conversion: 1.2 },
    { name: 'Thu', revenue: 2780, orders: 20, conversion: 2.0 },
    { name: 'Fri', revenue: 1890, orders: 15, conversion: 1.5 },
    { name: 'Sat', revenue: 2390, orders: 22, conversion: 2.2 },
    { name: 'Sun', revenue: 3490, orders: 28, conversion: 2.8 },
  ];

  const categoryData = [
    { name: 'Saree', value: 400, color: '#FF6A00' },
    { name: 'Punjabi', value: 300, color: '#3B82F6' },
    { name: 'T-Shirts', value: 300, color: '#10B981' },
    { name: 'Accessories', value: 200, color: '#8B5CF6' },
  ];

  if (loading && !stats) {
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
              <BarChart3 size={24} />
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">
              Insight <span className="text-[#FF6A00]">Intelligence</span>
            </h1>
          </div>
          <p className="text-sm text-gray-500 font-medium max-w-md">
            Deep dive into your store's performance metrics, customer behavior, and growth trends.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="bg-white p-1.5 rounded-[24px] shadow-sm border border-gray-100 flex items-center gap-1">
            {['24h', '7d', '30d', '90d', '1y'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  "px-6 py-2.5 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all",
                  timeRange === range ? "bg-[#FF6A00] text-white shadow-lg shadow-orange-100" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                )}
              >
                {range}
              </button>
            ))}
          </div>
          <button className="bg-gray-900 text-white px-8 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-black/10 hover:bg-black transition-all flex items-center gap-3">
            <Download size={18} />
            Export Report
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Total Revenue', value: `৳ ${stats?.revenue?.toLocaleString() || '0'}`, icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50', trend: `+${stats?.growth || '0'}%` },
          { label: 'Active Sessions', value: stats?.customers?.toLocaleString() || '0', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+8.2%' },
          { label: 'Conversion Rate', value: '3.42%', icon: Target, color: 'text-[#FF6A00]', bg: 'bg-orange-50', trend: '+0.5%' },
          { label: 'Avg. Order Value', value: '৳ 2,150', icon: ShoppingBag, color: 'text-purple-600', bg: 'bg-purple-50', trend: '-1.2%' },
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Revenue Analytics Bento */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[48px] shadow-sm border border-gray-50 space-y-10 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-[#FF6A00] shadow-sm">
                <TrendingUp size={24} />
              </div>
              <div>
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Revenue Growth</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Daily revenue performance</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF6A00]" />
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-200" />
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Previous</span>
              </div>
            </div>
          </div>

          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6A00" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#FF6A00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 900 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 900 }}
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '24px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                    padding: '20px'
                  }}
                  itemStyle={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#FF6A00" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution Bento */}
        <div className="lg:col-span-1 bg-white p-10 rounded-[48px] shadow-sm border border-gray-50 space-y-10 relative overflow-hidden group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 shadow-sm">
              <PieChart size={24} />
            </div>
            <div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Sales by Category</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Revenue distribution</p>
            </div>
          </div>

          <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-gray-900 tracking-tight leading-none">100%</span>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Total Sales</span>
            </div>
          </div>

          <div className="space-y-4">
            {categoryData.map((cat, i) => (
              <div key={i} className="flex items-center justify-between group/item">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest group-hover/item:text-gray-900 transition-colors">{cat.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">৳ {cat.value}k</span>
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">+4.2%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Behavior Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Device Distribution */}
        <div className="bg-white p-10 rounded-[48px] shadow-sm border border-gray-50 space-y-8 group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
              <Smartphone size={24} />
            </div>
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Device Traffic</h3>
          </div>
          <div className="space-y-6">
            {[
              { label: 'Mobile App', value: '64%', icon: Smartphone, color: 'bg-orange-500' },
              { label: 'Mobile Web', value: '28%', icon: Globe, color: 'bg-blue-500' },
              { label: 'Desktop', value: '8%', icon: Monitor, color: 'bg-emerald-500' },
            ].map((device, i) => (
              <div key={i} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <device.icon size={16} className="text-gray-400" />
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{device.label}</span>
                  </div>
                  <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{device.value}</span>
                </div>
                <div className="h-3 bg-gray-50 rounded-full overflow-hidden shadow-inner">
                  <div className={cn("h-full rounded-full transition-all duration-1000", device.color)} style={{ width: device.value }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Peak Hours */}
        <div className="bg-white p-10 rounded-[48px] shadow-sm border border-gray-50 space-y-8 group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 shadow-sm">
              <Clock size={24} />
            </div>
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Peak Activity</h3>
          </div>
          <div className="space-y-6">
            {[
              { label: 'Morning (8AM - 12PM)', value: '18%', color: 'bg-orange-200' },
              { label: 'Afternoon (12PM - 4PM)', value: '24%', color: 'bg-orange-300' },
              { label: 'Evening (4PM - 10PM)', value: '42%', color: 'bg-[#FF6A00]' },
              { label: 'Night (10PM - 8AM)', value: '16%', color: 'bg-orange-100' },
            ].map((peak, i) => (
              <div key={i} className="flex items-center justify-between group/item">
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest group-hover/item:text-gray-900 transition-colors">{peak.label}</span>
                <div className="flex items-center gap-4">
                  <div className={cn("w-24 h-2 rounded-full overflow-hidden bg-gray-50 shadow-inner")}>
                    <div className={cn("h-full rounded-full transition-all duration-1000", peak.color)} style={{ width: peak.value }} />
                  </div>
                  <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest w-8">{peak.value}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-rose-50 p-6 rounded-[32px] border border-rose-100">
            <p className="text-[9px] font-black text-rose-600 uppercase tracking-widest mb-1">Insight</p>
            <p className="text-[10px] font-bold text-rose-800 leading-relaxed uppercase tracking-wider">
              Evening hours show the highest conversion rate. Consider scheduling flash deals between 7PM and 9PM.
            </p>
          </div>
        </div>

        {/* Real-time Activity */}
        <div className="bg-white p-10 rounded-[48px] shadow-sm border border-gray-50 space-y-8 group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
            <Zap size={120} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                <Zap size={24} />
              </div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Live Pulse</h3>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Live</span>
            </div>
          </div>
          <div className="space-y-6">
            <div className="text-center py-6">
              <h4 className="text-5xl font-black text-gray-900 tracking-tighter leading-none">142</h4>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-3">Customers Online Now</p>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Viewing Products', value: 84 },
                { label: 'In Checkout', value: 12 },
                { label: 'Adding to Cart', value: 46 },
              ].map((live, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-[20px] border border-transparent hover:border-emerald-100 transition-all shadow-inner">
                  <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{live.label}</span>
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{live.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
