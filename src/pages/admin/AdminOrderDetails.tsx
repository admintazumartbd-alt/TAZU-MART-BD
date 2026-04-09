import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../lib/api';
import { 
  ArrowLeft, 
  Printer, 
  Truck, 
  Package, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  Calendar, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical,
  ChevronRight,
  FileText,
  Save,
  Download,
  ExternalLink,
  ShieldCheck,
  CreditCard as PaymentIcon,
  Zap,
  ArrowRight,
  Box,
  ShoppingBag,
  Info
} from 'lucide-react';
import { cn, formatPrice } from '@/src/lib/utils';

export default function AdminOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`/api/admin/orders/${id}`);
        setOrder(response.data);
      } catch (error) {
        console.error("Failed to fetch order:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const updateStatus = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await axios.post(`/api/admin/orders/${id}/status`, { status: newStatus });
      setOrder({ ...order, status: newStatus });
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-8">
        <div className="w-20 h-20 border-4 border-orange-100 border-t-[#FF6A00] rounded-full animate-spin shadow-sm" />
        <div className="text-center">
          <p className="text-sm font-black text-gray-900 uppercase tracking-widest">Loading Order Details</p>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">Retrieving secure data...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-40 space-y-8 bg-white rounded-[40px] border border-gray-100 shadow-sm max-w-2xl mx-auto">
        <div className="w-24 h-24 bg-gray-50 rounded-[48px] flex items-center justify-center mx-auto text-gray-300 shadow-inner">
          <AlertCircle size={48} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Order Not Found</h2>
          <p className="text-sm text-gray-500 font-medium mt-2 leading-relaxed">The order you are looking for does not exist or has been removed from our records.</p>
        </div>
        <button 
          onClick={() => navigate('/admin/orders')}
          className="bg-[#FF6A00] text-white px-10 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-orange-100 hover:bg-[#E65F00] transition-all inline-flex items-center gap-3"
        >
          <ArrowLeft size={18} />
          Back to Orders
        </button>
      </div>
    );
  }

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
    <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/admin/orders')}
            className="w-14 h-14 flex items-center justify-center bg-white border border-gray-100 rounded-[20px] text-gray-400 hover:text-[#FF6A00] hover:bg-orange-50 transition-all shadow-sm group"
          >
            <ArrowLeft size={28} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none">Order #{order.orderNumber || order.id.slice(0, 8)}</h1>
              <span className={cn(
                "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm",
                getStatusColor(order.status)
              )}>
                {order.status}
              </span>
            </div>
            <div className="flex items-center gap-6 text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-3">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-[#FF6A00]" />
                {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-[#FF6A00]" />
                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => window.open(`/api/orders/${order.id}/invoice`, '_blank')}
            className="flex items-center gap-3 bg-white px-8 py-4 rounded-[20px] border border-gray-100 text-[10px] font-black text-gray-600 uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm group"
          >
            <Printer size={20} className="group-hover:scale-110 transition-transform" />
            Print Invoice
          </button>
          <div className="relative group">
            <button className="bg-[#FF6A00] text-white px-10 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-orange-100 hover:bg-[#E65F00] transition-all flex items-center gap-3 disabled:opacity-50" disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Update Status'}
              <ChevronRight size={20} className="rotate-90" />
            </button>
            <div className="absolute right-0 top-full mt-4 w-64 bg-white rounded-[32px] shadow-2xl border border-gray-50 py-6 hidden group-hover:block z-10 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="px-6 pb-4 mb-4 border-b border-gray-50">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Change Order Status</p>
              </div>
              <div className="space-y-1 max-h-80 overflow-y-auto custom-scrollbar">
                {statusOptions.map((s) => (
                  <button 
                    key={s}
                    onClick={() => updateStatus(s)}
                    className={cn(
                      "w-full text-left px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-between group/item",
                      order.status === s ? "text-[#FF6A00] bg-orange-50" : "text-gray-600 hover:bg-gray-50 hover:text-[#FF6A00]"
                    )}
                  >
                    {s}
                    {order.status === s && <CheckCircle size={16} />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Order Items & Timeline (8 cols) */}
        <div className="lg:col-span-8 space-y-10">
          {/* Order Items Bento */}
          <div className="bg-white rounded-[40px] shadow-sm border border-gray-50 overflow-hidden flex flex-col">
            <div className="p-10 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-orange-50 rounded-[20px] flex items-center justify-center text-[#FF6A00] shadow-inner">
                  <ShoppingBag size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Order Manifest</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1.5">{order.items.length} Products Included</p>
                </div>
              </div>
              <button className="text-[10px] font-black text-[#FF6A00] uppercase tracking-widest hover:underline flex items-center gap-2 group">
                <Download size={16} className="group-hover:translate-y-0.5 transition-transform" />
                Download PDF
              </button>
            </div>
            <div className="divide-y divide-gray-50">
              {order.items.map((item: any) => (
                <div key={item.id} className="p-10 flex items-center justify-between group hover:bg-gray-50/50 transition-all">
                  <div className="flex items-center gap-8">
                    <div className="w-24 h-24 rounded-[24px] overflow-hidden border border-gray-100 shrink-0 shadow-sm group-hover:shadow-md transition-all">
                      <img 
                        src={item.image || item.images?.[0] || '/default-product.png'} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        onError={(e) => (e.currentTarget.src = '/default-product.png')}
                      />
                    </div>
                    <div>
                      <p className="text-lg font-black text-gray-900 group-hover:text-[#FF6A00] transition-colors leading-tight uppercase tracking-tight">{item.name}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-[10px] font-black text-gray-500 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-widest">{item.variant || 'Standard'}</span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">SKU: {item.sku || 'N/A'}</span>
                      </div>
                      <p className="text-sm font-bold text-gray-500 mt-3">{formatPrice(item.price)} x {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-10 bg-gray-50/50 border-t border-gray-50 space-y-5">
              <div className="flex justify-between text-[11px] font-black text-gray-400 uppercase tracking-widest">
                <span>Subtotal</span>
                <span className="text-gray-900">{formatPrice(order.items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0))}</span>
              </div>
              <div className="flex justify-between text-[11px] font-black text-gray-400 uppercase tracking-widest">
                <span>Shipping Fee</span>
                <span className="text-emerald-500">{formatPrice(order.shippingFee || 0)}</span>
              </div>
              <div className="flex justify-between text-[11px] font-black text-gray-400 uppercase tracking-widest">
                <span>Discount Applied</span>
                <span className="text-rose-500">-{formatPrice(order.discount || 0)}</span>
              </div>
              <div className="flex justify-between pt-8 border-t border-gray-200">
                <div className="flex flex-col">
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Payable</span>
                  <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
                    <ShieldCheck size={14} />
                    Inclusive of VAT/Tax
                  </span>
                </div>
                <span className="text-4xl font-black text-[#FF6A00] leading-none tracking-tighter">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Timeline Bento */}
          <div className="bg-white rounded-[40px] shadow-sm border border-gray-50 overflow-hidden">
            <div className="p-10 border-b border-gray-50 flex items-center gap-5">
              <div className="w-14 h-14 bg-indigo-50 rounded-[20px] flex items-center justify-center text-indigo-600 shadow-inner">
                <Clock size={28} />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Order Timeline</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1.5">Activity & Status Updates</p>
              </div>
            </div>
            <div className="p-10 space-y-10">
              {(order.history || [
                { status: 'Order Placed', date: order.createdAt, note: 'Order successfully placed by customer via Mobile App.' }
              ]).map((item: any, idx: number) => (
                <div key={idx} className="relative flex gap-10">
                  {idx < (order.history?.length || 1) - 1 && (
                    <div className="absolute left-[17px] top-10 bottom-[-40px] w-1 bg-gray-100 rounded-full" />
                  )}
                  <div className="relative z-10 w-9 h-9 rounded-[14px] bg-white border-4 border-orange-50 flex items-center justify-center shrink-0 shadow-sm">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF6A00]" />
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-black text-gray-900 uppercase tracking-widest">{item.status}</p>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(item.date).toLocaleString()}</span>
                    </div>
                    <div className="bg-gray-50 p-5 rounded-[24px] border border-transparent hover:border-gray-100 transition-all shadow-inner">
                      <p className="text-sm text-gray-500 font-medium leading-relaxed">{item.note}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Customer & Shipping (4 cols) */}
        <div className="lg:col-span-4 space-y-10">
          {/* Customer Profile Bento */}
          <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-50 space-y-8">
            <div className="flex items-center gap-5 pb-8 border-b border-gray-50">
              <div className="w-14 h-14 bg-gray-50 rounded-[20px] flex items-center justify-center text-gray-400 shadow-inner">
                <User size={28} />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Customer</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1.5">Profile & Contact</p>
              </div>
            </div>
            <div className="space-y-8">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-[28px] bg-orange-50 flex items-center justify-center text-[#FF6A00] text-3xl font-black shadow-inner">
                  {order.customer?.fullName?.charAt(0)}
                </div>
                <div>
                  <p className="text-lg font-black text-gray-900 uppercase tracking-tight leading-none">{order.customer?.fullName}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">ID: #{order.userId?.slice(0, 8)}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-[20px] border border-transparent hover:border-orange-100 transition-all group">
                  <Mail size={20} className="text-gray-400 group-hover:text-[#FF6A00]" />
                  <span className="text-xs font-bold text-gray-600 truncate">{order.customer?.email || 'No Email Provided'}</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-[20px] border border-transparent hover:border-orange-100 transition-all group">
                  <Phone size={20} className="text-gray-400 group-hover:text-[#FF6A00]" />
                  <span className="text-xs font-bold text-gray-600">{order.customer?.phone}</span>
                </div>
              </div>
              <button className="w-full py-5 bg-white border border-gray-100 rounded-[20px] text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-[#FF6A00] hover:text-white hover:border-transparent transition-all shadow-sm hover:shadow-xl hover:shadow-orange-100 flex items-center justify-center gap-3">
                <ExternalLink size={18} />
                Full Profile
              </button>
            </div>
          </div>

          {/* Shipping Address Bento */}
          <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-50 space-y-8">
            <div className="flex items-center gap-5 pb-8 border-b border-gray-50">
              <div className="w-14 h-14 bg-gray-50 rounded-[20px] flex items-center justify-center text-gray-400 shadow-inner">
                <MapPin size={28} />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Shipping</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1.5">Delivery Location</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="p-8 bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-100 hover:border-orange-200 hover:bg-orange-50/30 transition-all group relative overflow-hidden">
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-200 group-hover:text-orange-200 transition-colors">
                  <MapPin size={24} />
                </div>
                <p className="text-sm font-bold text-gray-700 leading-relaxed uppercase tracking-widest relative z-10">
                  {order.customer?.address}
                </p>
              </div>
              <div className="flex items-center gap-4 p-5 bg-emerald-50 rounded-[24px] border border-emerald-100 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-emerald-600 shadow-sm">
                  <Truck size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Standard Delivery</p>
                  <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mt-1">Est. 2-3 Business Days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details Bento */}
          <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-50 space-y-8">
            <div className="flex items-center gap-5 pb-8 border-b border-gray-50">
              <div className="w-14 h-14 bg-gray-50 rounded-[20px] flex items-center justify-center text-gray-400 shadow-inner">
                <PaymentIcon size={28} />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Payment</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1.5">Transaction Details</p>
              </div>
            </div>
            <div className="space-y-5">
              <div className="flex items-center justify-between p-5 bg-gray-50 rounded-[20px] shadow-inner">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Method</span>
                <span className="text-xs font-black text-gray-900 uppercase tracking-tight">{order.paymentMethod}</span>
              </div>
              <div className="flex items-center justify-between p-5 bg-gray-50 rounded-[20px] shadow-inner">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</span>
                <span className={cn(
                  "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm border",
                  order.paymentStatus === 'Paid' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
                )}>
                  {order.paymentStatus}
                </span>
              </div>
              {order.transactionId && (
                <div className="p-6 bg-gray-900 rounded-[28px] border border-gray-800 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <ShieldCheck size={64} className="text-white" />
                  </div>
                  <div className="flex items-center gap-3 mb-3 relative z-10">
                    <ShieldCheck size={18} className="text-emerald-500" />
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Verified Transaction</p>
                  </div>
                  <p className="text-xs font-black text-white font-mono tracking-widest break-all relative z-10">{order.transactionId}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
