import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';
import { Product } from '@/src/types';
import { cn, formatPrice } from '@/src/lib/utils';
import { motion } from 'motion/react';
import { useCart } from '@/src/context/CartContext';
import { useWishlist } from '@/src/context/WishlistContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const isWishlisted = isInWishlist(product.id);

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock === 0) {
      alert('Product is out of stock');
      return;
    }
    navigate(`/checkout?productId=${product.id}&quantity=1`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={() => navigate(`/product/${product.id}`)}
      className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 cursor-pointer"
    >
      {/* Image Area */}
      <div className="relative h-[180px] overflow-hidden bg-gray-50 rounded-t-lg">
        <img 
          src={product.updatedAt ? `${product.image || product.images?.[0] || '/default-product.png'}?v=${new Date(product.updatedAt).getTime()}` : (product.image || product.images?.[0] || '/default-product.png')} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 rounded-[8px]"
          referrerPolicy="no-referrer"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/default-product.png';
          }}
        />
        
        {/* Badges */}
        <div className="absolute top-1.5 left-1.5 flex flex-col gap-1 z-10">
          {product.badges?.map((badge, idx) => (
            <span 
              key={idx}
              className={cn(
                "text-[9px] font-bold px-1.5 py-0.5 rounded uppercase flex items-center gap-1 shadow-sm",
                badge === 'Best Seller' && "bg-yellow-400 text-white",
                badge === 'New Arrival' && "bg-blue-500 text-white",
                badge === 'Hot Deal' && "bg-red-600 text-white",
                badge === 'Limited Stock' && "bg-orange-500 text-white"
              )}
            >
              {badge === 'Best Seller' && "⭐"}
              {badge === 'New Arrival' && "🆕"}
              {badge === 'Hot Deal' && "🔥"}
              {badge === 'Limited Stock' && "⚠️"}
              {badge}
            </span>
          ))}
          {product.isNew && !product.badges?.includes('New Arrival') && (
            <span className="bg-[#f85606] text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase shadow-sm">New</span>
          )}
          {product.stock === 0 && (
            <span className="bg-gray-800 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase shadow-sm">Sold Out</span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-1.5 right-1.5 flex flex-col gap-1.5 translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product); }}
            className={cn(
              "p-1.5 rounded-full shadow-sm transition-colors",
              isWishlisted ? "bg-[#f85606] text-white" : "bg-white text-gray-600 hover:bg-[#f85606] hover:text-white"
            )}
          >
            <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
          <Link 
            to={`/product/${product.id}`} 
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-1.5 rounded-full shadow-sm hover:bg-[#f85606] hover:text-white transition-colors"
          >
            <Eye size={16} />
          </Link>
        </div>

        {/* Add to Cart Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/50 to-transparent">
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product, 1); }}
            className="w-full bg-[#f85606] text-white py-1.5 rounded text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#d94800]"
          >
            <ShoppingCart size={14} /> Add to Cart
          </button>
        </div>
      </div>

      {/* Info Area */}
      <div className="p-2 md:p-3 space-y-1">
        <div onClick={(e) => e.stopPropagation()}>
          <Link to={`/product/${product.id}`} className="block">
            <h3 className="text-xs md:text-sm font-medium text-[#111111] line-clamp-1 group-hover:text-[#f85606] transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>
        
        <div className="flex items-center gap-1 text-[#F4B400]">
          <Star size={10} fill="currentColor" />
          <span className="text-[10px] text-gray-500">{(product.rating || 0).toFixed(1)} ({product.reviews || 0})</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#f85606] font-bold text-sm md:text-base">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="text-gray-400 line-through text-[10px] md:text-xs">{formatPrice(product.oldPrice)}</span>
          )}
        </div>

        <button 
          onClick={(e) => { e.stopPropagation(); handleBuyNow(e); }}
          className="w-full mt-2 py-1.5 border border-[#f85606] text-[#f85606] rounded text-[11px] md:text-xs font-bold hover:bg-[#f85606] hover:text-white transition-all"
        >
          Buy Now
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
