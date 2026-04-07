import React, { useState } from 'react';
import { 
  Users, 
  BarChart3, 
  TrendingUp, 
  MousePointer2, 
  MapPin, 
  Smartphone, 
  Globe, 
  Download,
  Calendar,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingCart,
  UserCheck,
  Search,
  Facebook,
  Music2
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export default function CustomerTrackingAnalytics() {
  const [timeRange, setTimeRange] = useState('7d');

  const stats = [
    { label: 'Conversion Rate', value: '3.2%', change: '+0.4%', trend: 'up' },
    { label: 'Avg. Order Value', value: '৳1,450', change: '+৳120', trend: 'up' },
    { label: 'Revenue per Source', value: '৳45,200', change: '+12%', trend: 'up' },
    { label: 'Cart Abandonment', value: '64%', change: '-2%', trend: 'down' },
  ];

  const trafficSources = [
    { name: 'Facebook', value: 45, icon: Facebook, color: 'text-blue-600' },
    { name: 'Google', value: 30, icon: Search, color: 'text-orange-600' },
    { name: 'TikTok', value: 15, icon: Music2, color: 'text-black' },
    { name: 'Direct', value: 10, icon: Globe, color: 'text-gray-600' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
            <Users size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Customer Tracking & Analytics</h1>
            <p className="text-sm text-gray-500 font-medium">Understand behavior & improve marketing decisions</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
            {['24h', '7d', '30d', 'All'].map((range) => (
              <button 
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                  timeRange === range ? "bg-purple-600 text-white shadow-lg shadow-purple-200" : "text-gray-400 hover:text-gray-600"
                )}
              >
                {range}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-50 space-y-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
              <div className={cn(
                "flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg",
                stat.trend === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
              )}>
                {stat.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Funnel View */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] shadow-sm border border-gray-50 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp size={20} className="text-purple-600" />
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Conversion Funnel</h2>
            </div>
            <button className="text-[10px] font-bold text-purple-600 uppercase tracking-widest hover:underline">View Event Logs</button>
          </div>

          <div className="space-y-6">
            {[
              { label: 'Visitors', value: '12,450', percent: 100, color: 'bg-purple-100 text-purple-600' },
              { label: 'Add to Cart', value: '3,240', percent: 26, color: 'bg-indigo-100 text-indigo-600' },
              { label: 'Initiate Checkout', value: '1,120', percent: 9, color: 'bg-blue-100 text-blue-600' },
              { label: 'Purchase', value: '412', percent: 3.3, color: 'bg-emerald-100 text-emerald-600' },
            ].map((step, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest">
                  <span className="text-gray-500">{step.label}</span>
                  <span className="text-gray-900">{step.value} ({step.percent}%)</span>
                </div>
                <div className="h-3 bg-gray-50 rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full transition-all duration-1000", step.color.split(' ')[0])}
                    style={{ width: `${step.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50 space-y-8">
          <div className="flex items-center gap-2">
            <Globe size={20} className="text-purple-600" />
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Traffic Sources</h2>
          </div>
          <div className="space-y-6">
            {trafficSources.map((source, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center", source.color)}>
                    <source.icon size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{source.name}</p>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Source</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-gray-900">{source.value}%</p>
                  <div className="w-24 h-1.5 bg-gray-50 rounded-full mt-1 overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full", source.color.replace('text-', 'bg-'))}
                      style={{ width: `${source.value}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Tracking Table */}
      <div className="bg-white rounded-[32px] shadow-sm border border-gray-50 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone size={20} className="text-purple-600" />
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Recent Activity Tracking</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
              <Filter size={14} className="text-gray-400" />
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Filter Source</span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Customer ID</th>
                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Activity</th>
                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Device / Source</th>
                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Location</th>
                <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                { id: '#C-8921', activity: 'Purchase (৳1200)', device: 'Mobile', source: 'Facebook', location: 'Dhaka, BD', status: 'Returning' },
                { id: '#C-8922', activity: 'Add To Cart', device: 'Desktop', source: 'Google', location: 'Chittagong, BD', status: 'New' },
                { id: '#C-8923', activity: 'Viewed Product', device: 'Mobile', source: 'TikTok', location: 'Sylhet, BD', status: 'New' },
                { id: '#C-8924', activity: 'Login', device: 'Tablet', source: 'Direct', location: 'Rajshahi, BD', status: 'Returning' },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-4">
                    <span className="text-xs font-bold text-gray-900">{row.id}</span>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-xs font-medium text-gray-600">{row.activity}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-900">{row.device}</span>
                      <span className="text-[10px] font-medium text-gray-400 uppercase tracking-tighter">{row.source}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-2 text-gray-500">
                      <MapPin size={12} />
                      <span className="text-xs font-medium">{row.location}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg",
                      row.status === 'Returning' ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"
                    )}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
