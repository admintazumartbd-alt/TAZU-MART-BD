import React, { useState, useEffect } from 'react';
import { useActivity, ActivityLog } from '@/src/context/ActivityContext';
import { useAuth } from '@/src/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Users, ShoppingCart, CreditCard, LogIn, 
  ArrowUpRight, ArrowDownRight, Search, Filter, 
  User as UserIcon, Clock, Smartphone, Monitor 
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { format } from 'date-fns';

export default function AdminCustomerMonitoring() {
  const { getActivities } = useActivity();
  const { user } = useAuth();
  const adminEmails = ['admin.tazumart060@gmail.com', 'admin.tazumartbd@gmail.com'];
  const isAdmin = adminEmails.includes(user?.email.toLowerCase() || '');
  const navigate = useNavigate();
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    setActivities(getActivities().reverse());
  }, [isAdmin, navigate, getActivities]);

  if (!isAdmin) return null;

  const stats = [
    { label: 'Total Logins', value: activities.filter(a => a.type === 'LOGIN').length, icon: LogIn, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Cart Additions', value: activities.filter(a => a.type === 'ADD_TO_CART').length, icon: ShoppingCart, color: 'text-pink-600', bg: 'bg-pink-50' },
    { label: 'Checkout Starts', value: activities.filter(a => a.type === 'START_CHECKOUT').length, icon: CreditCard, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'New Registrations', value: activities.filter(a => a.type === 'REGISTRATION').length, icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  const filteredActivities = activities.filter(a => {
    const matchesSearch = a.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         a.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'ALL' || a.type === filter;
    return matchesSearch && matchesFilter;
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'LOGIN': return <LogIn size={16} className="text-blue-500" />;
      case 'REGISTRATION': return <Users size={16} className="text-green-500" />;
      case 'ADD_TO_CART': return <ShoppingCart size={16} className="text-pink-500" />;
      case 'START_CHECKOUT': return <CreditCard size={16} className="text-amber-500" />;
      default: return <Clock size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 pb-32 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#111111]">Customer Monitoring</h1>
          <p className="text-gray-500">Track real-time customer behavior and activity</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search customers..."
              className="pl-10 pr-4 py-2 bg-white border rounded-xl focus:outline-none focus:border-[#E91E63] w-full md:w-64"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-2 bg-white border rounded-xl focus:outline-none focus:border-[#E91E63]"
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="ALL">All Activity</option>
            <option value="LOGIN">Logins</option>
            <option value="REGISTRATION">Registrations</option>
            <option value="ADD_TO_CART">Cart Activity</option>
            <option value="START_CHECKOUT">Checkout Activity</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-2">
            <div className={cn("p-2 rounded-xl w-fit", stat.bg, stat.color)}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#111111]">{stat.value}</p>
              <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Activity Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="font-bold text-[#111111]">Live Activity Log</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Event</th>
                <th className="px-6 py-4">Details</th>
                <th className="px-6 py-4">Device</th>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredActivities.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-all text-sm">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                        <UserIcon size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-[#111111]">{log.userName}</p>
                        <p className="text-[10px] text-gray-400 uppercase">{log.userId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getActivityIcon(log.type)}
                      <span className="font-medium">{log.type.replace(/_/g, ' ')}</span>
                      {log.method && (
                        <span className={cn(
                          "px-1.5 py-0.5 text-[9px] font-bold rounded uppercase tracking-wider",
                          log.method === 'GOOGLE' ? "bg-red-50 text-red-600 border border-red-100" :
                          log.method === 'FACEBOOK' ? "bg-blue-50 text-blue-600 border border-blue-100" :
                          "bg-gray-50 text-gray-600 border border-gray-100"
                        )}>
                          {log.method}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-500 text-xs">
                      {log.details ? JSON.stringify(log.details).substring(0, 30) + '...' : 'No extra details'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-gray-400">
                      {log.device === 'Mobile' ? <Smartphone size={14} /> : <Monitor size={14} />}
                      <span className="text-xs">{log.device}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {format(new Date(log.timestamp), 'MMM d, HH:mm')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[#E91E63] font-bold text-xs hover:underline">View Profile</button>
                  </td>
                </tr>
              ))}
              {filteredActivities.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    No activities found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
