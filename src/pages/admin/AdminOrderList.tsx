import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Clock, 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  ChevronRight, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Download, 
  Trash2, 
  CheckSquare, 
  Square, 
  Printer, 
  ExternalLink, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  ArrowRight,
  Zap,
  FilterX,
  RefreshCw,
  Eye,
  Edit3,
  FileText,
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from '../../lib/api';
import { formatPrice, cn } from '@/src/lib/utils';

export default function AdminOrderList({ status }: { status?: string }) {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/admin/orders');
      if (Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setIsUpdating(orderId);
    try {
      await axios.post(`/api/admin/orders/${orderId}/status`, { status: newStatus });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update order status");
    } finally {
      setIsUpdating(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = !status || order.status.toLowerCase() === status.toLowerCase();
    const matchesSearch = 
      (order.orderNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customer?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customer?.phone || '').includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (s: string) => {
    switch (s.toLowerCase()) {
      case 'pending': return 'bg-orange-50 text-[#FF6A00] border-orange-100';
      case 'confirmed': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'processing': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'packed': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'shipped': return 'bg-violet-50 text-violet-600 border-violet-100';
      case 'out for delivery': return 'bg-cyan-50 text-cyan-600 border-cyan-100';
      case 'delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'cancelled': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'returned': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'refunded': return 'bg-gray-50 text-gray-600 border-gray-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const statusOptions = [
    'Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned', 'Refunded'
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
              Order <span className="text-[#FF6A00]">Manager</span>
            </h1>
          </div>
          <p className="text-sm text-gray-500 font-medium max-w-md">
            {status ? `Managing all ${status.toLowerCase()} orders.` : 'Track, manage and fulfill customer orders efficiently.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button 
            onClick={fetchOrders}
            className="bg-white text-gray-900 px-8 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest shadow-sm border border-gray-100 hover:shadow-md hover:bg-gray-50 transition-all flex items-center gap-3 group"
          >
            <RefreshCw size={18} className={cn(isLoading && "animate-spin")} />
            Refresh
          </button>
          <button className="bg-[#FF6A00] text-white px-8 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-orange-100 hover:bg-[#E65F00] hover:scale-105 transition-all flex items-center gap-3">
            <Printer size={18} />
            Print Batch
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[32px] border border-gray-50 shadow-sm flex items-center gap-6 group hover:shadow-md transition-all">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
            <ShoppingCart size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Orders</p>
            <h3 className="text-2xl font-black text-gray-900">{totalOrders}</h3>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-gray-50 shadow-sm flex items-center gap-6 group hover:shadow-md transition-all">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-inner">
            <Clock size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pending Orders</p>
            <h3 className="text-2xl font-black text-gray-900">{pendingOrders}</h3>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-gray-50 shadow-sm flex items-center gap-6 group hover:shadow-md transition-all">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center text-[#FF6A00] shadow-inner">
            <TrendingUp size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Revenue</p>
            <h3 className="text-2xl font-black text-gray-900">{formatPrice(totalRevenue)}</h3>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 flex flex-wrap items-center justify-between gap-8">
        <div className="flex items-center gap-6 flex-1 min-w-[300px]">
          <div className="relative flex-1 group">
            <input 
              type="text" 
              placeholder="Search by Order ID or Phone..." 
              className="pl-14 pr-6 py-5 bg-gray-50 border border-transparent rounded-[24px] text-sm font-medium outline-none focus:border-[#FF6A00] focus:bg-white transition-all w-full shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF6A00] transition-colors" size={24} />
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <select 
                className="appearance-none bg-gray-50 border border-transparent rounded-[20px] px-8 py-4 text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#FF6A00] focus:bg-white transition-all cursor-pointer pr-12 shadow-sm"
                onChange={(e) => navigate(e.target.value === 'all' ? '/admin/orders' : `/admin/orders/${e.target.value.toLowerCase().replace(/ /g, '-')}`)}
                value={status?.toLowerCase() || 'all'}
              >
                <option value="all">All Status</option>
                {statusOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <Filter className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
            <div className="relative">
              <input 
                type="date" 
                className="bg-gray-50 border border-transparent rounded-[20px] px-8 py-4 text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#FF6A00] focus:bg-white transition-all shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[40px] shadow-sm border border-gray-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-50">
                <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                <th className="px-6 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                <th className="px-6 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product</th>
                <th className="px-6 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment</th>
                <th className="px-6 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading && orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-10 py-32 text-center">
                    <div className="flex flex-col items-center gap-6">
                      <div className="w-16 h-16 border-4 border-orange-100 border-t-[#FF6A00] rounded-full animate-spin shadow-sm" />
                      <p className="text-sm font-black text-gray-900 uppercase tracking-widest">Syncing Orders</p>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-10 py-32 text-center">
                    <div className="flex flex-col items-center gap-8">
                      <div className="w-32 h-32 bg-gray-50 rounded-[48px] flex items-center justify-center text-gray-200 shadow-inner">
                        <ShoppingCart size={64} />
                      </div>
                      <p className="text-lg font-black text-gray-900 uppercase tracking-tight">No Data Available</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr 
                    key={order.id} 
                    className="hover:bg-gray-50/80 transition-all group"
                  >
                    <td className="px-10 py-8">
                      <span className="text-xs font-black text-gray-900 group-hover:text-[#FF6A00] transition-colors uppercase tracking-tight">#{order.orderNumber || order.id.slice(0, 8)}</span>
                    </td>
                    <td className="px-6 py-8">
                      <div>
                        <p className="text-xs font-black text-gray-900 uppercase tracking-tight">{order.customer?.name || order.customer?.fullName || 'Anonymous'}</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{order.customer?.phone || 'No Phone'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-8">
                      <div className="flex items-center gap-2">
                        <Package size={14} className="text-gray-400" />
                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{order.items?.length || 0} Items</span>
                      </div>
                    </td>
                    <td className="px-6 py-8">
                      <p className="text-sm font-black text-gray-900">{formatPrice(order.total || 0)}</p>
                    </td>
                    <td className="px-6 py-8">
                      <span className={cn(
                        "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm whitespace-nowrap",
                        getStatusColor(order.status)
                      )}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-8">
                      <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{order.paymentMethod || 'COD'}</span>
                    </td>
                    <td className="px-6 py-8">
                      <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => navigate(`/admin/orders/${order.id}`)}
                          className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-[#FF6A00] hover:bg-orange-50 rounded-xl transition-all shadow-sm hover:shadow-md bg-white border border-gray-100"
                          title="View Order"
                        >
                          <Eye size={18} />
                        </button>
                        <div className="relative group/status">
                          <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all shadow-sm hover:shadow-md bg-white border border-gray-100">
                            <Edit3 size={18} />
                          </button>
                          <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-50 py-4 hidden group-hover/status:block z-20">
                            {statusOptions.map(s => (
                              <button
                                key={s}
                                onClick={() => handleStatusUpdate(order.id, s)}
                                className={cn(
                                  "w-full text-left px-5 py-2 text-[9px] font-black uppercase tracking-widest transition-all",
                                  order.status === s ? "text-[#FF6A00] bg-orange-50" : "text-gray-600 hover:bg-gray-50"
                                )}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                        <button 
                          onClick={() => window.open(`/api/orders/${order.id}/invoice`, '_blank')}
                          className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all shadow-sm hover:shadow-md bg-white border border-gray-100"
                          title="Invoice"
                        >
                          <FileText size={18} />
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(order.id, 'Cancelled')}
                          className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all shadow-sm hover:shadow-md bg-white border border-gray-100"
                          title="Cancel Order"
                        >
                          <XCircle size={18} />
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
    </div>
  );
}
