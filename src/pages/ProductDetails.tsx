import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '@/src/lib/api';
import { 
  ShoppingCart, Heart, Share2, ShieldCheck, Truck, RotateCcw, 
  Star, Plus, Minus, MessageCircle, CheckCircle2, AlertTriangle,
  ChevronLeft, ChevronRight, Info, FileText, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatPrice } from '@/src/lib/utils';
import ProductCard from '@/src/components/ProductCard';
import { MOCK_PRODUCTS } from '@/src/constants';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    userName: '',
    rating: 5,
    comment: '',
    images: [] as string[]
  });
  const imageRef = useRef<HTMLDivElement>(null);

  const fetchProduct = async () => {
    setIsLoading(true);
    try {
      try {
        const response = await api.get(`/api/product/${id}`);
        if (response.data) {
          setProduct(response.data);
          if (response.data.colors?.length > 0) {
            setSelectedColor(response.data.colors[0]);
          }
          const allResponse = await api.get('/api/admin/products');
          const related = allResponse.data.filter((p: any) => p.category === response.data.category && p.id !== id).slice(0, 4);
          setRelatedProducts(related.length > 0 ? related : MOCK_PRODUCTS.filter(p => p.category === response.data.category && p.id !== id).slice(0, 4));
          return;
        }
      } catch (apiError) {
        console.warn("API fetch failed, falling back to mock data:", apiError);
        // Try plural as fallback
        try {
          const response = await api.get(`/api/products/${id}`);
          if (response.data) {
            setProduct(response.data);
            if (response.data.colors?.length > 0) {
              setSelectedColor(response.data.colors[0]);
            }
            const allResponse = await api.get('/api/admin/products');
            const related = allResponse.data.filter((p: any) => p.category === response.data.category && p.id !== id).slice(0, 4);
            setRelatedProducts(related.length > 0 ? related : MOCK_PRODUCTS.filter(p => p.category === response.data.category && p.id !== id).slice(0, 4));
            return;
          }
        } catch (pluralError) {
          console.warn("Plural API fetch also failed:", pluralError);
        }
      }

      const foundProduct = MOCK_PRODUCTS.find((p: any) => p.id === id);
      if (foundProduct) {
        setProduct(foundProduct);
        if (foundProduct.colors?.length > 0) {
          setSelectedColor(foundProduct.colors[0]);
        }
        setRelatedProducts(MOCK_PRODUCTS.filter((p: any) => p.category === foundProduct.category && p.id !== id).slice(0, 4));
      }
    } catch (error) {
      console.error("Failed to fetch product:", error);
    } finally {
      setIsLoading(false);
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.userName || !reviewForm.comment) return;
    
    setIsSubmittingReview(true);
    try {
      await api.post(`/api/product/${id}/reviews`, reviewForm);
      setReviewForm({ userName: '', rating: 5, comment: '', images: [] });
      fetchProduct(); // Refresh product data to show new review
    } catch (error) {
      console.error("Failed to submit review:", error);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleReviewImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const formData = new FormData();
      (Array.from(files) as File[]).forEach(file => {
        formData.append('images', file);
      });

      try {
        const response = await api.post('/api/admin/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (response.data.urls) {
          setReviewForm(prev => ({ ...prev, images: [...prev.images, ...response.data.urls] }));
        }
      } catch (error) {
        console.error("Upload failed:", error);
        alert("Image upload failed.");
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setMousePos({ x, y });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-orange-100 border-t-[#FF6A00] rounded-full animate-spin" />
          <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] animate-pulse">Loading Premium Experience</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
          <Info size={48} className="text-gray-300" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Product not found</h2>
          <p className="text-gray-500 max-w-md">The product you are looking for might have been removed or is temporarily unavailable.</p>
        </div>
        <Link to="/" className="px-8 py-3 bg-[#FF6A00] text-white font-bold rounded-full hover:shadow-lg transition-all">
          Back to Home
        </Link>
      </div>
    );
  }

  const images = product.images?.length > 0 ? product.images : [product.image];
  const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

  return (
    <div className="bg-[#F8F8F8] min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 py-4 lg:py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 mb-6 overflow-x-auto whitespace-nowrap pb-2 lg:pb-0">
          <Link to="/" className="hover:text-[#FF6A00]">Home</Link>
          <ChevronRight size={12} />
          <Link to={`/category/${product.category}`} className="hover:text-[#FF6A00]">{product.category.replace('-', ' ')}</Link>
          <ChevronRight size={12} />
          <span className="text-gray-900 truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 bg-white rounded-3xl p-4 lg:p-8 shadow-sm border border-gray-100">
          {/* Left: Image Section */}
          <div className="space-y-6">
            <div 
              className="relative h-[240px] md:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden bg-gray-50 cursor-zoom-in group"
              ref={imageRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
            >
              <AnimatePresence mode="wait">
                <motion.img 
                  key={currentImageIndex}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  src={product.updatedAt ? `${images[currentImageIndex] || '/default-product.png'}?v=${new Date(product.updatedAt).getTime()}` : (images[currentImageIndex] || '/default-product.png')} 
                  alt={product.name}
                  className={cn(
                    "w-full h-full object-cover transition-transform duration-200",
                    isZoomed ? "scale-150" : "scale-100"
                  )}
                  style={isZoomed ? {
                    transformOrigin: `${mousePos.x}% ${mousePos.y}%`
                  } : {}}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/default-product.png';
                  }}
                />
              </AnimatePresence>
              
              {/* Image Navigation Arrows */}
              <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <button 
                  onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1)); }}
                  className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg pointer-events-auto hover:bg-white"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0)); }}
                  className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg pointer-events-auto hover:bg-white"
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              {/* Discount Badge */}
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-[#FF6A00] text-white text-sm font-black px-3 py-1.5 rounded-lg shadow-lg">
                  {discount}% OFF
                </div>
              )}
              
              <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded-md">
                {currentImageIndex + 1} / {images.length}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {images.map((img: string, i: number) => (
                <button 
                  key={i}
                  onClick={() => setCurrentImageIndex(i)}
                  className={cn(
                    "flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all",
                    currentImageIndex === i ? "border-[#FF6A00] shadow-md" : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <img 
                    src={product.updatedAt ? `${img || '/default-product.png'}?v=${new Date(product.updatedAt).getTime()}` : (img || '/default-product.png')} 
                    alt="" 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/default-product.png';
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info Section */}
          <div className="flex flex-col h-full">
            <div className="flex-1 space-y-6">
              {/* Title & Trust Info */}
              <div className="space-y-3">
                <h1 
                  className="text-2xl lg:text-3xl leading-tight text-gray-900"
                  style={{ 
                    fontSize: product.titleSize || 'inherit',
                    fontWeight: product.titleWeight === 'bold' ? 900 : 500
                  }}
                >
                  {product.name}
                </h1>
                
                {/* Price Block - Moved up */}
                <div className="flex items-end gap-3">
                  <span className="text-2xl lg:text-3xl font-black text-[#FF6A00]">{formatPrice(product.price)}</span>
                  {product.oldPrice && (
                    <span className="text-sm text-gray-400 line-through mb-1">{formatPrice(product.oldPrice)}</span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="flex text-[#F4B400]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={14} fill={i < Math.floor(product.rating || 0) ? "currentColor" : "none"} className={i < Math.floor(product.rating || 0) ? "" : "text-gray-200"} />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-gray-400">({product.reviews || 0} Reviews)</span>
                  </div>
                  <div className="h-4 w-px bg-gray-200" />
                  <span className="text-xs font-bold text-gray-600">{product.soldCount || 0} Sold</span>
                  <div className="flex items-center gap-1 text-green-600 text-[10px] font-bold uppercase tracking-wider">
                    <CheckCircle2 size={12} /> Verified Product
                  </div>
                </div>
              </div>

              {/* Stock Urgency */}
              <div className="space-y-3">
                {product.stock <= 5 && product.stock > 0 && (
                  <div className="flex items-center gap-2 text-rose-600 font-bold text-xs animate-pulse">
                    <AlertTriangle size={14} />
                    ⚠ Only {product.stock} left in stock - Order soon!
                  </div>
                )}
                {product.stock === 0 && (
                  <div className="flex items-center gap-2 text-gray-400 font-bold text-xs">
                    <AlertTriangle size={14} />
                    Out of Stock
                  </div>
                )}
              </div>

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Select Color:</span>
                    <span className="text-xs font-bold text-gray-900">{selectedColor?.name}</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color: any, i: number) => (
                      <button
                        key={i}
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                          "group relative flex flex-col items-center gap-1.5 p-0.5 rounded-full transition-all",
                          selectedColor?.name === color.name ? "ring-2 ring-[#FF6A00] ring-offset-2" : "hover:scale-105"
                        )}
                      >
                        <div 
                          className="w-10 h-10 rounded-full border-2 border-white shadow-sm flex items-center justify-center overflow-hidden"
                          style={{ backgroundColor: color.hex }}
                        >
                          {selectedColor?.name === color.name && (
                            <CheckCircle2 size={20} className={cn(
                              "text-white drop-shadow-md",
                              color.hex.toLowerCase() === '#ffffff' ? "text-gray-900" : ""
                            )} />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center gap-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Quantity:</span>
                <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 font-bold text-lg hover:text-gray-900 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-10 text-center font-black text-base">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 font-bold text-lg hover:text-gray-900 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stock: {product.stock}</span>
              </div>

              {/* Conversion Boost Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                  <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest text-gray-900">
                    <Truck size={16} className="text-[#FF6A00]" /> Delivery Info
                  </div>
                  <ul className="space-y-1 text-xs font-medium text-gray-600">
                    <li className="flex justify-between">
                      <span>Inside Dhaka:</span>
                      <span className="font-bold text-gray-900">60৳</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Outside Dhaka:</span>
                      <span className="font-bold text-gray-900">120৳</span>
                    </li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                  <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest text-gray-900">
                    <RotateCcw size={16} className="text-[#FF6A00]" /> Return & Warranty
                  </div>
                  <ul className="space-y-1 text-xs font-medium text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={12} className="text-green-500" /> 7 Days Return
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={12} className="text-green-500" /> 3 Months Warranty
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Actions (Add to Cart | Order Now) */}
        <div className="mt-8 p-[15px]">
          <button 
            disabled={product.stock === 0}
            className={cn(
              "w-full bg-[#0f172a] text-white p-[14px] rounded-[10px] mb-[10px] text-[15px] font-bold flex items-center justify-center gap-3 transition-all active:scale-95",
              product.stock === 0 && "opacity-50 cursor-not-allowed"
            )}
          >
            <ShoppingCart size={20} /> Add to Cart
          </button>
          <button 
            onClick={() => navigate(`/checkout?productId=${product.id}&quantity=${quantity}${selectedColor ? `&color=${selectedColor.name}` : ''}`)}
            disabled={product.stock === 0}
            className={cn(
              "w-full bg-[#ff6a00] text-white p-[14px] rounded-[10px] text-[15px] font-bold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-orange-100",
              product.stock === 0 && "opacity-50 cursor-not-allowed"
            )}
          >
            Order Now
          </button>
        </div>

        {/* Product Details (Vertical Stacked Cards) */}
        <div className="mt-6 space-y-4 px-[15px]">
          {/* Description Card */}
          <div className="bg-white rounded-[12px] p-[15px] shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-gray-50">
            <h3 className="text-[16px] mb-3 text-[#222] font-bold flex items-center gap-2">
              <FileText size={18} className="text-[#FF6A00]" /> Description
            </h3>
            <div className="prose max-w-none text-gray-600 leading-relaxed">
              {product.description ? (
                <p 
                  className="text-[14px] text-[#666] leading-[1.5]"
                  style={{ 
                    fontSize: product.descriptionSize || 'inherit',
                    fontWeight: product.descriptionWeight === 'bold' ? 'bold' : 'normal'
                  }}
                >
                  {product.description}
                </p>
              ) : (
                <div className="text-center text-[#aaa] text-[13px] py-4">
                  No description added yet
                </div>
              )}
            </div>
          </div>

          {/* Specifications Card */}
          <div className="bg-white rounded-[12px] p-[15px] shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-gray-50">
            <h3 className="text-[16px] mb-3 text-[#222] font-bold flex items-center gap-2">
              <Settings size={18} className="text-[#FF6A00]" /> Specifications
            </h3>
            <div className="space-y-2">
              {product.specifications ? Object.entries(product.specifications).map(([key, value]: [string, any]) => (
                <div key={key} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                  <span className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">{key}</span>
                  <span className="text-[13px] font-black text-gray-900">{value}</span>
                </div>
              )) : (
                <div className="text-center text-[#aaa] text-[13px] py-4">
                  No specifications listed
                </div>
              )}
            </div>
          </div>

          {/* Reviews Card */}
          <div className="bg-white rounded-[12px] p-[15px] shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-gray-50">
            <h3 className="text-[16px] mb-4 text-[#222] font-bold flex items-center gap-2">
              <Star size={18} className="text-[#FF6A00]" /> Customer Reviews
            </h3>
            
            <div className="space-y-8">
              {/* Review Summary */}
              <div className="flex flex-col md:flex-row items-center gap-8 p-6 bg-orange-50/30 rounded-2xl border border-orange-100">
                <div className="text-center">
                  <div className="text-4xl font-black text-gray-900">{product.rating || 0}</div>
                  <div className="flex text-[#F4B400] my-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={16} fill={i < Math.floor(product.rating || 0) ? "currentColor" : "none"} className={i < Math.floor(product.rating || 0) ? "" : "text-gray-200"} />
                    ))}
                  </div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.reviews || 0} Reviews</div>
                </div>
                <div className="flex-1 w-full space-y-1.5">
                  {[5, 4, 3, 2, 1].map(star => (
                    <div key={star} className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-gray-400 w-3">{star}</span>
                      <div className="flex-1 h-1.5 bg-white rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#F4B400]" 
                          style={{ width: star === 5 ? '80%' : star === 4 ? '15%' : '5%' }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review Form */}
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-6">
                <h4 className="text-[12px] font-black text-gray-900 uppercase tracking-widest">Write a Review</h4>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Your Name</label>
                      <input 
                        type="text" 
                        required
                        className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-xs font-bold outline-none focus:border-[#FF6A00]"
                        value={reviewForm.userName}
                        onChange={e => setReviewForm({ ...reviewForm, userName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Rating</label>
                      <div className="flex gap-2 mt-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                            className={cn(
                              "transition-colors",
                              reviewForm.rating >= star ? "text-[#F4B400]" : "text-gray-200"
                            )}
                          >
                            <Star size={24} fill={reviewForm.rating >= star ? "currentColor" : "none"} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Your Comment</label>
                    <textarea 
                      rows={3}
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-xs font-bold outline-none focus:border-[#FF6A00] resize-none"
                      value={reviewForm.comment}
                      onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Upload Images</label>
                    <div className="flex flex-wrap gap-2">
                      {reviewForm.images.map((img, idx) => (
                        <div key={idx} className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                          <img src={img} alt="Review" className="w-full h-full object-cover" />
                        </div>
                      ))}
                      <label className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-[#FF6A00] hover:bg-orange-50 transition-all">
                        <Plus size={20} className="text-gray-400" />
                        <input type="file" multiple className="hidden" onChange={handleReviewImageUpload} accept="image/*" />
                      </label>
                    </div>
                  </div>
                  <button 
                    type="submit"
                    disabled={isSubmittingReview}
                    className="w-full py-4 bg-[#FF6A00] text-white font-black uppercase tracking-widest rounded-xl shadow-lg shadow-orange-100 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isSubmittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              </div>

              {/* Review List */}
              <div className="space-y-6">
                {product.productReviews && product.productReviews.length > 0 ? (
                  product.productReviews.map((review: any) => (
                    <div key={review.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 font-black shadow-sm">
                            {review.userName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-black text-gray-900">{review.userName}</p>
                            <div className="flex text-[#F4B400]">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} size={10} fill={i < review.rating ? "currentColor" : "none"} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{review.comment}</p>
                      {review.images && review.images.length > 0 && (
                        <div className="flex gap-2">
                          {review.images.map((img: string, idx: number) => (
                            <img key={idx} src={img} alt="Review" className="w-16 h-16 rounded-lg object-cover border border-gray-100" />
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-400 font-bold uppercase tracking-widest">
                    No reviews yet. Be the first to review!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Related Products</h2>
            <Link to={`/category/${product.category}`} className="text-sm font-black text-[#FF6A00] uppercase tracking-widest hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
