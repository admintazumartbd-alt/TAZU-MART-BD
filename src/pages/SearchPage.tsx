import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import ProductCard from '@/src/components/ProductCard';
import { Search as SearchIcon } from 'lucide-react';
import api from '@/src/lib/api';

export default function SearchPage() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q') || '';
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/api/admin/products');
        setProducts(response.data.filter((p: any) => 
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
        ));
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8 space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold">
          Search Results for "{query}"
        </h1>
        <p className="text-gray-500">
          {isLoading ? 'Searching...' : `${products.length} products found`}
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-gray-50 aspect-[3/4] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-6">
          <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto text-gray-400">
            <SearchIcon size={48} />
          </div>
          <h2 className="text-2xl font-bold">No results found</h2>
          <p className="text-gray-500">Try searching with different keywords or browse our categories.</p>
          <Link to="/" className="inline-block bg-[#E91E63] text-white px-8 py-3 rounded-full font-bold">
            Browse All Products
          </Link>
        </div>
      )}
    </div>
  );
}
