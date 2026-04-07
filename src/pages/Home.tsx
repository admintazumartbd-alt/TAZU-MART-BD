import React, { useEffect, useRef, useState } from 'react';
import Hero from '@/src/components/Hero';
import CategorySection from '@/src/components/CategorySection';
import { CATEGORIES } from '@/src/constants';
import { Truck, ShieldCheck, RotateCcw, Headphones, Sparkles, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Product } from '@/src/types';
import ProductCard from '@/src/components/ProductCard';

export default function Home() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await axios.get('/api/products/featured');
        setFeaturedProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
      } finally {
        setLoadingFeatured(false);
      }
    };
    fetchFeatured();
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const container = scrollRef.current;
        const scrollAmount = 150;
        const maxScroll = container.scrollWidth - container.clientWidth;
        
        if (container.scrollLeft >= maxScroll - 10) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div className="pb-8">
      {/* Terms Update Banner */}
      <div className="bg-[#f85606] text-white py-2 px-4 text-center text-[10px] md:text-xs font-bold relative overflow-hidden group">
        <Link to="/terms-of-service" className="flex items-center justify-center gap-2 hover:underline">
          <ShieldCheck size={14} className="animate-pulse" />
          <span>We have updated our Terms of Service. <span className="underline decoration-white/50">Click here to read updates</span></span>
        </Link>
      </div>

      <Hero />

      {/* Featured Products (Safe Query) */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-[#f85606]">
                <Sparkles size={20} />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-black text-gray-900 uppercase tracking-tight">Featured Products</h2>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Handpicked for you</p>
              </div>
            </div>
            <Link to="/shop" className="flex items-center gap-1 text-[#f85606] text-xs font-bold hover:gap-2 transition-all">
              View All <ChevronRight size={16} />
            </Link>
          </div>

          {loadingFeatured ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="animate-spin text-[#f85606]" size={24} />
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-sm text-gray-400 font-medium">No featured products available.</p>
            </div>
          )}
        </div>
      </section>

      {/* Service Slider (Horizontal Scroll) */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex overflow-x-auto gap-3 px-4 py-4 no-scrollbar scroll-smooth">
            {[
              { icon: Truck, title: 'Fast Delivery', desc: 'Across Bangladesh' },
              { icon: ShieldCheck, title: 'Secure Payment', desc: '100% Safe Checkout' },
              { icon: RotateCcw, title: 'Easy Returns', desc: '7 Days Return Policy' },
              { icon: Headphones, title: '24/7 Support', desc: 'Dedicated Assistance' }
            ].map((item, i) => (
              <div 
                key={i} 
                className="flex-shrink-0 w-[150px] md:w-[180px] bg-white rounded-xl p-3 text-center shadow-sm border border-gray-50 hover:shadow-md transition-all"
              >
                <div className="flex justify-center mb-2">
                  <div className="bg-orange-50 p-2 rounded-full text-[#f85606]">
                    <item.icon size={24} />
                  </div>
                </div>
                <h3 className="text-[11px] md:text-xs font-bold text-[#111111] mb-0.5">{item.title}</h3>
                <p className="text-[9px] md:text-[10px] text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Categories - Auto Scrolling */}
      <section className="py-4 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">Top Categories</h2>
          <Link to="/categories" className="text-[11px] font-bold text-[#f85606]">View All</Link>
        </div>
        <div 
          className="relative"
          onTouchStart={() => setIsPaused(true)}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div 
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto px-4 no-scrollbar scroll-smooth"
          >
            {CATEGORIES.map((cat) => (
              <Link 
                key={cat.id} 
                to={`/category/${cat.slug}`}
                className="group flex flex-col items-center gap-2 min-w-[80px] md:min-w-[100px]"
              >
                <div className="w-[60px] h-[60px] md:w-[70px] md:h-[70px] rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#f85606] transition-all bg-gray-50 shadow-sm">
                  <img 
                    src={cat.image} 
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-[11px] md:text-[12px] font-bold text-[#111111] group-hover:text-[#f85606] transition-colors text-center line-clamp-1">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Category Sections (Core Requirement) */}
      {CATEGORIES.map((cat) => (
        <CategorySection 
          key={cat.id} 
          category={cat} 
        />
      ))}
    </div>
  );
}
