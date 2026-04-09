import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_PRODUCTS } from '@/src/constants';
import ProductCard from '@/src/components/ProductCard';
import { Filter, LayoutGrid, List, Star, ChevronRight } from 'lucide-react';
import { cn, formatPrice } from '@/src/lib/utils';
import api from '@/src/lib/api';
import { motion } from 'motion/react';
import { Product, PriceSettings, Category } from '@/src/types';

export default function CategoryPage() {
  const { slug, subSlug } = useParams<{ slug: string; subSlug?: string }>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [homeProducts, setHomeProducts] = useState<Product[]>([]);
  const [isViewAll, setIsViewAll] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('latest');
  
  // Filter States
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [priceSettings, setPriceSettings] = useState<PriceSettings>({ minPrice: 0, maxPrice: 10000, step: 100 });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [priceRes, catRes] = await Promise.all([
          api.get('/api/price-settings'),
          api.get('/api/categories')
        ]);
        if (priceRes.data && typeof priceRes.data === 'object' && !priceRes.data.error) {
          setPriceSettings(priceRes.data);
          setPriceRange([priceRes.data.minPrice, priceRes.data.maxPrice]);
        }
        if (Array.isArray(catRes.data)) {
          setCategories(catRes.data);
        }
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    // Reset View All state when category or subcategory changes
    setIsViewAll(false);
    window.scrollTo(0, 0);
  }, [slug, subSlug]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        
        // Fetch Home Products (Top 8)
        const homeResponse = await api.get(`/api/products/category/${slug}/home`, {
          params: { subcategory: subSlug }
        });
        if (Array.isArray(homeResponse.data)) {
          setHomeProducts(homeResponse.data);
        }

        // Fetch All Products
        const response = await api.get(`/api/products/category/${slug}`, {
          params: {
            subcategory: subSlug,
            min: priceRange[0],
            max: priceRange[1]
          }
        });
        const allProducts = response.data;
        
        if (Array.isArray(allProducts)) {
          setProducts(allProducts);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    const timeoutId = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [slug, subSlug, priceRange]);

  useEffect(() => {
    let result = isViewAll ? [...products] : [...homeProducts];

    // Sorting (Only apply to full list or if user explicitly sorts)
    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
    if (sortBy === 'best-selling') result.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
    if (sortBy === 'latest') result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setFilteredProducts(result);
  }, [products, homeProducts, isViewAll, sortBy]);

  const currentCategory = categories.find(c => c.slug === slug);
  const currentSubcategory = currentCategory?.subcategories?.find(sc => sc.slug === subSlug);

  if (!isLoading && categories.length > 0 && !currentCategory) {
    return (
      <div className="p-20 text-center space-y-4">
        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Category not found</h2>
        <Link to="/" className="text-[#f85606] font-bold hover:underline">Back to Home</Link>
      </div>
    );
  }

  const isWatchCategory = slug === 'watches';

  return (
    <div className="pb-20 bg-gray-50/50">
      {/* Category Header / Banner */}
      <div className="relative h-[180px] md:h-[280px] bg-gray-900 overflow-hidden">
        <img 
          src={currentCategory?.banner || 'https://picsum.photos/seed/shop/1200/400'} 
          alt={currentCategory?.name}
          className="w-full h-full object-cover opacity-60"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div className="text-white space-y-3">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-5xl font-black uppercase tracking-tighter"
            >
              {isWatchCategory ? "TAZU MART BD Watch Collection ⌚" : (currentSubcategory?.name || currentCategory?.name)}
            </motion.h1>
            <p className="text-sm md:text-lg font-medium text-gray-200">
              {isWatchCategory ? "Premium Watches at Best Price" : `Explore our latest ${currentSubcategory?.name || currentCategory?.name} collection`}
            </p>
            <div className="flex items-center justify-center gap-2 text-xs md:text-sm font-bold uppercase tracking-widest">
              <Link to="/" className="hover:text-[#f85606] transition-colors">Home</Link>
              <span className="text-gray-400">/</span>
              <Link to={`/category/${slug}`} className={cn("hover:text-[#f85606] transition-colors", !subSlug && "text-[#f85606]")}>
                {currentCategory?.name}
              </Link>
              {subSlug && (
                <>
                  <span className="text-gray-400">/</span>
                  <span className="text-[#f85606]">{currentSubcategory?.name || subSlug.replace(/-/g, ' ')}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0 space-y-6">
            {/* Price Filter */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center gap-3 border-b pb-4">
                <Filter size={18} className="text-[#f85606]" />
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Price Range</h3>
              </div>
              
              <div className="space-y-6">
                <div className="relative h-2 bg-gray-100 rounded-full">
                  <input 
                    type="range" 
                    min={priceSettings.minPrice} 
                    max={priceSettings.maxPrice} 
                    step={priceSettings.step}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer accent-[#f85606] z-10"
                  />
                  <div 
                    className="absolute h-full bg-[#f85606] rounded-full" 
                    style={{ 
                      width: `${((priceRange[1] - priceSettings.minPrice) / (priceSettings.maxPrice - priceSettings.minPrice)) * 100}%` 
                    }} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Min</p>
                    <p className="text-xs font-black text-gray-900">৳{formatPrice(priceSettings.minPrice)}</p>
                  </div>
                  <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 text-right">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Max</p>
                    <p className="text-xs font-black text-[#f85606]">৳{formatPrice(priceRange[1])}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-50">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">
                  Showing products up to ৳{formatPrice(priceRange[1])}
                </p>
              </div>
            </div>

            {/* Subcategories (if any) */}
            {currentCategory?.subcategories && currentCategory.subcategories.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-black uppercase tracking-widest mb-4 border-b pb-4">Categories</h3>
                <div className="space-y-3">
                  <Link 
                    to={`/category/${currentCategory.slug}`}
                    className={cn(
                      "flex items-center justify-between text-sm transition-all hover:translate-x-1",
                      !subSlug ? "text-[#f85606] font-black" : "text-gray-500 font-bold"
                    )}
                  >
                    <span>All {currentCategory.name}</span>
                    <ChevronRight size={14} />
                  </Link>
                  {currentCategory.subcategories.map(sc => (
                    <Link 
                      key={sc.id}
                      to={`/category/${currentCategory.slug}/${sc.slug}`}
                      className={cn(
                        "flex items-center justify-between text-sm transition-all hover:translate-x-1",
                        subSlug === sc.slug ? "text-[#f85606] font-black" : "text-gray-500 font-bold"
                      )}
                    >
                      <span>{sc.name}</span>
                      <ChevronRight size={14} />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-black uppercase tracking-tight text-gray-900">
                  {isViewAll ? "All Products" : "Latest Arrivals"}
                </h2>
                <span className="text-sm font-medium text-gray-500">
                  {isLoading ? 'Loading...' : `(${filteredProducts.length})`}
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                  <span className="text-xs font-bold uppercase text-gray-400">Sort by:</span>
                  <select 
                    className="text-sm font-bold focus:outline-none bg-transparent text-gray-700"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="latest">Latest Arrival</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="best-selling">Best Selling</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="bg-white aspect-[3/4] rounded-xl animate-pulse border border-gray-100" />
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* View All Button (Layer 2) */}
                {!isViewAll && products.length > 8 && (
                  <div className="flex justify-center pt-8">
                    <button
                      onClick={() => {
                        setIsViewAll(true);
                        window.scrollTo({ top: 400, behavior: 'smooth' });
                      }}
                      className="bg-[#f85606] text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-[#d94800] transition-all shadow-lg hover:shadow-orange-200 hover:-translate-y-1 active:scale-95"
                    >
                      View All Products
                    </button>
                  </div>
                )}

                {/* Empty State */}
                {filteredProducts.length === 0 && (
                  <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                    <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-gray-300 mb-4">
                      <LayoutGrid size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">No products found</h3>
                    <p className="text-gray-500 max-w-xs mx-auto">Try adjusting your filters or explore other categories.</p>
                    <button 
                      onClick={() => {
                        setPriceRange([priceSettings.minPrice, priceSettings.maxPrice]);
                      }}
                      className="mt-6 bg-[#f85606] text-white px-8 py-3 rounded-full font-bold hover:bg-[#d94800] transition-colors"
                    >
                      Reset Price Filter
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
