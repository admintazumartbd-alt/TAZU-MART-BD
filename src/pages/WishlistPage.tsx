import { useWishlist } from '@/src/context/WishlistContext';
import ProductCard from '@/src/components/ProductCard';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WishlistPage() {
  const { wishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto text-gray-400">
          <Heart size={48} />
        </div>
        <h2 className="text-2xl font-bold">Your wishlist is empty</h2>
        <p className="text-gray-500">Save items you love to your wishlist and they'll appear here.</p>
        <Link to="/" className="inline-block bg-[#E91E63] text-white px-8 py-3 rounded-full font-bold hover:bg-[#c2185b] transition-all">
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        My Wishlist <span className="text-sm font-normal text-gray-400">({wishlist.length} items)</span>
      </h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {wishlist.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
