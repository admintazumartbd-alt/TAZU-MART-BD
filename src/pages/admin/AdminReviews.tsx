import React from 'react';
import { 
  Star, 
  MessageSquare, 
  Plus, 
  ChevronRight, 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal, 
  ThumbsUp, 
  ThumbsDown, 
  User, 
  Package, 
  Activity, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertCircle, 
  XCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function AdminReviews() {
  const reviews = [
    { id: 1, customer: 'Rahat Khan', product: 'Premium Cotton T-Shirt', rating: 5, comment: 'Excellent quality and perfect fit. Highly recommended!', status: 'Published', date: '2 hours ago' },
    { id: 2, customer: 'Sumi Akter', product: 'Slim Fit Denim Jeans', rating: 4, comment: 'Good jeans, but the color is slightly different from the photo.', status: 'Published', date: '5 hours ago' },
    { id: 3, customer: 'Jasim Uddin', product: 'Wireless Bluetooth Earbuds', rating: 2, comment: 'Battery life is very poor. Disappointed with the purchase.', status: 'Pending', date: '12 hours ago' },
    { id: 4, customer: 'Nila Islam', product: 'Leather Wallet', rating: 5, comment: 'Beautiful wallet, very premium feel.', status: 'Published', date: '1 day ago' },
  ];

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FF6A00] flex items-center justify-center text-white shadow-lg shadow-orange-100">
              <Star size={24} />
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">
              Customer <span className="text-[#FF6A00]">Voices</span>
            </h1>
          </div>
          <p className="text-sm text-gray-500 font-medium max-w-md">
            Manage product reviews, customer feedback, and maintain your store's reputation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button className="bg-white text-gray-900 px-8 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest shadow-sm border border-gray-100 hover:shadow-md hover:bg-gray-50 transition-all flex items-center gap-3 group">
            <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
            Export Reviews
          </button>
          <button className="bg-[#FF6A00] text-white px-8 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-orange-100 hover:bg-[#E65F00] hover:scale-105 transition-all flex items-center gap-3">
            <Sparkles size={20} />
            Auto-Moderate
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Total Reviews', value: '1,240', icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+124' },
          { label: 'Avg. Rating', value: '4.8', icon: Star, color: 'text-[#FF6A00]', bg: 'bg-orange-50', trend: '+0.2' },
          { label: 'Positive Feedback', value: '94%', icon: ThumbsUp, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+2.1%' },
          { label: 'Pending Approval', value: '18', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50', trend: '-5' },
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
        {/* Reviews Table */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[40px] shadow-sm border border-gray-50 overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-[#FF6A00]">
                  <Activity size={20} />
                </div>
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Recent Feedback</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <input 
                    type="text" 
                    placeholder="Search reviews..." 
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
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                    <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product & Rating</th>
                    <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Comment</th>
                    <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {reviews.map((review) => (
                    <tr key={review.id} className="hover:bg-gray-50/50 transition-all group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-[#FF6A00] group-hover:bg-orange-50 transition-all border border-gray-100 shadow-sm">
                            <User size={20} />
                          </div>
                          <div>
                            <p className="text-xs font-black text-gray-900 uppercase tracking-tight group-hover:text-[#FF6A00] transition-colors">{review.customer}</p>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">{review.date}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <p className="text-xs font-black text-gray-900 uppercase tracking-tight line-clamp-1">{review.product}</p>
                        <div className="flex items-center gap-1 text-[#FF6A00] mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={10} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-gray-200"} />
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <p className="text-[10px] font-bold text-gray-600 line-clamp-2 leading-relaxed uppercase tracking-wide">{review.comment}</p>
                      </td>
                      <td className="px-6 py-6">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border shadow-sm",
                          review.status === 'Published' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                          review.status === 'Pending' ? "bg-orange-50 text-[#FF6A00] border-orange-100" :
                          "bg-gray-50 text-gray-500 border-gray-100"
                        )}>
                          {review.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all" title="Approve">
                            <CheckCircle2 size={18} />
                          </button>
                          <button className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-all" title="Reject">
                            <XCircle size={18} />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-xl transition-all">
                            <MoreHorizontal size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sentiment Analysis Bento */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 space-y-8 relative overflow-hidden group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <ThumbsUp size={20} />
              </div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Sentiment Pulse</h3>
            </div>

            <div className="space-y-6">
              {[
                { label: 'Positive', value: '82%', color: 'bg-emerald-500' },
                { label: 'Neutral', value: '12%', color: 'bg-gray-300' },
                { label: 'Negative', value: '6%', color: 'bg-rose-500' },
              ].map((sent, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{sent.label}</span>
                    <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{sent.value}</span>
                  </div>
                  <div className="h-2 bg-gray-50 rounded-full overflow-hidden shadow-inner">
                    <div className={cn("h-full rounded-full transition-all duration-1000", sent.color)} style={{ width: sent.value }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-orange-50 p-6 rounded-[32px] border border-orange-100 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-[0.05] group-hover:scale-110 transition-transform duration-700">
                <AlertCircle size={80} />
              </div>
              <p className="text-[10px] font-black text-[#FF6A00] uppercase tracking-widest mb-2">Reputation Alert</p>
              <p className="text-[11px] font-bold text-orange-700 leading-relaxed uppercase tracking-wider relative z-10">
                Product "Wireless Earbuds" has received 3 negative reviews in the last 24 hours. Consider investigating the batch quality.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
