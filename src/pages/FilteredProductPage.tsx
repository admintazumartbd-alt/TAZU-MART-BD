import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Filter, ChevronDown, LayoutGrid, List, Home, ChevronRight, Loader2, ShoppingBag } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';
import axios from '../lib/api';

interface FilteredProductPageProps {
  title: string;
  filterType: 'isNewArrival' | 'isBestSelling' | 'isOfferProduct';
}

export default function FilteredProductPage({ title, filterType }: FilteredProductPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/products?${filterType}=true`)
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products:", err);
        setLoading(false);
      });
  }, [filterType]);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Link to="/" className="hover:text-[#f85606] flex items-center gap-1">
              <Home size={12} /> Home
            </Link>
            <ChevronRight size={12} />
            <span className="text-gray-900 font-medium">{title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-500 mt-1">Showing {products.length} products</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-gray-100 text-[#f85606]' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <LayoutGrid size={18} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-gray-100 text-[#f85606]' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <List size={18} />
              </button>
            </div>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-[#f85606] hover:text-[#f85606] transition-all">
              <Filter size={16} />
              Filter
            </button>
            
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-[#f85606] hover:text-[#f85606] transition-all">
                Sort By
                <ChevronDown size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-[#f85606] animate-spin" />
            <p className="text-gray-500 animate-pulse font-medium">Loading products...</p>
          </div>
        ) : products.length > 0 ? (
          <div className={`grid gap-4 md:gap-6 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'grid-cols-1'}`}>
            {products.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-50 text-[#f85606] mb-6">
              <ShoppingBag size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              We couldn't find any products in this collection at the moment. Please check back later or try another category.
            </p>
            <Link 
              to="/shop" 
              className="inline-flex items-center justify-center px-8 py-3 bg-[#f85606] text-white font-bold rounded-full hover:bg-[#d94800] transition-all shadow-lg shadow-orange-200"
            >
              Explore All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
