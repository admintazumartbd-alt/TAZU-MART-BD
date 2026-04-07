import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Category, Product } from '@/src/types';
import ProductCard from './ProductCard';
import { ChevronRight, Loader2 } from 'lucide-react';
import axios from 'axios';

interface CategorySectionProps {
  category: Category;
}

const CategorySection: React.FC<CategorySectionProps> = ({ category }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`/api/products/category/${category.slug}/home`);
        setProducts(response.data);
      } catch (error) {
        console.error(`Failed to fetch products for ${category.name}:`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category.slug]);

  if (loading) {
    return (
      <section className="py-6 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center h-40">
          <Loader2 className="animate-spin text-[#f85606]" size={24} />
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  // Homepage requirement: Show max 8 products (already limited by API, but keep for safety)
  const displayProducts = products;

  return (
    <section className="py-6 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-1">
            <h2 className="text-lg md:text-xl font-bold text-[#111111] flex items-center gap-2">
              {category.name}
              <span className="text-xs font-normal text-gray-400 hidden sm:inline">({category.nameBn})</span>
            </h2>
            <div className="h-1 w-12 bg-[#f85606] rounded-full"></div>
          </div>
          <Link 
            to={`/category/${category.slug}`}
            className="flex items-center gap-1 text-[#f85606] text-xs font-bold hover:gap-2 transition-all"
          >
            View All <ChevronRight size={16} />
          </Link>
        </div>

        {/* Category Banner */}
        <div className="mb-6 rounded-xl overflow-hidden h-[120px] md:h-[200px] relative group">
          <img 
            src={category.banner} 
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center px-6 md:px-10">
            <div className="text-white">
              <h3 className="text-lg md:text-2xl font-bold mb-1">{category.name} Collection</h3>
              <p className="text-xs md:text-sm text-gray-200">Explore premium quality products</p>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
