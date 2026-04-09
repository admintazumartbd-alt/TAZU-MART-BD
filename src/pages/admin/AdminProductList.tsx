import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../lib/api';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  ChevronRight, 
  Package,
  AlertCircle,
  Filter,
  ArrowUpDown,
  Tag,
  Box,
  Layers,
  Eye,
  Download,
  CheckSquare,
  Square,
  MoreHorizontal,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  FilterX,
  XCircle,
  PlusCircle,
  FileText,
  RefreshCw
} from 'lucide-react';
import { cn, formatPrice } from '@/src/lib/utils';

export default function AdminProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [backups, setBackups] = useState<any[]>([]);
  const [showBackups, setShowBackups] = useState(false);

  const fetchBackups = async () => {
    try {
      const response = await axios.get('/api/admin/backups');
      setBackups(response.data);
    } catch (error) {
      console.error("Failed to fetch backups:", error);
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/admin/products');
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => 
    (product.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (stock: number) => {
    if (stock > 10) return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    if (stock > 0) return 'bg-orange-50 text-orange-600 border-orange-100';
    return 'bg-rose-50 text-rose-600 border-rose-100';
  };

  const deleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product? It will be moved to archives.")) return;
    try {
      await axios.delete(`/api/admin/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Failed to delete product.");
    }
  };

  const handleRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (window.confirm("Are you sure you want to restore from this backup? This will merge data.")) {
          await axios.post('/api/admin/restore', { data });
          alert("Restore successful!");
          fetchProducts();
        }
      } catch (error) {
        console.error("Restore failed:", error);
        alert("Invalid backup file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FF6A00] flex items-center justify-center text-white shadow-lg shadow-orange-100">
              <Box size={24} />
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">
              Product <span className="text-[#FF6A00]">Catalog</span>
            </h1>
          </div>
          <p className="text-sm text-gray-500 font-medium max-w-md">
            Manage your store's product inventory, pricing, and stock levels with precision.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <label className="bg-white text-gray-900 px-8 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest shadow-sm border border-gray-100 hover:shadow-md hover:bg-gray-50 transition-all flex items-center gap-3 group cursor-pointer">
            <RefreshCw size={18} />
            Restore Backup
            <input type="file" accept=".json" className="hidden" onChange={handleRestore} />
          </label>
          <button 
            onClick={() => {
              fetchBackups();
              setShowBackups(true);
            }}
            className="bg-white text-gray-900 px-8 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest shadow-sm border border-gray-100 hover:shadow-md hover:bg-gray-50 transition-all flex items-center gap-3 group"
          >
            <Layers size={18} />
            Backup History
          </button>
          <button 
            onClick={() => {
              window.open('/api/admin/backup', '_blank');
            }}
            className="bg-white text-gray-900 px-8 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest shadow-sm border border-gray-100 hover:shadow-md hover:bg-gray-50 transition-all flex items-center gap-3 group"
          >
            <Download size={18} />
            Backup Catalog
          </button>
          <button 
            onClick={fetchProducts}
            className="bg-white text-gray-900 px-8 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest shadow-sm border border-gray-100 hover:shadow-md hover:bg-gray-50 transition-all flex items-center gap-3 group"
          >
            <RefreshCw size={18} className={cn(isLoading && "animate-spin")} />
            Refresh
          </button>
          <button 
            onClick={() => navigate('/admin/products/add')}
            className="bg-[#FF6A00] text-white px-8 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-orange-100 hover:bg-[#E65F00] hover:scale-105 transition-all flex items-center gap-3"
          >
            <PlusCircle size={20} />
            Add New Product
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 flex flex-wrap items-center justify-between gap-8">
        <div className="flex items-center gap-6 flex-1 min-w-[300px]">
          <div className="relative flex-1 group">
            <input 
              type="text" 
              placeholder="Search by product name or category..." 
              className="pl-14 pr-6 py-5 bg-gray-50 border border-transparent rounded-[24px] text-sm font-medium outline-none focus:border-[#FF6A00] focus:bg-white transition-all w-full shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF6A00] transition-colors" size={24} />
          </div>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-[40px] shadow-sm border border-gray-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-50">
                <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product Info</th>
                <th className="px-6 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                <th className="px-6 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Pricing</th>
                <th className="px-6 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Inventory</th>
                <th className="px-6 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-10 py-8 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading && products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-10 py-32 text-center">
                    <div className="flex flex-col items-center gap-6">
                      <div className="w-16 h-16 border-4 border-orange-100 border-t-[#FF6A00] rounded-full animate-spin shadow-sm" />
                      <p className="text-sm font-black text-gray-900 uppercase tracking-widest">Syncing Catalog</p>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-10 py-32 text-center">
                    <div className="flex flex-col items-center gap-8">
                      <div className="w-32 h-32 bg-gray-50 rounded-[48px] flex items-center justify-center text-gray-200 shadow-inner">
                        <Package size={64} />
                      </div>
                      <p className="text-lg font-black text-gray-900 uppercase tracking-tight">No Data Available</p>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.map((product) => (
                <tr 
                  key={product.id} 
                  className="hover:bg-gray-50/80 transition-all group"
                >
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-[20px] overflow-hidden border border-gray-100 shrink-0 shadow-sm group-hover:shadow-md transition-all">
                        <img 
                          src={product.image || product.images?.[0] || '/default-product.png'} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/default-product.png';
                          }}
                        />
                      </div>
                      <div>
                        <p className="text-xs font-black text-gray-900 group-hover:text-[#FF6A00] transition-colors uppercase tracking-tight line-clamp-1">{product.name}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">ID: #{product.id?.slice(0, 8).toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-8">
                    <div className="flex items-center gap-2">
                      <Tag size={14} className="text-gray-400" />
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{product.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-8">
                    <p className="text-sm font-black text-gray-900">{formatPrice(product.price)}</p>
                    {product.oldPrice && (
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1 line-through">{formatPrice(product.oldPrice)}</p>
                    )}
                  </td>
                  <td className="px-6 py-8">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-black text-gray-900">{product.stock} Units</span>
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all duration-1000",
                            product.stock > 10 ? "bg-emerald-500" : product.stock > 0 ? "bg-orange-500" : "bg-rose-500"
                          )}
                          style={{ width: `${Math.min((product.stock / 50) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-8">
                    <span className={cn(
                      "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm",
                      getStatusColor(product.stock)
                    )}>
                      {product.stock > 10 ? 'Active' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                        className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all bg-white border border-gray-100"
                        title="Edit Product"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => deleteProduct(product.id)}
                        className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all bg-white border border-gray-100"
                        title="Delete Product"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-all bg-white border border-gray-100">
                        <MoreHorizontal size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Backup History Modal */}
      {showBackups && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#FF6A00] flex items-center justify-center">
                  <Layers size={20} />
                </div>
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Backup History</h3>
              </div>
              <button 
                onClick={() => setShowBackups(false)}
                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors"
              >
                <XCircle size={24} />
              </button>
            </div>
            <div className="p-8 max-h-[60vh] overflow-y-auto">
              {backups.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mx-auto mb-4">
                    <Layers size={32} />
                  </div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No auto-backups found yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {backups.map((backup) => (
                    <div key={backup.name} className="flex items-center justify-between p-6 bg-gray-50 rounded-[24px] border border-transparent hover:border-orange-100 hover:bg-white transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-[#FF6A00] transition-colors">
                          <FileText size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-black text-gray-900 uppercase tracking-tight">{backup.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                            {new Date(backup.createdAt).toLocaleString()} • {(backup.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => window.open(`/api/admin/backups/download/${backup.name}`, '_blank')}
                          className="p-3 bg-white text-gray-400 hover:text-[#FF6A00] rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
                          title="Download"
                        >
                          <Download size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                Auto-backups are created daily for your safety.
              </p>
              <button 
                onClick={() => setShowBackups(false)}
                className="px-8 py-3 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
