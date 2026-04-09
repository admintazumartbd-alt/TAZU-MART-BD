import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Search, Filter, MoreVertical, Edit2, Trash2, Save, X, Percent, Calendar, Image as ImageIcon, Tag, Loader2 } from 'lucide-react';
import axios from '../../lib/api';
import { Offer } from '../../types';
import { cn } from '@/src/lib/utils';

export default function AdminOfferManagement() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentOffer, setCurrentOffer] = useState<Partial<Offer>>({
    title: '',
    type: 'DISCOUNT',
    couponCode: '',
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    bannerImage: '',
    status: 'ACTIVE'
  });

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/offers');
      setOffers(response.data);
    } catch (err) {
      console.error("Failed to fetch offers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.post('/api/admin/offers', currentOffer);
      if (response.data.success || response.status === 200) {
        setIsEditing(false);
        fetchOffers();
        setCurrentOffer({ title: '', type: 'DISCOUNT', status: 'ACTIVE' });
      }
    } catch (err) {
      console.error("Failed to save offer:", err);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Offer Management</h1>
          <p className="text-sm text-gray-500">Manage store-wide discounts, coupons, and promotional banners</p>
        </div>
        <button 
          onClick={() => {
            setCurrentOffer({ title: '', type: 'DISCOUNT', status: 'ACTIVE', expiryDate: new Date().toISOString().split('T')[0] });
            setIsEditing(true);
          }}
          className="flex items-center gap-2 bg-[#f85606] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#d94800] transition-all shadow-lg shadow-orange-100"
        >
          <Plus size={20} />
          Create New Offer
        </button>
      </div>

      {isEditing && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-xl border border-orange-100 mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">{currentOffer.id ? 'Edit Offer' : 'Create New Offer'}</h2>
            <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Offer Title</label>
              <input 
                type="text" 
                value={currentOffer.title}
                onChange={(e) => setCurrentOffer({ ...currentOffer, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#f85606] outline-none transition-all"
                placeholder="e.g. Eid Special Discount"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Offer Type</label>
              <select 
                value={currentOffer.type}
                onChange={(e) => setCurrentOffer({ ...currentOffer, type: e.target.value as any })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#f85606] outline-none transition-all"
              >
                <option value="DISCOUNT">Direct Discount</option>
                <option value="COUPON">Coupon Code</option>
                <option value="BANNER">Promotional Banner</option>
              </select>
            </div>

            {currentOffer.type === 'COUPON' && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Coupon Code</label>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    value={currentOffer.couponCode}
                    onChange={(e) => setCurrentOffer({ ...currentOffer, couponCode: e.target.value.toUpperCase() })}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#f85606] outline-none transition-all font-mono"
                    placeholder="EID2024"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Expiry Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="date" 
                  value={currentOffer.expiryDate?.split('T')[0]}
                  onChange={(e) => setCurrentOffer({ ...currentOffer, expiryDate: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#f85606] outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-gray-700">Banner Image URL</label>
              <div className="relative">
                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  value={currentOffer.bannerImage}
                  onChange={(e) => setCurrentOffer({ ...currentOffer, bannerImage: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#f85606] outline-none transition-all"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Status</label>
              <select 
                value={currentOffer.status}
                onChange={(e) => setCurrentOffer({ ...currentOffer, status: e.target.value as any })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#f85606] outline-none transition-all"
              >
                <option value="ACTIVE">Active</option>
                <option value="DRAFT">Draft</option>
                <option value="EXPIRED">Expired</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button 
              onClick={() => setIsEditing(false)}
              className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 bg-[#f85606] text-white px-8 py-2.5 rounded-xl font-bold hover:bg-[#d94800] transition-all shadow-lg shadow-orange-100"
            >
              <Save size={20} />
              Save Offer
            </button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-20 flex flex-col items-center gap-4 text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin" />
            <p className="animate-pulse">Loading offers...</p>
          </div>
        ) : offers.length > 0 ? (
          offers.map((offer) => (
            <motion.div 
              key={offer.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-md transition-all"
            >
              <div className="relative h-40 bg-gray-100">
                {offer.bannerImage ? (
                  <img 
                    src={offer.bannerImage} 
                    alt={offer.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <ImageIcon size={48} />
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <div className={cn(
                    "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm",
                    offer.status === 'ACTIVE' ? "bg-green-500 text-white" : "bg-gray-500 text-white"
                  )}>
                    {offer.status}
                  </div>
                </div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => {
                      setCurrentOffer(offer);
                      setIsEditing(true);
                    }}
                    className="p-2 bg-white/90 backdrop-blur-sm text-gray-600 hover:text-[#f85606] rounded-lg shadow-sm"
                  >
                    <Edit2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#f85606] flex items-center justify-center">
                    {offer.type === 'COUPON' ? <Tag size={16} /> : <Percent size={16} />}
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{offer.type}</span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{offer.title}</h3>
                
                {offer.couponCode && (
                  <div className="mt-3 p-2 bg-orange-50 border border-dashed border-orange-200 rounded-lg text-center">
                    <span className="text-xs font-mono font-bold text-[#f85606]">{offer.couponCode}</span>
                  </div>
                )}
                
                <div className="mt-4 flex items-center justify-between text-[10px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    Expires: {new Date(offer.expiryDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full bg-white rounded-2xl p-20 text-center border border-dashed border-gray-200">
            <p className="text-gray-400">No offers found. Create your first promotion.</p>
          </div>
        )}
      </div>
    </div>
  );
}
