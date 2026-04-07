import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  ChevronRight, 
  Layers,
  Image as ImageIcon,
  X,
  Save,
  Download,
  Filter,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  LayoutGrid,
  ListFilter,
  GripVertical,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Category, SubCategory } from '@/src/types';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableItemProps {
  key?: string | number;
  category: Category;
  onEdit: (cat: Category) => void;
  onDelete: (id: string) => Promise<void>;
  onToggleStatus: (cat: Category) => Promise<void>;
}

function SortableCategoryRow({ category, onEdit, onDelete, onToggleStatus }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className="bg-white rounded-[32px] shadow-sm border border-gray-50 overflow-hidden group hover:shadow-xl transition-all duration-300 flex items-center p-4 gap-4"
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-2 text-gray-300 hover:text-gray-600 transition-colors">
        <GripVertical size={20} />
      </div>
      
      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
        <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-black text-gray-900 tracking-tight uppercase truncate">{category.name}</h3>
          <span className={cn(
            "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border",
            category.status === 'ACTIVE' ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-gray-500/10 text-gray-600 border-gray-500/20"
          )}>
            {category.status}
          </span>
        </div>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 truncate">/{category.slug}</p>
        <p className="text-[9px] text-gray-400 font-medium mt-0.5">{category.subcategories?.length || 0} Subcategories</p>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={() => onToggleStatus(category)}
          className={cn(
            "p-2 rounded-xl transition-all",
            category.status === 'ACTIVE' ? "text-emerald-500 hover:bg-emerald-50" : "text-gray-400 hover:bg-gray-50"
          )}
          title={category.status === 'ACTIVE' ? "Hide Category" : "Show Category"}
        >
          {category.status === 'ACTIVE' ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
        <button 
          onClick={() => onEdit(category)}
          className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
          title="Edit Category"
        >
          <Edit2 size={18} />
        </button>
        <button 
          onClick={() => onDelete(category.id)}
          className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
          title="Delete Category"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

export default function AdminProductCategories() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    slug: '',
    image: '',
    banner: '',
    status: 'ACTIVE',
    subcategories: []
  });
  const [newSubName, setNewSubName] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        console.error("Invalid categories data received:", data);
        setCategories([]);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = categories.findIndex((c) => c.id === active.id.toString());
      const newIndex = categories.findIndex((c) => c.id === over.id.toString());
      
      const newCategories = arrayMove(categories, oldIndex, newIndex);
      setCategories(newCategories);

      // Update order in backend
      try {
        const orders = newCategories.map((cat: Category, index: number) => ({ id: cat.id, order: index }));
        await fetch('/api/admin/categories/reorder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orders })
        });
      } catch (error) {
        console.error("Failed to update reorder:", error);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          order: editingCategory ? editingCategory.order : categories.length
        })
      });
      if (res.ok) {
        setIsModalOpen(false);
        setEditingCategory(null);
        setFormData({ name: '', slug: '', image: '', banner: '', status: 'ACTIVE', subcategories: [] });
        fetchCategories();
      }
    } catch (error) {
      console.error("Failed to save category:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchCategories();
      }
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  const handleToggleStatus = async (cat: Category) => {
    const newStatus = cat.status === 'ACTIVE' ? 'HIDDEN' : 'ACTIVE';
    try {
      await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...cat, status: newStatus })
      });
      fetchCategories();
    } catch (error) {
      console.error("Failed to toggle status:", error);
    }
  };

  const openEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormData(cat);
    setIsModalOpen(true);
  };

  const addSubcategory = () => {
    if (!newSubName.trim()) return;
    const slug = newSubName.toLowerCase().replace(/\s+/g, '-');
    const newSub: SubCategory = {
      id: Math.random().toString(36).substring(2, 9),
      name: newSubName,
      slug
    };
    setFormData({
      ...formData,
      subcategories: [...(formData.subcategories || []), newSub]
    });
    setNewSubName('');
  };

  const removeSubcategory = (id: string) => {
    setFormData({
      ...formData,
      subcategories: formData.subcategories?.filter(s => s.id !== id)
    });
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase leading-none">Taxonomy</h1>
          <p className="text-sm text-gray-500 font-medium mt-2">Organize your products into logical classifications for better discovery.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white px-5 py-3 rounded-2xl border border-gray-100 text-xs font-black text-gray-600 uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm group">
            <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
            Export
          </button>
          <button 
            onClick={() => {
              setEditingCategory(null);
              setFormData({ name: '', slug: '', image: '', banner: '', status: 'ACTIVE', subcategories: [] });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-[#FF6A00] text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-orange-100 hover:bg-[#E65F00] transition-all"
          >
            <Plus size={18} />
            New Category
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-5 rounded-[32px] shadow-sm border border-gray-50 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4 flex-1 min-w-[300px]">
          <div className="relative flex-1 group">
            <input 
              type="text" 
              placeholder="Search categories by name or slug..." 
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-[20px] text-sm font-medium outline-none focus:bg-white focus:border-[#FF6A00] transition-all shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF6A00] transition-colors" size={20} />
          </div>
          <button className="flex items-center gap-2 bg-gray-50 px-6 py-4 rounded-[20px] border border-transparent text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-gray-100 transition-all">
            <Filter size={20} />
            Filters
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-50 p-1 rounded-[20px] shadow-inner">
            <button className="p-3 bg-white rounded-[16px] text-[#FF6A00] shadow-sm"><ListFilter size={18} /></button>
            <button className="p-3 text-gray-400 hover:text-gray-600 transition-colors"><LayoutGrid size={18} /></button>
          </div>
        </div>
      </div>

      {/* Categories List with Drag & Drop */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-12 h-12 border-4 border-orange-100 border-t-[#FF6A00] rounded-full animate-spin" />
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Loading Taxonomy...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={filteredCategories.map(c => c.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="grid grid-cols-1 gap-4">
                {filteredCategories.map((category) => (
                  <SortableCategoryRow 
                    key={category.id} 
                    category={category} 
                    onEdit={openEdit}
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {filteredCategories.length === 0 && (
            <div className="bg-white rounded-[40px] p-20 text-center border-2 border-dashed border-gray-100">
              <div className="w-20 h-20 bg-gray-50 rounded-[28px] flex items-center justify-center text-gray-300 mx-auto mb-6">
                <Layers size={40} />
              </div>
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">No Classifications Found</h3>
              <p className="text-sm text-gray-400 font-medium mt-2">Try adjusting your search or create a new category.</p>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-[48px] p-8 md:p-12 shadow-2xl animate-in fade-in zoom-in duration-500 border border-white/20 my-8">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-orange-50 rounded-[24px] flex items-center justify-center text-[#FF6A00] shadow-inner">
                  <Layers size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase leading-none">
                    {editingCategory ? 'Edit Category' : 'New Category'}
                  </h2>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-2">Define store taxonomy</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 rounded-2xl transition-all text-gray-400 group">
                <X size={28} className="group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Category Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Traditional Wear"
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-[20px] text-sm font-black uppercase tracking-tight outline-none focus:bg-white focus:border-[#FF6A00] transition-all shadow-inner"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Slug (URL)</label>
                  <input 
                    type="text" 
                    required
                    placeholder="traditional-wear"
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-[20px] text-sm font-black outline-none focus:bg-white focus:border-[#FF6A00] transition-all shadow-inner"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Thumbnail URL</label>
                  <input 
                    type="text" 
                    required
                    placeholder="https://..."
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-[20px] text-sm font-medium outline-none focus:bg-white focus:border-[#FF6A00] transition-all shadow-inner"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Banner URL (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="https://..."
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-[20px] text-sm font-medium outline-none focus:bg-white focus:border-[#FF6A00] transition-all shadow-inner"
                    value={formData.banner}
                    onChange={(e) => setFormData({ ...formData, banner: e.target.value })}
                  />
                </div>
              </div>

              {/* Subcategories Management */}
              <div className="space-y-4 bg-gray-50 p-6 rounded-[32px] border border-gray-100">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Subcategories</label>
                
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    placeholder="Add subcategory..."
                    className="flex-1 px-6 py-3 bg-white border border-transparent rounded-[16px] text-sm font-bold outline-none focus:border-[#FF6A00] transition-all shadow-sm"
                    value={newSubName}
                    onChange={(e) => setNewSubName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubcategory())}
                  />
                  <button 
                    type="button"
                    onClick={addSubcategory}
                    className="bg-[#FF6A00] text-white p-3 rounded-[16px] hover:bg-[#E65F00] transition-all shadow-md"
                  >
                    <Plus size={20} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                  {formData.subcategories?.map((sub) => (
                    <div key={sub.id} className="bg-white px-4 py-2 rounded-xl border border-gray-100 flex items-center gap-2 shadow-sm group">
                      <span className="text-xs font-bold text-gray-700">{sub.name}</span>
                      <button 
                        type="button"
                        onClick={() => removeSubcategory(sub.id)}
                        className="text-gray-300 hover:text-rose-500 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {(!formData.subcategories || formData.subcategories.length === 0) && (
                    <p className="text-[10px] text-gray-400 font-medium italic p-2">No subcategories added yet.</p>
                  )}
                </div>
              </div>

              <div className="flex gap-6 pt-6">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-8 py-5 rounded-[24px] text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100"
                >
                  Discard
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-[#FF6A00] text-white px-8 py-5 rounded-[24px] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-orange-100 hover:bg-[#E65F00] transition-all flex items-center justify-center gap-3"
                >
                  <Save size={20} />
                  {editingCategory ? 'Update Taxonomy' : 'Save Taxonomy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
