import { Link, useLocation } from 'react-router-dom';
import { Home, Headphones, Search, Heart, ShoppingCart, User } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useCart } from '@/src/context/CartContext';
import { useWishlist } from '@/src/context/WishlistContext';

export default function MobileBottomNav() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { totalItems } = useCart();
  const { wishlist } = useWishlist();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Headphones, label: 'Support', path: '/support' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Heart, label: 'Wishlist', path: '/wishlist', badge: wishlist.length },
    { icon: ShoppingCart, label: 'Cart', path: '/cart', badge: totalItems },
    { icon: User, label: 'Account', path: '/account' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 md:hidden flex items-center justify-around py-2 px-4 shadow-lg">
      {navItems.map((item) => {
        const isActive = currentPath === item.path;
        const Icon = item.icon;
        
        return (
          <Link 
            key={item.path} 
            to={item.path}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors relative",
              isActive ? "text-[#E91E63]" : "text-gray-500"
            )}
          >
            <Icon size={20} className={isActive ? "fill-current" : ""} />
            <span className="text-[10px] font-medium">{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#E91E63] text-white text-[8px] w-3.5 h-3.5 flex items-center justify-center rounded-full">
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
