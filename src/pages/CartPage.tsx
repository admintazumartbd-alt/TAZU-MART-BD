import { Link } from 'react-router-dom';
import { useCart } from '@/src/context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/src/lib/utils';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto text-gray-400">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <p className="text-gray-500">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/" className="inline-block bg-[#E91E63] text-white px-8 py-3 rounded-full font-bold hover:bg-[#c2185b] transition-all">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart ({totalItems})</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                <img src={item.image || item.images?.[0] || 'https://picsum.photos/seed/placeholder/200/200'} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-grow space-y-1">
                <Link to={`/product/${item.id}`} className="font-bold hover:text-[#E91E63] transition-colors line-clamp-1">
                  {item.name}
                </Link>
                <p className="text-sm text-gray-500 capitalize">{item.category.replace('-', ' ')}</p>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center border rounded-lg">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:text-[#E91E63]"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:text-[#E91E63]"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-[#E91E63]">{formatPrice(item.price * item.quantity)}</span>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-xl font-bold border-b pb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-bold">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className="text-green-600 font-medium">Calculated at checkout</span>
              </div>
            </div>
            <div className="border-t pt-4 flex justify-between items-center">
              <span className="font-bold">Total</span>
              <span className="text-2xl font-bold text-[#E91E63]">{formatPrice(totalPrice)}</span>
            </div>
            <Link 
              to="/checkout" 
              className="w-full bg-[#E91E63] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#c2185b] transition-all"
            >
              Proceed to Checkout <ArrowRight size={20} />
            </Link>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300">
            <p className="text-xs text-gray-500 text-center">
              Safe and secure checkout. We accept Cash on Delivery, bKash, and Nagad.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
