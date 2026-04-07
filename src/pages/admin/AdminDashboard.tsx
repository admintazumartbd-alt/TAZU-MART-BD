import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  TrendingUp, 
  ShoppingCart, 
  ShoppingBag,
  Users, 
  Package, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreVertical,
  ChevronRight,
  Calendar,
  Search,
  Filter,
  Download,
  Printer,
  ExternalLink,
  ArrowRight,
  Zap,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  X,
  Tag,
  BarChart3
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { cn, formatPrice } from '@/src/lib/utils';

const data = [
  { name: 'Mon', revenue: 4000, orders: 240 },
  { name: 'Tue', revenue: 3000, orders: 198 },
  { name: 'Wed', revenue: 2000, orders: 150 },
  { name: 'Thu', revenue: 2780, orders: 190 },
  { name: 'Fri', revenue: 1890, orders: 120 },
  { name: 'Sat', revenue: 2390, orders: 170 },
  { name: 'Sun', revenue: 3490, orders: 210 },
];

const topProducts = [
  { name: 'Premium Cotton T-Shirt', sales: 400, color: '#FF6A00', image: 'https://picsum.photos/seed/tshirt/100/100' },
  { name: 'Slim Fit Denim Jeans', sales: 300, color: '#FF8C00', image: 'https://picsum.photos/seed/jeans/100/100' },
  { name: 'Wireless Bluetooth Earbuds', sales: 200, color: '#FFA500', image: 'https://picsum.photos/seed/earbuds/100/100' },
  { name: 'Leather Wallet', sales: 150, color: '#FFC107', image: 'https://picsum.photos/seed/wallet/100/100' },
  { name: 'Designer Sunglasses', sales: 100, color: '#FFEB3B', image: 'https://picsum.photos/seed/sunglasses/100/100' },
];

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ElementType;
  color: string;
  onClick?: () => void;
  key?: string | number;
}

const StatCard = ({ title, value, change, isPositive, icon: Icon, color, onClick }: StatCardProps) => (
  <div 
    onClick={onClick}
    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group flex items-center gap-4"
  >
    <div className={cn("w-14 h-14 rounded-full flex items-center justify-center shrink-0", color.replace('bg-', 'bg-opacity-10 text-').replace('text-', 'text-'))}>
      <Icon size={24} className={cn(color.replace('bg-', 'text-'))} />
    </div>
    <div className="flex-1">
      <h3 className="text-2xl font-bold text-gray-900 leading-none">{value}</h3>
      <p className="text-sm text-gray-500 font-medium mt-1">{title}</p>
      <div className={cn(
        "flex items-center gap-1 text-xs font-bold mt-2",
        isPositive ? "text-emerald-600" : "text-rose-600"
      )}>
        {isPositive ? <TrendingUp size={14} /> : <ArrowDownRight size={14} />}
        {change} <span className="text-gray-400 font-normal ml-1">vs last month</span>
      </div>
    </div>
  </div>
);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState<{ firestore: string } | null>(null);
  const [selectedStat, setSelectedStat] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7' | '30' | '90'>('30');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [healthRes, statsRes] = await Promise.all([
          axios.get('/api/health'),
          axios.get('/api/admin/profit-stats')
        ]);
        setSystemStatus(healthRes.data);
        setStats(statsRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Orders', value: stats?.totalOrders?.toLocaleString() || '0', change: '+8.2%', isPositive: true, icon: ShoppingCart, color: 'bg-[#FF6A00]' },
    { title: 'Pending Orders', value: stats?.pendingOrders?.toLocaleString() || '0', change: '-2.4%', isPositive: false, icon: Clock, color: 'bg-amber-500' },
    { title: 'Today Sales', value: formatPrice(stats?.todaySales || 0), change: '+12.5%', isPositive: true, icon: TrendingUp, color: 'bg-emerald-500' },
    { title: 'Today Profit', value: formatPrice(stats?.todayProfit || 0), change: '+15.4%', isPositive: true, icon: Zap, color: 'bg-blue-500' },
  ];

  const chartData = stats?.salesData ? Object.entries(stats.salesData).map(([name, revenue]) => ({ name, revenue })) : data;

  const orderStatusBreakdown = [
    { label: 'Pending', count: 42, color: 'bg-orange-500' },
    { label: 'Confirmed', count: 28, color: 'bg-blue-500' },
    { label: 'Processing', count: 15, color: 'bg-indigo-500' },
    { label: 'Shipped', count: 64, color: 'bg-violet-500' },
    { label: 'Delivered', count: 892, color: 'bg-emerald-500' },
  ];

  const recentOrders = [
    { id: '#ORD-7234', customer: 'Rahat Khan', items: 3, total: '৳ 4,200', status: 'Pending', date: '2 mins ago', image: 'https://picsum.photos/seed/user1/100/100' },
    { id: '#ORD-7233', customer: 'Sumi Akter', items: 1, total: '৳ 1,500', status: 'Processing', date: '15 mins ago', image: 'https://picsum.photos/seed/user2/100/100' },
    { id: '#ORD-7232', customer: 'Jasim Uddin', items: 2, total: '৳ 2,800', status: 'Delivered', date: '1 hour ago', image: 'https://picsum.photos/seed/user3/100/100' },
    { id: '#ORD-7231', customer: 'Nila Islam', items: 4, total: '৳ 6,500', status: 'Cancelled', date: '3 hours ago', image: 'https://picsum.photos/seed/user4/100/100' },
  ];

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome back, here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          {systemStatus && (
            <div className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm transition-all",
              systemStatus.firestore === 'connected' 
                ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                : "bg-amber-50 text-amber-600 border-amber-100"
            )}>
              <div className={cn("w-2 h-2 rounded-full animate-pulse", systemStatus.firestore === 'connected' ? "bg-emerald-500" : "bg-amber-500")} />
              {systemStatus.firestore === 'connected' ? 'Live Database' : 'Demo Mode'}
            </div>
          )}
          <button className="bg-white text-gray-600 px-4 py-2 rounded-xl text-sm font-bold border border-gray-200 hover:bg-gray-50 transition-all flex items-center gap-2">
            <Calendar size={18} />
            Oct 12, 2023 - Oct 18, 2023
          </button>
          <button className="bg-[#FF6A00] text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-orange-100 hover:bg-[#E65F00] transition-all">
            Export Data
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <StatCard 
            key={stat.title} 
            {...stat}
          />
        ))}
      </div>

      {/* Main Section: Chart + Mini Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-gray-900">Revenue & Orders</h3>
            <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
              {['7D', '30D', '90D'].map((range) => (
                <button 
                  key={range}
                  onClick={() => setTimeRange(range as any)}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                    timeRange === range ? "bg-white text-[#FF6A00] shadow-sm" : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6A00" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#FF6A00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fontWeight: 500, fill: '#9ca3af' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fontWeight: 500, fill: '#9ca3af' }}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#FF6A00" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fillOpacity={0}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mini Stats Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {[
            { label: 'Today Sales', value: '৳ 12,430', change: '+5.2%', icon: Zap, color: 'text-amber-500 bg-amber-50' },
            { label: 'This Week', value: '৳ 84,200', change: '+12.1%', icon: TrendingUp, color: 'text-emerald-500 bg-emerald-50' },
            { label: 'This Month', value: '৳ 342,000', change: '+8.4%', icon: ShoppingBag, color: 'text-blue-500 bg-blue-50' },
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", item.color)}>
                  <item.icon size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.label}</p>
                  <h4 className="text-xl font-bold text-gray-900 mt-1">{item.value}</h4>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600">{item.change}</span>
            </div>
          ))}

          {/* Order Status Breakdown */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 mb-6 flex items-center justify-between">
              Order Status
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Real-time</span>
            </h3>
            <div className="space-y-4">
              {orderStatusBreakdown.map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-gray-500">{item.label}</span>
                    <span className="text-gray-900">{item.count}</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full transition-all duration-1000", item.color)} 
                      style={{ width: `${(item.count / 1041) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-50">
              <button 
                onClick={() => navigate('/admin/orders')}
                className="w-full py-3 bg-orange-50 text-[#FF6A00] rounded-xl text-xs font-bold hover:bg-orange-100 transition-all flex items-center justify-center gap-2"
              >
                Manage All Orders
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => navigate('/admin/products/add')}
                className="p-4 bg-gray-50 rounded-xl border border-transparent hover:border-orange-100 hover:bg-white transition-all text-center group"
              >
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-400 group-hover:text-[#FF6A00] shadow-sm mx-auto mb-2">
                  <Package size={20} />
                </div>
                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tight">Add Product</span>
              </button>
              <button 
                onClick={() => navigate('/admin/marketing/coupons')}
                className="p-4 bg-gray-50 rounded-xl border border-transparent hover:border-orange-100 hover:bg-white transition-all text-center group"
              >
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-400 group-hover:text-[#FF6A00] shadow-sm mx-auto mb-2">
                  <Tag size={20} />
                </div>
                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tight">New Coupon</span>
              </button>
              <button 
                onClick={() => navigate('/admin/orders/pending')}
                className="p-4 bg-gray-50 rounded-xl border border-transparent hover:border-orange-100 hover:bg-white transition-all text-center group"
              >
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-400 group-hover:text-[#FF6A00] shadow-sm mx-auto mb-2">
                  <Clock size={20} />
                </div>
                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tight">Pending</span>
              </button>
              <button 
                onClick={() => navigate('/admin/analytics/sales')}
                className="p-4 bg-gray-50 rounded-xl border border-transparent hover:border-orange-100 hover:bg-white transition-all text-center group"
              >
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-400 group-hover:text-[#FF6A00] shadow-sm mx-auto mb-2">
                  <BarChart3 size={20} />
                </div>
                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tight">Reports</span>
              </button>
            </div>
          </div>

          {/* Customer Section Mini */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Customer Overview</h3>
            <div className="space-y-4">
              {[
                { label: 'New Customers', value: '124', color: 'bg-blue-500' },
                { label: 'Active Users', value: '1,432', color: 'bg-emerald-500' },
                { label: 'Returning', value: '842', color: 'bg-amber-500' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", item.color)} />
                    <span className="text-xs font-medium text-gray-500">{item.label}</span>
                  </div>
                  <span className="text-xs font-bold text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-50">
              <button className="w-full py-2 text-xs font-bold text-[#FF6A00] hover:underline">View All Customers</button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Orders + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
            <button 
              onClick={() => navigate('/admin/orders')}
              className="text-xs font-bold text-[#FF6A00] hover:underline"
            >
              View All
            </button>
          </div>
          
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order) => (
                  <tr 
                    key={order.id} 
                    onClick={() => navigate(`/admin/orders/${order.id.replace('#', '')}`)}
                    className="hover:bg-gray-50/50 transition-all cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-gray-900 group-hover:text-[#FF6A00]">{order.id}</span>
                      <p className="text-[10px] text-gray-400 font-medium mt-0.5">{order.date}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={order.image} alt={order.customer} className="w-8 h-8 rounded-full object-cover" />
                        <span className="text-sm font-medium text-gray-700">{order.customer}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        order.status === 'Pending' && "bg-orange-50 text-orange-600",
                        order.status === 'Processing' && "bg-blue-50 text-blue-600",
                        order.status === 'Delivered' && "bg-emerald-50 text-emerald-600",
                        order.status === 'Cancelled' && "bg-rose-50 text-rose-600",
                      )}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-gray-900">{order.total}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden p-4 space-y-4">
            {recentOrders.map((order) => (
              <div 
                key={order.id}
                onClick={() => navigate(`/admin/orders/${order.id.replace('#', '')}`)}
                className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-bold text-gray-900">{order.id}</p>
                  <p className="text-xs text-gray-500 mt-1">{order.customer}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{order.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{order.total}</p>
                  <span className={cn(
                    "inline-block mt-2 px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider",
                    order.status === 'Pending' && "bg-orange-50 text-orange-600",
                    order.status === 'Processing' && "bg-blue-50 text-blue-600",
                    order.status === 'Delivered' && "bg-emerald-50 text-emerald-600",
                    order.status === 'Cancelled' && "bg-rose-50 text-rose-600",
                  )}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Top Products</h3>
            <button className="text-xs font-bold text-[#FF6A00] hover:underline">View All</button>
          </div>
          <div className="flex lg:flex-col gap-6 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 no-scrollbar">
            {topProducts.map((product, idx) => (
              <div key={idx} className="flex items-center justify-between group cursor-pointer min-w-[240px] lg:min-w-0 bg-gray-50 lg:bg-transparent p-3 lg:p-0 rounded-xl lg:rounded-none border border-gray-100 lg:border-none">
                <div className="flex items-center gap-4">
                  <img src={product.image} alt={product.name} className="w-12 h-12 rounded-xl object-cover shadow-sm group-hover:scale-110 transition-transform duration-500" />
                  <div>
                    <p className="text-sm font-bold text-gray-900 group-hover:text-[#FF6A00] transition-colors line-clamp-1">{product.name}</p>
                    <p className="text-xs text-gray-400 font-medium mt-1">{product.sales} Sold • ৳ {product.sales * 1200}</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-[#FF6A00] group-hover:translate-x-1 transition-all hidden lg:block" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stat Detail Modal */}
      {selectedStat && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-3xl rounded-[40px] p-12 shadow-2xl animate-in zoom-in slide-in-from-bottom-8 duration-500 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-[#FF6A00]" />
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">{selectedStat} Analysis</h2>
                <p className="text-sm text-gray-500 font-medium mt-1">Deep dive into your store's {selectedStat.toLowerCase()} performance.</p>
              </div>
              <button 
                onClick={() => setSelectedStat(null)} 
                className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900"
              >
                <X size={28} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {[
                { label: 'Current Period', value: '৳ 42,300', trend: '+12%', up: true },
                { label: 'Previous Period', value: '৳ 38,100', trend: '-5%', up: false },
                { label: 'Projected Growth', value: '৳ 48,000', trend: '+15%', up: true },
              ].map((item, i) => (
                <div key={i} className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{item.label}</p>
                  <div className="flex items-end justify-between">
                    <h4 className="text-xl font-black text-gray-900">{item.value}</h4>
                    <span className={cn(
                      "text-[10px] font-black uppercase px-2 py-1 rounded-lg",
                      item.up ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                    )}>
                      {item.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-72 bg-gray-50 rounded-[32px] flex flex-col items-center justify-center border-2 border-dashed border-gray-200 p-10 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-gray-300 mb-4">
                <TrendingUp size={32} />
              </div>
              <p className="text-sm font-black text-gray-900 uppercase tracking-widest">Detailed Visualization</p>
              <p className="text-xs text-gray-400 font-medium mt-2 max-w-xs">Interactive charts and granular data points will be rendered here in the production environment.</p>
            </div>

            <div className="flex justify-end mt-10 gap-4">
              <button 
                onClick={() => setSelectedStat(null)}
                className="px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-100 transition-all"
              >
                Dismiss
              </button>
              <button 
                className="bg-[#FF6A00] text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-orange-100 hover:bg-[#E65F00] hover:scale-105 transition-all"
              >
                Download Full Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
