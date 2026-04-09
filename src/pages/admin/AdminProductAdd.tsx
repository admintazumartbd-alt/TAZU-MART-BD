import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../lib/api';
import { 
  Package, Tag, Layers, Box, Image as ImageIcon, Plus, X, Save, ArrowLeft,
  ChevronRight, Info, DollarSign, Hash, Palette, Maximize, CloudUpload,
  CheckCircle2, AlertCircle, Sparkles, Eye, EyeOff, Trash2, PlusCircle, Settings,
  List, Check, Video, ShoppingCart, Truck, Star, ChevronDown, ChevronUp,
  GripVertical, LayoutGrid, Type, FileText, ShieldCheck, RefreshCw, MoreVertical,
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List as ListIcon,
  Type as TypeIcon, ChevronDown as ChevronDownIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent 
} from '@dnd-kit/core';
import { 
  arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, 
  rectSortingStrategy, useSortable 
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn, formatPrice } from '@/src/lib/utils';
import { Category, Product, Review } from '@/src/types';

// Sortable Image Component
function SortableImage({ id, url, isThumbnail, onRemove, onSetThumbnail }: { 
  id: string; 
  url: string; 
  isThumbnail: boolean;
  onRemove: () => void;
  onSetThumbnail: () => void;
  key?: any;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={cn(
        "relative aspect-square rounded-[14px] overflow-hidden group border-2 transition-all",
        isThumbnail ? "border-[#6366f1] shadow-lg shadow-indigo-100" : "border-gray-100 shadow-sm"
      )}
    >
      <img src={url} alt="Product" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      
      {/* Drag Handle */}
      <div 
        {...attributes} {...listeners}
        className="absolute top-2 left-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <GripVertical size={14} className="text-gray-500" />
      </div>

      {/* Thumbnail Badge */}
      {isThumbnail && (
        <div className="absolute top-2 right-2 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-white px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-sm">
          Thumbnail
        </div>
      )}

      {/* Hover Actions */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        {!isThumbnail && (
          <button 
            type="button"
            onClick={onSetThumbnail}
            className="p-2 bg-white text-[#6366f1] rounded-xl hover:scale-110 transition-transform shadow-lg"
            title="Set as Thumbnail"
          >
            <Star size={16} fill="currentColor" />
          </button>
        )}
        <button 
          type="button"
          onClick={onRemove}
          className="p-2 bg-rose-500 text-white rounded-xl hover:scale-110 transition-transform shadow-lg"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export default function AdminProductAdd() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  // UI States
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(isEdit);
  const [activeTab, setActiveTab] = useState<'main' | 'colors'>('main');
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(false);
  
  // Data States
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [thumbnailIndex, setThumbnailIndex] = useState(0);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subcategories: [] as string[],
    brand: '',
    seoDescription: '',
    description: '',
    weightVolume: '',
    price: '', // Sell Price
    oldPrice: '', // Regular Price
    buyingPrice: '', // Admin Only (Hidden from customers)
    soldCount: '', // Initial Sold Count
    sku: '',
    stock: '', // Quantity
    unitName: 'pcs',
    stockAlert: '5',
    status: 'ACTIVE',
    condition: 'New',
    videoLink: '',
    show_in_home: true,
    is_featured: false,
    isNewArrival: false,
    isBestSelling: false,
    isOfferProduct: false,
    colors: [] as { name: string; hex: string; visible: boolean; extraPrice: number }[],
    specifications: [] as { title: string; description: string }[],
    deliveryCharges: {
      dhaka: 70,
      others: 120
    },
    reviews: [] as Review[]
  });

  // Review System State
  const [newReview, setNewReview] = useState({
    userName: '',
    comment: '',
    rating: 5,
    image: ''
  });

  // Color Manager State
  const [newColor, setNewColor] = useState({ name: '', hex: '#000000', visible: true, extraPrice: 0 });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories');
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();

    if (isEdit) {
      const fetchProduct = async () => {
        try {
          const response = await axios.get(`/api/products/${id}`);
          const p = response.data;
          if (p && typeof p === 'object' && !p.error) {
            setFormData({
              name: p.name || '',
              category: p.category || '',
              subcategories: p.subcategories || [],
              brand: p.brand || '',
              seoDescription: p.seoDescription || '',
              description: p.description || '',
              weightVolume: p.weightVolume || '',
              price: p.price?.toString() || '',
              oldPrice: p.oldPrice?.toString() || '',
              buyingPrice: p.buyingPrice?.toString() || '',
              soldCount: p.soldCount?.toString() || '0',
              sku: p.sku || '',
              stock: p.stock?.toString() || '',
              unitName: p.unitName || 'pcs',
              stockAlert: p.stockAlert?.toString() || '5',
              status: p.status || 'ACTIVE',
              condition: p.condition || 'New',
              videoLink: p.videoLink || '',
              show_in_home: p.show_in_home ?? true,
              is_featured: p.is_featured ?? false,
              isNewArrival: p.isNewArrival ?? false,
              isBestSelling: p.isBestSelling ?? false,
              isOfferProduct: p.isOfferProduct ?? false,
              colors: p.colors || [],
              specifications: p.specifications ? Object.entries(p.specifications).map(([title, description]) => ({ title, description })) : [],
              deliveryCharges: p.deliveryCharges || { dhaka: 70, others: 120 },
              reviews: p.productReviews || []
            });
            setImages(p.images || [p.image]);
            const thumbIdx = (p.images || [p.image]).indexOf(p.image);
            setThumbnailIndex(thumbIdx !== -1 ? thumbIdx : 0);
          }
        } catch (error) {
          console.error("Failed to fetch product for edit:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEdit]);

  const toggleSubcategory = (slug: string) => {
    setFormData(prev => ({
      ...prev,
      subcategories: prev.subcategories.includes(slug)
        ? prev.subcategories.filter(s => s !== slug)
        : [...prev.subcategories, slug]
    }));
  };

  const selectedCategoryData = categories.find(c => c.slug === formData.category);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const formData = new FormData();
      (Array.from(files) as File[]).forEach(file => {
        formData.append('images', file);
      });

      try {
        const response = await axios.post('/api/admin/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (response.data.urls) {
          setImages([...images, ...response.data.urls]);
        }
      } catch (error) {
        console.error("Upload failed:", error);
        alert("Image upload failed. Please try again.");
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    if (thumbnailIndex === index) setThumbnailIndex(0);
    else if (thumbnailIndex > index) setThumbnailIndex(thumbnailIndex - 1);
  };

  const addColor = () => {
    if (newColor.name && newColor.hex) {
      setFormData({
        ...formData,
        colors: [...formData.colors, { ...newColor }]
      });
      setNewColor({ name: '', hex: '#000000', visible: true, extraPrice: 0 });
    }
  };

  const removeColor = (index: number) => {
    setFormData({
      ...formData,
      colors: formData.colors.filter((_, i) => i !== index)
    });
  };

  const addSpec = () => {
    setFormData({
      ...formData,
      specifications: [...formData.specifications, { title: '', description: '' }]
    });
  };

  const updateSpec = (index: number, field: 'title' | 'description', value: string) => {
    const newSpecs = [...formData.specifications];
    newSpecs[index][field] = value;
    setFormData({ ...formData, specifications: newSpecs });
  };

  const removeSpec = (index: number) => {
    setFormData({
      ...formData,
      specifications: formData.specifications.filter((_, i) => i !== index)
    });
  };

  const addReview = () => {
    if (newReview.userName && newReview.comment) {
      const review: Review = {
        id: Math.random().toString(36).substr(2, 9),
        productId: id || 'temp',
        userName: newReview.userName,
        rating: newReview.rating,
        comment: newReview.comment,
        images: newReview.image ? [newReview.image] : [],
        createdAt: new Date().toISOString(),
        status: 'APPROVED'
      };
      setFormData({
        ...formData,
        reviews: [review, ...formData.reviews]
      });
      setNewReview({ userName: '', comment: '', rating: 5, image: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    setIsSaving(true);
    try {
      if (!formData.name || !formData.category || !formData.price) {
        alert("Please fill in all required fields (Name, Category, Price).");
        setIsSaving(false);
        return;
      }

      if (images.length === 0) {
        alert("Please upload at least one product image.");
        setIsSaving(false);
        return;
      }

      // Convert specifications array back to object for backend if needed, 
      // but the interface says Record<string, string>. 
      // Let's keep it as object for compatibility.
      const specsObj: Record<string, string> = {};
      formData.specifications.forEach(s => {
        if (s.title) specsObj[s.title] = s.description;
      });

      const productData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        oldPrice: formData.oldPrice ? parseFloat(formData.oldPrice) : null,
        buyingPrice: formData.buyingPrice ? parseFloat(formData.buyingPrice) : null,
        stock: parseInt(formData.stock) || 0,
        soldCount: parseInt(formData.soldCount) || 0,
        stockAlert: parseInt(formData.stockAlert) || 5,
        specifications: specsObj,
        images,
        image: images[thumbnailIndex] || images[0] || '',
        show_in_home: formData.show_in_home,
        is_featured: formData.is_featured,
        isNewArrival: formData.isNewArrival,
        isBestSelling: formData.isBestSelling,
        isOfferProduct: formData.isOfferProduct,
        updatedAt: new Date().toISOString()
      };

      if (isEdit) {
        await axios.put(`/api/admin/products/${id}`, productData);
      } else {
        await axios.post('/api/admin/products', {
          ...productData,
          createdAt: new Date().toISOString(),
          rating: 5,
          reviews: formData.reviews.length
        });
      }
      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      alert("Failed to save product. Please check your connection.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="w-12 h-12 border-4 border-indigo-100 border-t-[#6366f1] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-32 animate-in fade-in duration-700">
      <div className="max-w-4xl mx-auto px-4 md:px-0 space-y-4 pt-6">
      {/* Header Section */}
      <div className="flex items-center justify-between gap-4 sticky top-0 z-40 bg-[#f8fafc]/80 backdrop-blur-md py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/admin/products')}
            className="w-10 h-10 flex items-center justify-center bg-white rounded-[14px] text-gray-400 hover:text-[#6366f1] shadow-sm border border-gray-100 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-black text-gray-900 tracking-tighter uppercase">
            {isEdit ? 'Edit' : 'Add'} <span className="text-[#6366f1]">Product</span>
          </h1>
        </div>
        
        <button 
          onClick={handleSubmit}
          disabled={isSaving}
          className={cn(
            "h-[44px] flex items-center gap-2 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-white px-6 rounded-[14px] text-sm font-bold shadow-lg shadow-indigo-100 hover:opacity-90 transition-all",
            isSaving && "opacity-50 cursor-not-allowed"
          )}
        >
          {isSaving ? (
            <RefreshCw size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'main' ? (
          <motion.div 
            key="main-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* 1. IMAGE SECTION */}
            <div className="bg-white p-4 rounded-[16px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-[#6366f1]">
                    <ImageIcon size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Product Gallery</h3>
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">{images.length} / 100</span>
              </div>

              <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <div className="grid grid-cols-3 gap-3">
                  <SortableContext 
                    items={images}
                    strategy={rectSortingStrategy}
                  >
                    {images.map((img, idx) => (
                      <SortableImage 
                        key={img} 
                        id={img} 
                        url={img} 
                        isThumbnail={thumbnailIndex === idx}
                        onRemove={() => removeImage(idx)}
                        onSetThumbnail={() => setThumbnailIndex(idx)}
                      />
                    ))}
                  </SortableContext>
                  
                  {images.length < 100 && (
                    <label className="aspect-square rounded-[14px] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#6366f1] hover:bg-indigo-50/30 transition-all group">
                      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-[#6366f1] transition-all">
                        <CloudUpload size={20} />
                      </div>
                      <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest group-hover:text-[#6366f1]">Upload</span>
                      <input type="file" multiple className="hidden" onChange={handleImageUpload} accept="image/*" />
                    </label>
                  )}
                </div>
              </DndContext>
              
              <p className="text-[9px] text-gray-400 font-medium text-center uppercase tracking-widest">
                Drag to reorder • First image is default thumbnail
              </p>
            </div>

            {/* 2. BASIC INFO */}
            <div className="bg-white p-4 rounded-[16px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <FileText size={20} />
                </div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Basic Details</h3>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Product Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Enter product name"
                    className="w-full h-[44px] px-3 bg-white border border-[#e5e7eb] rounded-[14px] text-sm font-medium outline-none focus:border-[#6366f1] transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Category</label>
                    <select 
                      required
                      className="w-full h-[44px] px-3 bg-white border border-[#e5e7eb] rounded-[14px] text-sm font-medium outline-none focus:border-[#6366f1] transition-all appearance-none"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value, subcategories: [] })}
                    >
                      <option value="">Select</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.slug}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Brand</label>
                    <input 
                      type="text" 
                      placeholder="Brand name"
                      className="w-full h-[44px] px-3 bg-white border border-[#e5e7eb] rounded-[14px] text-sm font-medium outline-none focus:border-[#6366f1] transition-all"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">SEO Description (160 chars)</label>
                  <input 
                    type="text" 
                    maxLength={160}
                    placeholder="Short SEO friendly description"
                    className="w-full h-[44px] px-3 bg-white border border-[#e5e7eb] rounded-[14px] text-sm font-medium outline-none focus:border-[#6366f1] transition-all"
                    value={formData.seoDescription}
                    onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* 3. DESCRIPTION EDITOR */}
            <div className="bg-white p-4 rounded-[16px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                  <TypeIcon size={20} />
                </div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Product Description</h3>
              </div>

              <div className="border border-[#e5e7eb] rounded-[14px] overflow-hidden">
                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-[#e5e7eb]">
                  <button type="button" className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-600"><Bold size={16} /></button>
                  <button type="button" className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-600"><Italic size={16} /></button>
                  <button type="button" className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-600"><Underline size={16} /></button>
                  <div className="w-px h-4 bg-gray-200 mx-1" />
                  <button type="button" className="flex items-center gap-1 px-2 py-1.5 hover:bg-white hover:shadow-sm rounded-lg transition-all text-[11px] font-bold text-gray-600">
                    Font <ChevronDownIcon size={12} />
                  </button>
                  <button type="button" className="flex items-center gap-1 px-2 py-1.5 hover:bg-white hover:shadow-sm rounded-lg transition-all text-[11px] font-bold text-gray-600">
                    14px <ChevronDownIcon size={12} />
                  </button>
                  <div className="w-px h-4 bg-gray-200 mx-1" />
                  <button type="button" className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-600"><AlignLeft size={16} /></button>
                  <button type="button" className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-600"><AlignCenter size={16} /></button>
                  <button type="button" className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-600"><AlignRight size={16} /></button>
                  <div className="w-px h-4 bg-gray-200 mx-1" />
                  <button type="button" className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-600"><ListIcon size={16} /></button>
                </div>
                
                {/* Editor Area */}
                <textarea 
                  rows={6}
                  placeholder="Detailed product description..."
                  className="w-full p-3 bg-white text-sm font-medium outline-none min-h-[120px] resize-none leading-relaxed"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            {/* 4. STATUS + CONDITION + HOME */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-[16px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] space-y-3">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Status</label>
                <select
                  className="w-full h-[44px] px-3 bg-white border border-[#e5e7eb] rounded-[14px] text-sm font-bold outline-none focus:border-[#6366f1] transition-all appearance-none text-gray-900"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="HIDDEN">HIDDEN</option>
                </select>
              </div>

              <div className="bg-white p-4 rounded-[16px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] space-y-3">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Condition</label>
                <select
                  className="w-full h-[44px] px-3 bg-white border border-[#e5e7eb] rounded-[14px] text-sm font-bold outline-none focus:border-[#6366f1] transition-all appearance-none text-gray-900"
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value as any })}
                >
                  <option value="New">New</option>
                  <option value="Used">Used</option>
                  <option value="Refurbished">Refurbished</option>
                </select>
              </div>

              <div className="bg-white p-4 rounded-[16px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] space-y-3">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Show in Home</label>
                <div className="flex items-center h-[44px]">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, show_in_home: !formData.show_in_home })}
                    className={cn(
                      "w-12 h-6 rounded-full transition-all relative",
                      formData.show_in_home ? "bg-[#FF6A00]" : "bg-gray-200"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                      formData.show_in_home ? "left-7" : "left-1"
                    )} />
                  </button>
                  <span className="ml-3 text-xs font-bold text-gray-500 uppercase">
                    {formData.show_in_home ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-[16px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] space-y-3">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Featured Product</label>
                <div className="flex items-center h-[44px]">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, is_featured: !formData.is_featured })}
                    className={cn(
                      "w-12 h-6 rounded-full transition-all relative",
                      formData.is_featured ? "bg-indigo-600" : "bg-gray-200"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                      formData.is_featured ? "left-7" : "left-1"
                    )} />
                  </button>
                  <span className="ml-3 text-xs font-bold text-gray-500 uppercase">
                    {formData.is_featured ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-[16px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] space-y-3">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">New Arrival</label>
                <div className="flex items-center h-[44px]">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isNewArrival: !formData.isNewArrival })}
                    className={cn(
                      "w-12 h-6 rounded-full transition-all relative",
                      formData.isNewArrival ? "bg-emerald-600" : "bg-gray-200"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                      formData.isNewArrival ? "left-7" : "left-1"
                    )} />
                  </button>
                  <span className="ml-3 text-xs font-bold text-gray-500 uppercase">
                    {formData.isNewArrival ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-[16px] shadow-[0_4px_12_rgba(0,0,0,0.05)] space-y-3">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Best Selling</label>
                <div className="flex items-center h-[44px]">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isBestSelling: !formData.isBestSelling })}
                    className={cn(
                      "w-12 h-6 rounded-full transition-all relative",
                      formData.isBestSelling ? "bg-amber-600" : "bg-gray-200"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                      formData.isBestSelling ? "left-7" : "left-1"
                    )} />
                  </button>
                  <span className="ml-3 text-xs font-bold text-gray-500 uppercase">
                    {formData.isBestSelling ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-[16px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] space-y-3">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Offer Product</label>
                <div className="flex items-center h-[44px]">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isOfferProduct: !formData.isOfferProduct })}
                    className={cn(
                      "w-12 h-6 rounded-full transition-all relative",
                      formData.isOfferProduct ? "bg-rose-600" : "bg-gray-200"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                      formData.isOfferProduct ? "left-7" : "left-1"
                    )} />
                  </button>
                  <span className="ml-3 text-xs font-bold text-gray-500 uppercase">
                    {formData.isOfferProduct ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {/* 5. PRODUCT VIDEO */}
            <div className="bg-white p-4 rounded-[16px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
                  <Video size={20} />
                </div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Product Video</h3>
              </div>
              <input 
                type="url" 
                placeholder="YouTube / Facebook Video Link"
                className="w-full h-[44px] px-3 bg-white border border-[#e5e7eb] rounded-[14px] text-sm font-medium outline-none focus:border-[#6366f1] transition-all"
                value={formData.videoLink}
                onChange={(e) => setFormData({ ...formData, videoLink: e.target.value })}
              />
            </div>

            {/* 7. VARIANT SECTION */}
            <div className="bg-white p-4 rounded-[16px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                  <Palette size={20} />
                </div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Variants</h3>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Weight / Volume (e.g. 6ml, 12ml)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 50ml, 100g"
                    className="w-full h-[44px] px-3 bg-white border border-[#e5e7eb] rounded-[14px] text-sm font-medium outline-none focus:border-[#6366f1] transition-all"
                    value={formData.weightVolume}
                    onChange={(e) => setFormData({ ...formData, weightVolume: e.target.value })}
                  />
                </div>

                <button 
                  type="button"
                  onClick={() => setActiveTab('colors')}
                  className="w-full flex items-center justify-between p-3 bg-white rounded-[14px] border border-[#e5e7eb] hover:border-[#6366f1] transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {formData.colors.slice(0, 3).map((c, i) => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: c.hex }} />
                      ))}
                      {formData.colors.length > 3 && (
                        <div className="w-6 h-6 rounded-full bg-gray-50 border-2 border-white flex items-center justify-center text-[8px] font-bold">
                          +{formData.colors.length - 3}
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-bold text-gray-700">Manage Colors</span>
                  </div>
                  <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* 8. PRICING SECTION */}
            <div className="bg-white p-4 rounded-[16px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <DollarSign size={20} />
                </div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Pricing</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Sell Price</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      placeholder="0"
                      className="w-full h-[44px] pl-8 pr-3 bg-white border border-[#e5e7eb] rounded-[14px] text-sm font-bold outline-none focus:border-[#6366f1]"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">৳</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Regular Price</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      placeholder="0"
                      className="w-full h-[44px] pl-8 pr-3 bg-white border border-[#e5e7eb] rounded-[14px] text-sm font-bold outline-none focus:border-[#6366f1]"
                      value={formData.oldPrice}
                      onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">৳</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Initial Sold Count</label>
                  <input 
                    type="number" 
                    placeholder="0"
                    className="w-full h-[44px] px-3 bg-white border border-[#e5e7eb] rounded-[14px] text-sm font-bold outline-none focus:border-[#6366f1]"
                    value={formData.soldCount}
                    onChange={(e) => setFormData({ ...formData, soldCount: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Buying Price</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      placeholder="0"
                      className="w-full h-[44px] pl-8 pr-3 bg-white border border-[#e5e7eb] rounded-[14px] text-sm font-bold outline-none focus:border-[#6366f1]"
                      value={formData.buyingPrice}
                      onChange={(e) => setFormData({ ...formData, buyingPrice: e.target.value })}
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">৳</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 9. INVENTORY SECTION */}
            <div className="bg-white p-4 rounded-[16px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                  <Box size={20} />
                </div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Inventory</h3>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Product Code (SKU)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. SKU-12345"
                    className="w-full h-[44px] px-3 bg-white border border-[#e5e7eb] rounded-[14px] text-sm font-medium outline-none focus:border-[#6366f1]"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Quantity</label>
                    <input 
                      type="number" 
                      placeholder="0"
                      className="w-full h-[44px] px-3 bg-white border border-[#e5e7eb] rounded-[14px] text-sm font-bold outline-none focus:border-[#6366f1]"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Unit Name</label>
                    <select
                      className="w-full h-[44px] px-3 bg-white border border-[#e5e7eb] rounded-[14px] text-sm font-bold outline-none focus:border-[#6366f1] appearance-none"
                      value={formData.unitName}
                      onChange={(e) => setFormData({ ...formData, unitName: e.target.value })}
                    >
                      <option value="pcs">pcs</option>
                      <option value="bottle">bottle</option>
                      <option value="box">box</option>
                      <option value="kg">kg</option>
                      <option value="ml">ml</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-rose-50/50 rounded-[14px] border border-rose-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={16} className="text-rose-500" />
                    <span className="text-[11px] font-bold text-rose-900 uppercase tracking-wider">Stock Alert</span>
                  </div>
                  <input 
                    type="number" 
                    className="w-16 h-8 px-2 bg-white border border-rose-200 rounded-lg text-xs font-bold outline-none focus:border-rose-500"
                    value={formData.stockAlert}
                    onChange={(e) => setFormData({ ...formData, stockAlert: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* 10. SPECIFICATIONS */}
            <div className="bg-white p-4 rounded-[16px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <List size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Specifications</h3>
                </div>
                <button 
                  type="button"
                  onClick={addSpec}
                  className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#6366f1] hover:bg-indigo-50 transition-all"
                >
                  <Plus size={18} />
                </button>
              </div>

              <div className="space-y-2">
                {formData.specifications.map((spec, idx) => (
                  <div key={idx} className="flex gap-2 animate-in slide-in-from-right-2 duration-300">
                    <input 
                      type="text" 
                      placeholder="Title"
                      className="flex-1 h-[40px] px-3 bg-white border border-[#e5e7eb] rounded-[12px] text-xs font-bold outline-none focus:border-[#6366f1]"
                      value={spec.title}
                      onChange={(e) => updateSpec(idx, 'title', e.target.value)}
                    />
                    <input 
                      type="text" 
                      placeholder="Value"
                      className="flex-[2] h-[40px] px-3 bg-white border border-[#e5e7eb] rounded-[12px] text-xs font-bold outline-none focus:border-[#6366f1]"
                      value={spec.description}
                      onChange={(e) => updateSpec(idx, 'description', e.target.value)}
                    />
                    <button 
                      type="button"
                      onClick={() => removeSpec(idx)}
                      className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-rose-500 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 11. DELIVERY CHARGES */}
            <div className="bg-white p-4 rounded-[16px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center text-sky-600">
                  <Truck size={20} />
                </div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Delivery Charges</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Inside Dhaka</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      className="w-full h-[44px] pl-8 pr-3 bg-white border border-[#e5e7eb] rounded-[14px] text-sm font-bold outline-none focus:border-[#6366f1]"
                      value={formData.deliveryCharges.dhaka}
                      onChange={(e) => setFormData({
                        ...formData,
                        deliveryCharges: { ...formData.deliveryCharges, dhaka: parseInt(e.target.value) || 0 }
                      })}
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">৳</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Outside Dhaka</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      className="w-full h-[44px] pl-8 pr-3 bg-white border border-[#e5e7eb] rounded-[14px] text-sm font-bold outline-none focus:border-[#6366f1]"
                      value={formData.deliveryCharges.others}
                      onChange={(e) => setFormData({
                        ...formData,
                        deliveryCharges: { ...formData.deliveryCharges, others: parseInt(e.target.value) || 0 }
                      })}
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">৳</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 12. SAVE BUTTON */}
            <div className="pt-6">
              <button 
                type="button"
                onClick={handleSubmit}
                className="w-full h-[56px] bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white rounded-[18px] text-base font-bold shadow-[0_8px_20px_rgba(99,102,241,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
              >
                <Save size={20} />
                <span>Save Product Details</span>
              </button>
            </div>
        </motion.div>
      ) : null}
    </AnimatePresence>

      {/* COLOR MANAGER PAGE */}
      <AnimatePresence>
        {activeTab === 'colors' && (
          <motion.div
            key="color-page"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="fixed inset-0 z-[60] bg-[#f8fafc] overflow-y-auto p-4 pb-24"
          >
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-white p-6 rounded-[16px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setActiveTab('main')}
                      className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-xl text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Color Manager</h3>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-[16px] border border-[#e5e7eb] space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Color Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Red"
                        className="w-full h-[44px] px-3 bg-white border border-[#e5e7eb] rounded-[14px] text-sm font-bold outline-none focus:border-[#6366f1]"
                        value={newColor.name}
                        onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">HEX Code</label>
                      <div className="flex gap-2">
                        <input 
                          type="color" 
                          className="w-11 h-[44px] rounded-[14px] cursor-pointer border-none p-0 bg-transparent"
                          value={newColor.hex}
                          onChange={(e) => setNewColor({ ...newColor, hex: e.target.value })}
                        />
                        <input 
                          type="text" 
                          className="flex-1 h-[44px] px-3 bg-white border border-[#e5e7eb] rounded-[14px] text-sm font-bold outline-none uppercase"
                          value={newColor.hex}
                          onChange={(e) => setNewColor({ ...newColor, hex: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white rounded-[14px] border border-[#e5e7eb]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-50 text-purple-600">
                        <DollarSign size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-gray-900 uppercase tracking-tight">Extra Price</span>
                        <span className="text-[10px] text-gray-400 font-medium">Added to base price</span>
                      </div>
                    </div>
                    <input 
                      type="number" 
                      className="w-24 h-[40px] px-3 bg-gray-50 border border-[#e5e7eb] rounded-[12px] text-sm font-bold outline-none focus:border-[#6366f1]"
                      value={newColor.extraPrice}
                      onChange={(e) => setNewColor({ ...newColor, extraPrice: parseFloat(e.target.value) || 0 })}
                    />
                  </div>

                  <button 
                    onClick={addColor}
                    className="w-full h-[48px] bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white rounded-[14px] text-sm font-bold shadow-lg shadow-indigo-100 hover:scale-[1.01] active:scale-[0.99] transition-all"
                  >
                    Add Color Variant
                  </button>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Added Colors</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {formData.colors.map((color, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-white border border-[#e5e7eb] rounded-[14px] group">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-8 h-8 rounded-full border border-gray-100 shadow-sm"
                            style={{ backgroundColor: color.hex }}
                          />
                          <div>
                            <p className="text-sm font-bold text-gray-900">{color.name}</p>
                            <p className="text-[10px] text-gray-400 font-medium uppercase">{color.hex}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {color.extraPrice > 0 && (
                            <span className="text-xs font-bold text-emerald-600">+৳{color.extraPrice}</span>
                          )}
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => {
                                const newColors = [...formData.colors];
                                newColors[idx].visible = !newColors[idx].visible;
                                setFormData({ ...formData, colors: newColors });
                              }}
                              className={cn(
                                "w-8 h-8 flex items-center justify-center rounded-lg transition-all",
                                color.visible ? "bg-emerald-50 text-emerald-600" : "bg-gray-50 text-gray-300"
                              )}
                            >
                              {color.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                            </button>
                            <button 
                              onClick={() => removeColor(idx)}
                              className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-rose-500 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>
);
};
