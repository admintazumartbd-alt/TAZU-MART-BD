import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  ChevronRight, 
  Layers,
  Image as ImageIcon,
  X,
  Save,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  History,
  TrendingUp,
  TrendingDown,
  Download,
  Filter,
  RefreshCw,
  Box,
  BarChart3,
  ArrowRightLeft,
  FilterX,
  PlusCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { cn, formatPrice } from '@/src/lib/utils';

export default function AdminProductInventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Premium Cotton T-Shirt', sku: 'TSH-001', stock: 5, minStock: 10, category: 'Apparel', image: 'https://picsum.photos/seed/tshirt/100/100', status: 'Low Stock', price: 1250 },
    { id: 2, name: 'Slim Fit Denim Jeans', sku: 'JNS-002', stock: 3, minStock: 5, category: 'Apparel', image: 'https://picsum.photos/seed/jeans/100/100', status: 'Low Stock', price: 2450 },
    { id: 3, name: 'Wireless Bluetooth Earbuds', sku: 'EBD-003', stock: 0, minStock: 15, category: 'Electronics', image: 'https://picsum.photos/seed/earbuds/100/100', status: 'Out of Stock', price: 3500 },
    { id: 4, name: 'Leather Wallet', sku: 'WLT-004', stock: 45, minStock: 10, category: 'Accessories', image: 'https://picsum.photos/seed/wallet/100/100', status: 'In Stock', price: 850 },
    { id: 5, name: 'Casual Polo Shirt', sku: 'POL-005', stock: 12, minStock: 10, category: 'Apparel', image: 'https://picsum.photos/seed/polo/100/100', status: 'In Stock', price: 1100 },
  ]);

  const getStatusColor = (s: string) => {
    switch (s.toLowerCase()) {
      case 'in stock': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'low stock': return 'bg-orange-50 text-[#FF6A00] border-orange-100';
      case 'out of stock': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FF6A00] flex items-center justify-center text-white shadow-lg shadow-orange-100">
              <Layers size={24} />
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">
              Stock <span className="text-[#FF6A00]">Control</span>
            </h1>
          </div>
          <p className="text-sm text-gray-500 font-medium max-w-md">
            Monitor and manage product availability across all warehouses with real-time tracking.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button className="bg-white text-gray-900 px-8 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest shadow-sm border border-gray-100 hover:shadow-md hover:bg-gray-50 transition-all flex items-center gap-3 group">
            <History size={18} className="group-hover:rotate-[-45deg] transition-transform" />
            Stock History
          </button>
          <button className="bg-[#FF6A00] text-white px-8 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-orange-100 hover:bg-[#E65F00] hover:scale-105 transition-all flex items-center gap-3">
            <RefreshCw size={20} />
            Bulk Update
          </button>
        </div>
      </div>

      {/* Inventory Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Total SKUs', value: '1,240', icon: Box, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12', up: true },
          { label: 'Low Stock', value: '12', icon: AlertCircle, color: 'text-[#FF6A00]', bg: 'bg-orange-50', trend: '-2', up: false },
          { label: 'Out of Stock', value: '5', icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50', trend: '+1', up: true },
          { label: 'Inventory Value', value: '৳ 4.2M', icon: BarChart3, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+5.4%', up: true },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 hover:shadow-2xl transition-all group">
            <div className="flex items-center justify-between mb-6">
              <div className={cn("p-4 rounded-2xl transition-colors shadow-sm", stat.bg, stat.color)}>
                <stat.icon size={24} />
              </div>
              <div className={cn(
                "flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm",
                stat.up ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"
              )}>
                {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.trend}
              </div>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-gray-900 tracking-tight leading-none">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Inventory Table Container */}
      <div className="bg-white rounded-[40px] shadow-sm border border-gray-50 overflow-hidden">
        <div className="p-10 border-b border-gray-50 flex flex-wrap items-center justify-between gap-8">
          <div className="flex items-center gap-6 flex-1 min-w-[300px]">
            <div className="relative flex-1 group">
              <input 
                type="text" 
                placeholder="Search by product name or SKU..." 
                className="pl-14 pr-6 py-5 bg-gray-50 border border-transparent rounded-[24px] text-sm font-medium outline-none focus:border-[#FF6A00] focus:bg-white transition-all w-full shadow-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF6A00] transition-colors" size={24} />
            </div>
            <button className="flex items-center gap-3 bg-gray-50 px-8 py-5 rounded-[24px] border border-transparent text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-gray-100 transition-all">
              <Filter size={20} />
              Filters
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-3 bg-white px-8 py-5 rounded-[24px] border border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
              <Download size={20} />
              Export
            </button>
            <div className="relative">
              <select className="bg-gray-50 border border-transparent rounded-[24px] pl-8 pr-12 py-5 text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white focus:border-[#FF6A00] transition-all appearance-none cursor-pointer min-w-[200px] shadow-inner">
                <option value="all">All Categories</option>
                <option value="apparel">Apparel</option>
                <option value="electronics">Electronics</option>
              </select>
              <ChevronRight size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none rotate-90" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-50">
                <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product Details</th>
                <th className="px-6 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">SKU / ID</th>
                <th className="px-6 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                <th className="px-6 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Stock Level</th>
                <th className="px-6 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-10 py-32 text-center">
                    <div className="flex flex-col items-center gap-8">
                      <div className="w-32 h-32 bg-gray-50 rounded-[48px] flex items-center justify-center text-gray-200 shadow-inner">
                        <Package size={64} />
                      </div>
                      <div className="text-center max-w-xs mx-auto">
                        <p className="text-lg font-black text-gray-900 uppercase tracking-tight">No stock records found</p>
                        <p className="text-xs text-gray-500 font-medium mt-3 leading-relaxed">Try adjusting your search or filters to find specific inventory items.</p>
                      </div>
                      <button 
                        onClick={() => setSearchTerm('')}
                        className="flex items-center gap-2 text-[10px] font-black text-[#FF6A00] uppercase tracking-widest hover:underline"
                      >
                        <FilterX size={16} />
                        Reset Search
                      </button>
                    </div>
                  </td>
                </tr>
              ) : filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-all group cursor-pointer">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-[20px] overflow-hidden border border-gray-100 shrink-0 shadow-sm group-hover:shadow-md transition-all">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-gray-900 group-hover:text-[#FF6A00] transition-colors leading-tight uppercase tracking-tight">{item.name}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-2">Price: {formatPrice(item.price)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-8">
                    <span className="text-[10px] font-black text-gray-500 bg-gray-100 px-4 py-2 rounded-xl uppercase tracking-widest border border-gray-200/50">{item.sku}</span>
                  </td>
                  <td className="px-6 py-8">
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{item.category}</span>
                  </td>
                  <td className="px-6 py-8">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between max-w-[160px]">
                        <span className={cn(
                          "text-xs font-black",
                          item.stock <= item.minStock ? "text-rose-500" : "text-gray-900"
                        )}>
                          {item.stock} Units
                        </span>
                        <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Min: {item.minStock}</span>
                      </div>
                      <div className="w-40 h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all duration-1000 ease-out",
                            item.stock === 0 ? "bg-rose-500" : item.stock <= item.minStock ? "bg-[#FF6A00]" : "bg-emerald-500"
                          )}
                          style={{ width: `${Math.min((item.stock / (item.minStock * 2)) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-8">
                    <span className={cn(
                      "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm",
                      getStatusColor(item.status)
                    )}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-[#FF6A00] hover:bg-orange-50 rounded-2xl transition-all border border-gray-100 shadow-sm hover:shadow-md bg-white">
                        <Edit2 size={20} />
                      </button>
                      <button className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all border border-gray-100 shadow-sm hover:shadow-md bg-white">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Section */}
        <div className="px-10 py-8 bg-gray-50/50 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
            Showing <span className="text-gray-900">1-5</span> of <span className="text-gray-900">1,240</span> Unique Items
          </p>
          <div className="flex items-center gap-3">
            <button className="w-12 h-12 flex items-center justify-center rounded-2xl border border-gray-200 text-gray-400 cursor-not-allowed bg-white shadow-sm" disabled>
              <ChevronRight size={24} className="rotate-180" />
            </button>
            <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#FF6A00] text-white text-xs font-black shadow-xl shadow-orange-100">1</button>
            <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-gray-200 text-xs font-black text-gray-600 hover:bg-gray-50 transition-all shadow-sm">2</button>
            <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
