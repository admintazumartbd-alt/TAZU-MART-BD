import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, Heart, User, Menu, X, Phone, MessageCircle, Facebook, ShieldCheck, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useCart } from '@/src/context/CartContext';
import { useWishlist } from '@/src/context/WishlistContext';
import { useAuth } from '@/src/context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { Category } from '@/src/types';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems } = useCart();
  const { wishlist } = useWishlist();
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.email.toLowerCase() === 'admin.tazumartbd@gmail.com';

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Failed to fetch categories:", err));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
  };

  const toggleCategory = (id: string) => {
    setExpandedCategory(expandedCategory === id ? null : id);
  };

  return (
    <header className="w-full sticky top-0 z-50 bg-white shadow-sm">
      {/* Top Bar */}
      <div className="bg-[#111111] text-white h-[40px] md:h-[48px] flex items-center px-4 text-[11px] md:text-[13px]">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex items-center gap-3 md:gap-4">
            <span className="hidden sm:inline">Welcome to Tazu Mart BD</span>
            <span className="flex items-center gap-1">
              <Phone size={14} /> 01834800916
            </span>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            {isAdmin && (
              <Link to="/admin/monitoring" className="text-orange-400 font-bold hover:underline flex items-center gap-1">
                <ShieldCheck size={14} /> Admin
              </Link>
            )}
            <span className="hidden md:inline">Delivery: 2-5 Days</span>
            <div className="flex items-center gap-2 md:gap-3">
              <Facebook size={14} className="cursor-pointer hover:text-[#f85606]" />
              <MessageCircle size={14} className="cursor-pointer hover:text-[#f85606]" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 h-[56px] md:h-[64px] flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <h1 className="text-xl md:text-2xl font-bold text-[#f85606]">
            Tazu Mart <span className="text-[#111111]">BD</span>
          </h1>
        </Link>

        {/* Search Bar - Desktop */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg relative">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-4 pr-10 py-1.5 border-2 border-[#f85606] rounded-full focus:outline-none text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#f85606] text-white p-1 rounded-full hover:bg-[#d94800] transition-colors">
            <Search size={16} />
          </button>
        </form>

        {/* Icons */}
        <div className="flex items-center gap-3 md:gap-5">
          <Link to="/wishlist" className="hidden sm:flex flex-col items-center text-gray-600 hover:text-[#f85606] relative">
            <Heart size={20} />
            <span className="text-[9px] mt-0.5">Wishlist</span>
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#f85606] text-white text-[8px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-bold">{wishlist.length}</span>
            )}
          </Link>
          <Link to="/cart" className="flex flex-col items-center text-gray-600 hover:text-[#f85606] relative">
            <ShoppingCart size={20} />
            <span className="text-[9px] mt-0.5">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#f85606] text-white text-[8px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-bold">{totalItems}</span>
            )}
          </Link>
          <Link to={isAuthenticated ? "/account" : "/auth"} className="hidden sm:flex flex-col items-center text-gray-600 hover:text-[#f85606]">
            <User size={20} />
            <span className="text-[9px] mt-0.5">{isAuthenticated ? user?.name?.split(' ')[0] : 'Login'}</span>
          </Link>
          <button onClick={() => setIsMenuOpen(true)} className="md:hidden text-gray-600">
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Navigation Menu - Desktop */}
      <nav className="hidden md:block border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center gap-8 py-3 text-sm font-medium text-[#111111]">
            <li><Link to="/" className="hover:text-[#f85606]">Home</Link></li>
            <li><Link to="/shop" className="hover:text-[#f85606]">Shop</Link></li>
            <li className="relative group">
              <button className="flex items-center gap-1 hover:text-[#f85606]">
                Categories
                <ChevronDown size={14} />
              </button>
              <div className="absolute top-full left-0 w-[500px] bg-white shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-4 px-6 rounded-b-lg grid grid-cols-2 gap-6 z-50">
                {categories.map(cat => (
                  <div key={cat.id} className="space-y-2">
                    <Link to={`/category/${cat.slug}`} className="block font-bold text-[#f85606] hover:underline">
                      {cat.name}
                    </Link>
                    {cat.subcategories && cat.subcategories.length > 0 && (
                      <div className="grid grid-cols-1 gap-1 pl-2 border-l border-gray-100">
                        {cat.subcategories.map(sc => (
                          <Link key={sc.id} to={`/category/${sc.slug}`} className="text-xs text-gray-500 hover:text-[#f85606] transition-colors">
                            {sc.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </li>
            <li><Link to="/new-arrivals" className="hover:text-[#f85606]">New Arrivals</Link></li>
            <li><Link to="/best-selling" className="hover:text-[#f85606]">Best Selling</Link></li>
            <li><Link to="/offers" className="hover:text-[#f85606]">Offers</Link></li>
            <li><Link to="/about" className="hover:text-[#f85606]">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-[#f85606]">Contact Us</Link></li>
          </ul>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={cn(
        "fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 md:hidden",
        isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
      )} onClick={() => setIsMenuOpen(false)}>
        <div 
          className={cn(
            "fixed top-0 left-0 bottom-0 w-[80%] max-w-sm bg-white transition-transform duration-300",
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
          onClick={e => e.stopPropagation()}
        >
          <div className="p-4 flex justify-between items-center border-b">
            <h2 className="text-xl font-bold text-[#f85606]">Tazu Mart BD</h2>
            <button onClick={() => setIsMenuOpen(false)}><X size={24} /></button>
          </div>
          <div className="p-4">
            <form onSubmit={handleSearch} className="relative mb-6">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-4 pr-10 py-2 border rounded-lg focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={20} />
              </button>
            </form>
            <ul className="space-y-1 font-medium overflow-y-auto max-h-[calc(100vh-180px)] pr-2 custom-scrollbar">
              <li><Link to="/" onClick={() => setIsMenuOpen(false)} className="block py-2 hover:text-[#f85606]">Home</Link></li>
              <li><Link to="/shop" onClick={() => setIsMenuOpen(false)} className="block py-2 hover:text-[#f85606]">Shop</Link></li>
              
              <li className="py-2">
                <span className="block mb-3 text-gray-400 uppercase text-[10px] font-bold tracking-widest">Categories</span>
                <div className="space-y-1">
                  {categories.map(cat => {
                    const hasSub = cat.subcategories && cat.subcategories.length > 0;
                    const isExpanded = expandedCategory === cat.id;
                    
                    return (
                      <div key={cat.id} className="border-b border-gray-50 last:border-0">
                        <div className="flex items-center justify-between py-2">
                          <Link 
                            to={`/category/${cat.slug}`} 
                            onClick={() => setIsMenuOpen(false)} 
                            className={cn(
                              "text-sm transition-colors",
                              location.pathname === `/category/${cat.slug}` ? "font-bold text-[#f85606]" : "text-gray-700 hover:text-[#f85606]"
                            )}
                          >
                            {cat.name}
                          </Link>
                          {hasSub && (
                            <button 
                              onClick={() => toggleCategory(cat.id)}
                              className="p-1 text-gray-400 hover:text-[#f85606] transition-colors"
                            >
                              {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                            </button>
                          )}
                        </div>
                        
                        <AnimatePresence>
                          {hasSub && isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="pl-4 pb-2 space-y-1 max-h-[200px] overflow-y-auto custom-scrollbar">
                                {cat.subcategories!.map(sc => (
                                  <Link 
                                    key={sc.id} 
                                    to={`/category/${sc.slug}`} 
                                    onClick={() => setIsMenuOpen(false)} 
                                    className={cn(
                                      "block py-1.5 text-xs transition-colors",
                                      location.pathname === `/category/${sc.slug}` ? "font-bold text-[#f85606]" : "text-gray-500 hover:text-[#f85606]"
                                    )}
                                  >
                                    • {sc.name}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </li>

              <li><Link to="/new-arrivals" onClick={() => setIsMenuOpen(false)} className="block py-2 hover:text-[#f85606]">New Arrivals</Link></li>
              <li><Link to="/best-selling" onClick={() => setIsMenuOpen(false)} className="block py-2 hover:text-[#f85606]">Best Selling</Link></li>
              <li><Link to="/offers" onClick={() => setIsMenuOpen(false)} className="block py-2 hover:text-[#f85606]">Offers</Link></li>
              <li><Link to="/about" onClick={() => setIsMenuOpen(false)} className="block py-2 hover:text-[#f85606]">About Us</Link></li>
              <li><Link to="/contact" onClick={() => setIsMenuOpen(false)} className="block py-2 hover:text-[#f85606]">Contact Us</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
