import React, { useState, useEffect } from 'react';
import { useCart } from '@/src/context/CartContext';
import { formatPrice, cn } from '@/src/lib/utils';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  ChevronRight, 
  CheckCircle2, 
  Download, 
  Package, 
  MapPin, 
  User, 
  Phone, 
  ShoppingCart, 
  Printer, 
  Mail, 
  Smartphone, 
  FileText, 
  ArrowLeft,
  Info,
  Edit3,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useActivity } from '@/src/context/ActivityContext';
import api from '@/src/lib/api';
import { motion, AnimatePresence } from 'motion/react';
import { BD_LOCATIONS } from '@/src/data/bd-locations';

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cart, totalPrice, clearCart } = useCart();
  const { logActivity } = useActivity();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const productId = searchParams.get('productId');
  const initialQuantity = parseInt(searchParams.get('quantity') || '1');
  const selectedColor = searchParams.get('color');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<{ id: string; orderNumber: string; total: number; method: string } | null>(null);
  const [directProduct, setDirectProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(!!productId);
  const [addressMode, setAddressMode] = useState<'dropdown' | 'manual'>('dropdown');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    altPhone: '',
    division: '',
    district: '',
    upazila: '',
    address: '',
    note: '',
    area: 'inside', // inside/outside city
    paymentMethod: 'COD'
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        phone: user.phone || prev.phone,
        email: user.email || prev.email,
        address: user.address || prev.address
      }));
    }
  }, [user]);

  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        try {
          const response = await api.get(`/api/products/${productId}`);
          if (response.data) {
            setDirectProduct(response.data);
          } else {
            const allResponse = await api.get('/api/admin/products');
            const found = allResponse.data.find((p: any) => p.id === productId);
            if (found) setDirectProduct(found);
          }
        } catch (error) {
          console.error("Failed to fetch product:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProduct();
    }
  }, [productId]);

  const checkoutItems = directProduct 
    ? [{ 
        productId: directProduct.id, 
        name: directProduct.name, 
        price: directProduct.price, 
        quantity: initialQuantity, 
        color: selectedColor || undefined,
        image: directProduct.image || directProduct.images?.[0]
      }] 
    : cart.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      }));
  
  const subtotal = directProduct 
    ? directProduct.price * initialQuantity 
    : totalPrice;

  const deliveryFee = formData.area === 'inside' ? 60 : 120;
  const finalTotal = subtotal + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.name.trim()) {
      alert("Please enter your Name");
      return;
    }
    if (formData.phone.length < 11) {
      alert("Please enter your Mobile Number");
      return;
    }
    if (!formData.address.trim()) {
      alert("Please enter your Address");
      return;
    }

    setIsSubmitting(true);
    try {
      const orderResponse = await api.post('/api/orders/create', {
        customer: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          altPhone: formData.altPhone,
          address: formData.address,
          division: formData.division,
          district: formData.district,
          upazila: formData.upazila,
          note: formData.note
        },
        items: checkoutItems,
        subtotal,
        deliveryFee,
        total: finalTotal,
        paymentMethod: formData.paymentMethod,
      });

      const { orderId, orderNumber } = orderResponse.data;

      setOrderSuccess({ id: orderId, orderNumber, total: finalTotal, method: formData.paymentMethod });
      logActivity('ORDER_PLACED', { orderId, total: finalTotal, method: formData.paymentMethod });
      if (!directProduct) clearCart();

    } catch (error: any) {
      alert(error.response?.data?.error || "Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-orange-100 border-t-[#FF6A00] rounded-full animate-spin" />
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Securing your order...</p>
        </div>
      </div>
    );
  }

  if (checkoutItems.length === 0 && !orderSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
          <ShoppingCart size={48} className="text-gray-300" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Your cart is empty</h2>
          <p className="text-gray-500">Add some amazing products to your cart before checking out.</p>
        </div>
        <Link to="/" className="px-8 py-3 bg-[#FF6A00] text-white font-bold rounded-full hover:shadow-lg transition-all">
          Go Shopping
        </Link>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white w-full max-w-2xl rounded-[3rem] p-8 lg:p-16 shadow-2xl shadow-orange-100/50 text-center space-y-10 border border-gray-50"
        >
          <div className="space-y-6">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-[2.5rem] flex items-center justify-center mx-auto border-4 border-white shadow-xl">
              <CheckCircle2 size={56} />
            </div>
            <div className="space-y-3">
              <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tight">Order Successful!</h2>
              <p className="text-gray-500 font-bold text-lg">Our team will contact you soon for confirmation.</p>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl p-8 lg:p-10 space-y-8 text-left border-2 border-gray-50 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <FileText size={120} />
            </div>
            
            <div className="grid grid-cols-2 gap-y-10 gap-x-6">
              {/* Left Side */}
              <div className="space-y-2">
                <span className="text-[14px] font-bold text-gray-400 uppercase tracking-widest">Order ID</span>
                <p className="font-black text-gray-900 text-[16px]">{orderSuccess.orderNumber}</p>
              </div>
              
              {/* Right Side */}
              <div className="space-y-2 text-right">
                <span className="text-[14px] font-bold text-gray-400 uppercase tracking-widest">Total Amount</span>
                <p className="font-black text-[#FF6A00] text-[16px]">৳ {orderSuccess.total.toLocaleString()}</p>
              </div>

              {/* Left Side */}
              <div className="space-y-2">
                <span className="text-[14px] font-bold text-gray-400 uppercase tracking-widest">Payment Method</span>
                <p className="font-black text-gray-900 text-[16px] uppercase">{orderSuccess.method}</p>
              </div>

              {/* Right Side */}
              <div className="space-y-2 text-right">
                <span className="text-[14px] font-bold text-gray-400 uppercase tracking-widest">Order Date</span>
                <p className="font-black text-gray-900 text-[16px] uppercase">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <button 
              onClick={() => window.open(`/api/orders/${orderSuccess.id}/invoice`, '_blank')}
              className="flex items-center justify-center gap-3 bg-[#111111] text-white h-[48px] rounded-[10px] font-bold text-base uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-lg shadow-gray-200"
            >
              <Download size={18} /> Download Invoice
            </button>
            <button 
              onClick={handlePrint}
              className="flex items-center justify-center gap-3 bg-white text-[#111111] border-2 border-[#111111] h-[48px] rounded-[10px] font-bold text-base uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95"
            >
              <Printer size={18} /> Print Invoice
            </button>
            <button 
              onClick={() => navigate('/')}
              className="sm:col-span-2 flex items-center justify-center gap-3 bg-[#FF6A00] h-[52px] text-white rounded-[10px] font-black uppercase tracking-widest hover:shadow-2xl hover:shadow-orange-200 transition-all active:scale-95 mt-4"
            >
              Continue Shopping <ChevronRight size={20} />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header Branding */}
      <div className="bg-white border-b border-gray-100 py-10 lg:py-16 text-center space-y-3">
        <h1 className="text-4xl lg:text-5xl font-black text-gray-900 uppercase tracking-tighter">
          🛒 TAZU MART CHECKOUT 🤷
        </h1>
        <p className="text-[#FF6A00] text-sm font-black uppercase tracking-[0.3em]">
          Fast & Secure Order System
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 lg:py-20">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          {/* Left: Customer Information */}
          <div className="flex-[1.4] space-y-12">
            <div className="space-y-10">
              <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
                <div className="w-12 h-12 bg-orange-50 text-[#FF6A00] rounded-2xl flex items-center justify-center">
                  <User size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Customer Information</h2>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Enter your shipping details</p>
                </div>
              </div>

              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 gap-8">
                  {/* Required Fields First */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <input 
                        required
                        type="text" 
                        className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-[#FF6A00] transition-all"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mobile Number *</label>
                    <div className="relative">
                      <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <input 
                        required
                        type="tel" 
                        className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-[#FF6A00] transition-all"
                        placeholder="01XXXXXXXXX"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value.replace(/[^0-9]/g, '').slice(0, 11)})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Address (House / Road / Village) *</label>
                    <div className="relative">
                      <MapPin className="absolute left-5 top-6 text-gray-300" size={18} />
                      <textarea 
                        required
                        className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-[#FF6A00] transition-all h-32 resize-none"
                        placeholder="Enter your detailed address"
                        value={formData.address}
                        onChange={e => setFormData({...formData, address: e.target.value})}
                      />
                    </div>
                  </div>

                  {/* Optional Fields Below */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-50">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address (Optional)</label>
                      <div className="relative">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        <input 
                          type="email" 
                          className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-[#FF6A00] transition-all"
                          placeholder="example@mail.com"
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Alternative Phone (Optional)</label>
                      <div className="relative">
                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        <input 
                          type="tel" 
                          className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-[#FF6A00] transition-all"
                          placeholder="01XXXXXXXXX"
                          value={formData.altPhone}
                          onChange={e => setFormData({...formData, altPhone: e.target.value.replace(/[^0-9]/g, '').slice(0, 11)})}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address System Toggle (Optional Location Details) */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Info size={20} className="text-[#FF6A00]" />
                      <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Location Details (Optional)</h3>
                    </div>
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                      <button 
                        type="button"
                        onClick={() => setAddressMode('dropdown')}
                        className={cn(
                          "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                          addressMode === 'dropdown' ? "bg-white text-gray-900 shadow-sm" : "text-gray-400"
                        )}
                      >
                        Select
                      </button>
                      <button 
                        type="button"
                        onClick={() => setAddressMode('manual')}
                        className={cn(
                          "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                          addressMode === 'manual' ? "bg-white text-gray-900 shadow-sm" : "text-gray-400"
                        )}
                      >
                        Manual
                      </button>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {addressMode === 'dropdown' ? (
                      <motion.div 
                        key="dropdown"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                      >
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Division</label>
                          <div className="relative">
                            <select 
                              className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-[#FF6A00] transition-all appearance-none"
                              value={formData.division}
                              onChange={e => setFormData({...formData, division: e.target.value, district: '', upazila: ''})}
                            >
                              <option value="">Select Division</option>
                              {BD_LOCATIONS.divisions.map(d => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">District</label>
                          <div className="relative">
                            <select 
                              disabled={!formData.division}
                              className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-[#FF6A00] transition-all appearance-none disabled:opacity-50"
                              value={formData.district}
                              onChange={e => setFormData({...formData, district: e.target.value, upazila: ''})}
                            >
                              <option value="">Select District</option>
                              {formData.division && BD_LOCATIONS.districts[formData.division as keyof typeof BD_LOCATIONS.districts]?.map(d => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Upazila</label>
                          <div className="relative">
                            <select 
                              disabled={!formData.district}
                              className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-[#FF6A00] transition-all appearance-none disabled:opacity-50"
                              value={formData.upazila}
                              onChange={e => setFormData({...formData, upazila: e.target.value})}
                            >
                              <option value="">Select Upazila</option>
                              {formData.district && BD_LOCATIONS.upazilas[formData.district as keyof typeof BD_LOCATIONS.upazilas]?.map(u => (
                                <option key={u.id} value={u.name}>{u.name}</option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="manual"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                      >
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Division</label>
                          <input 
                            type="text" 
                            className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-[#FF6A00] transition-all"
                            placeholder="e.g. Dhaka"
                            value={formData.division}
                            onChange={e => setFormData({...formData, division: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">District</label>
                          <input 
                            type="text" 
                            className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-[#FF6A00] transition-all"
                            placeholder="e.g. Gazipur"
                            value={formData.district}
                            onChange={e => setFormData({...formData, district: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Upazila</label>
                          <input 
                            type="text" 
                            className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-[#FF6A00] transition-all"
                            placeholder="e.g. Kaliganj"
                            value={formData.upazila}
                            onChange={e => setFormData({...formData, upazila: e.target.value})}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Order Note (Optional)</label>
                    <textarea 
                      className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-[#FF6A00] transition-all h-24 resize-none"
                      placeholder="Any special instructions for your order?"
                      value={formData.note}
                      onChange={e => setFormData({...formData, note: e.target.value})}
                    />
                  </div>
                </div>

                {/* Delivery Charge System */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Truck size={20} className="text-[#FF6A00]" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Delivery Method</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                      { id: 'inside', label: 'Inside City', fee: 60, desc: 'Dhaka City Area' },
                      { id: 'outside', label: 'Outside City', fee: 120, desc: 'All Over Bangladesh' }
                    ].map((opt) => (
                      <label 
                        key={opt.id}
                        className={cn(
                          "relative flex items-center justify-between p-8 border-2 rounded-[2rem] cursor-pointer transition-all",
                          formData.area === opt.id ? "border-[#FF6A00] bg-orange-50/30" : "border-gray-50 bg-gray-50/50 hover:border-gray-200"
                        )}
                      >
                        <input 
                          type="radio" 
                          className="hidden" 
                          checked={formData.area === opt.id}
                          onChange={() => setFormData({...formData, area: opt.id})}
                        />
                        <div className="flex flex-col gap-1">
                          <span className="font-black text-xs uppercase tracking-widest text-gray-900">{opt.label}</span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{opt.desc}</span>
                        </div>
                        <span className="font-black text-[#FF6A00] text-lg">{formatPrice(opt.fee)}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <CreditCard size={20} className="text-[#FF6A00]" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Payment Method</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                      { id: 'COD', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when you receive' },
                      { id: 'ONLINE', label: 'Online Payment', icon: '💳', desc: 'Secure Online Payment', disabled: true }
                    ].map((method) => (
                      <label 
                        key={method.id}
                        className={cn(
                          "relative flex items-center gap-6 p-8 border-2 rounded-[2rem] cursor-pointer transition-all",
                          formData.paymentMethod === method.id ? "border-[#FF6A00] bg-orange-50/30" : "border-gray-50 bg-gray-50/50 hover:border-gray-200",
                          method.disabled && "opacity-50 cursor-not-allowed grayscale"
                        )}
                      >
                        <input 
                          type="radio" 
                          className="hidden" 
                          disabled={method.disabled}
                          checked={formData.paymentMethod === method.id}
                          onChange={() => setFormData({...formData, paymentMethod: method.id})}
                        />
                        <span className="text-3xl">{method.icon}</span>
                        <div className="flex flex-col gap-1">
                          <span className="font-black text-xs uppercase tracking-widest text-gray-900">{method.label}</span>
                          <span className={cn(
                            "text-[9px] font-bold uppercase tracking-widest",
                            method.disabled ? "text-rose-500" : "text-gray-400"
                          )}>
                            {method.disabled ? "Coming Soon" : method.desc}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="flex-1">
            <div className="bg-white rounded-[12px] p-4 shadow-sm border border-gray-100 space-y-6 sticky top-12">
              <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                <h2 className="text-sm font-black uppercase tracking-widest text-gray-900">Order Summary</h2>
                <div className="bg-orange-50 text-[#FF6A00] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {checkoutItems.length} Items
                </div>
              </div>
              
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                {checkoutItems.map((item, i) => (
                  <div key={i} className="flex gap-4 items-center group">
                    <div className="w-[60px] h-[60px] rounded-lg overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                      <img 
                        src={item.image || '/default-product.png'} 
                        alt="" 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer" 
                        onError={(e) => (e.currentTarget.src = '/default-product.png')}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-gray-900 truncate uppercase tracking-tight leading-tight">{item.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-medium text-gray-400 uppercase tracking-widest">QTY: {item.quantity}</span>
                        {item.color && (
                          <>
                            <div className="w-1 h-1 bg-gray-200 rounded-full" />
                            <span className="text-[11px] font-medium text-gray-400 uppercase tracking-widest">{item.color}</span>
                          </>
                        )}
                      </div>
                      <p className="font-black text-[14px] text-gray-900 mt-1">BDT {item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-50">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-500 text-[14px]">Cart Subtotal</span>
                  <span className="font-bold text-gray-900 text-[14px]">BDT {subtotal}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-500 text-[14px]">Shipping ({formData.area === 'inside' ? 'Dhaka' : 'Outside'})</span>
                  <span className="font-bold text-gray-900 text-[14px]">BDT {deliveryFee}</span>
                </div>
                <div className="h-px bg-gray-50 w-full my-2" />
                <div className="flex justify-between items-center">
                  <span className="font-black text-gray-900 text-[14px] uppercase tracking-widest">Grand Total</span>
                  <span className="text-[18px] font-black text-[#FF6A00]">BDT {finalTotal}</span>
                </div>
              </div>

              <button 
                form="checkout-form"
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "w-full bg-[#FF6A00] text-white h-[50px] px-5 rounded-[10px] font-bold uppercase tracking-widest text-[16px] flex items-center justify-center gap-2 shadow-lg shadow-orange-100 hover:shadow-orange-200 transition-all active:scale-95 disabled:opacity-50",
                  isSubmitting && "animate-pulse"
                )}
              >
                {isSubmitting ? "Processing..." : "Complete Checkout"} <ChevronRight size={18} />
              </button>

              <div className="flex flex-col items-center gap-4 pt-2">
                <div className="w-full bg-gray-50/50 p-4 rounded-xl flex items-center justify-center gap-3 text-[11px] font-black text-gray-400 uppercase tracking-widest border border-gray-100">
                  <ShieldCheck size={16} className="text-emerald-500" />
                  Secure Checkout System
                </div>
                <div className="flex gap-6 grayscale opacity-20">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-3" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-3" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1200px-PayPal.svg.png" alt="Paypal" className="h-3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
