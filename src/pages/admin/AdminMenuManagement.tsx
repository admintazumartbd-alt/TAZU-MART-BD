import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Search, Filter, MoreVertical, Edit2, Trash2, GripVertical, Save, X, Zap, TrendingUp, Percent, Info, Phone, HelpCircle } from 'lucide-react';
import axios from '../../lib/api';
import { NavMenu } from '../../types';
import { cn } from '@/src/lib/utils';

const IconOptions = [
  { name: 'Zap', icon: Zap },
  { name: 'TrendingUp', icon: TrendingUp },
  { name: 'Percent', icon: Percent },
  { name: 'Info', icon: Info },
  { name: 'Phone', icon: Phone },
  { name: 'HelpCircle', icon: HelpCircle },
];

export default function AdminMenuManagement() {
  const [menus, setMenus] = useState<NavMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMenu, setCurrentMenu] = useState<Partial<NavMenu>>({
    name: '',
    slug: '',
    status: 'ACTIVE',
    order: 0,
    icon: 'Zap'
  });

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/menus');
      setMenus(response.data);
    } catch (err) {
      console.error("Failed to fetch menus:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.post('/api/admin/menus', currentMenu);
      if (response.data.success || response.status === 200) {
        setIsEditing(false);
        fetchMenus();
        setCurrentMenu({ name: '', slug: '', status: 'ACTIVE', order: 0, icon: 'Zap' });
      }
    } catch (err) {
      console.error("Failed to save menu:", err);
    }
  };

  const toggleStatus = async (menu: NavMenu) => {
    const updatedMenu = { ...menu, status: menu.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' };
    try {
      await axios.post('/api/admin/menus', updatedMenu);
      fetchMenus();
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Builder</h1>
          <p className="text-sm text-gray-500">Manage your website's navigation dynamic menus</p>
        </div>
        <button 
          onClick={() => {
            setCurrentMenu({ name: '', slug: '', status: 'ACTIVE', order: menus.length, icon: 'Zap' });
            setIsEditing(true);
          }}
          className="flex items-center gap-2 bg-[#f85606] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#d94800] transition-all shadow-lg shadow-orange-100"
        >
          <Plus size={20} />
          Add New Menu
        </button>
      </div>

      {isEditing && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-xl border border-orange-100 mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">{currentMenu.id ? 'Edit Menu' : 'Create New Menu'}</h2>
            <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Menu Name</label>
              <input 
                type="text" 
                value={currentMenu.name}
                onChange={(e) => {
                  const name = e.target.value;
                  const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                  setCurrentMenu({ ...currentMenu, name, slug });
                }}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#f85606] focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                placeholder="e.g. New Arrivals"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Slug (Auto-generated)</label>
              <input 
                type="text" 
                value={currentMenu.slug}
                readOnly
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Icon</label>
              <div className="grid grid-cols-6 gap-2">
                {IconOptions.map(opt => (
                  <button
                    key={opt.name}
                    onClick={() => setCurrentMenu({ ...currentMenu, icon: opt.name })}
                    className={cn(
                      "p-3 rounded-xl border transition-all flex items-center justify-center",
                      currentMenu.icon === opt.name 
                        ? "bg-orange-50 border-[#f85606] text-[#f85606]" 
                        : "border-gray-100 hover:border-gray-300 text-gray-500"
                    )}
                  >
                    <opt.icon size={20} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Status</label>
              <select 
                value={currentMenu.status}
                onChange={(e) => setCurrentMenu({ ...currentMenu, status: e.target.value as any })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#f85606] focus:ring-2 focus:ring-orange-100 outline-none transition-all"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button 
              onClick={() => setIsEditing(false)}
              className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 bg-[#f85606] text-white px-8 py-2.5 rounded-xl font-bold hover:bg-[#d94800] transition-all shadow-lg shadow-orange-100"
            >
              <Save size={20} />
              Save Menu
            </button>
          </div>
        </motion.div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Navigation Items</span>
          <span className="text-xs text-gray-500">{menus.length} items total</span>
        </div>
        
        <div className="divide-y divide-gray-50">
          {loading ? (
            <div className="p-12 text-center text-gray-400 animate-pulse">Loading menus...</div>
          ) : menus.length > 0 ? (
            menus.map((menu, idx) => {
              const Icon = IconMap[menu.icon || 'Zap'] || Zap;
              return (
                <div key={menu.id} className="p-4 flex items-center gap-4 hover:bg-gray-50/50 transition-all group">
                  <div className="cursor-grab text-gray-300 hover:text-gray-500">
                    <GripVertical size={20} />
                  </div>
                  
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#f85606] flex items-center justify-center">
                    <Icon size={20} />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{menu.name}</h3>
                    <p className="text-xs text-gray-500">/{menu.slug}</p>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <button 
                      onClick={() => toggleStatus(menu)}
                      className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all",
                        menu.status === 'ACTIVE' 
                          ? "bg-green-50 text-green-600 border border-green-100" 
                          : "bg-gray-50 text-gray-400 border border-gray-100"
                      )}
                    >
                      {menu.status}
                    </button>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          setCurrentMenu(menu);
                          setIsEditing(true);
                        }}
                        className="p-2 text-gray-400 hover:text-[#f85606] hover:bg-orange-50 rounded-lg transition-all"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center">
              <p className="text-gray-500">No menus found. Create your first menu item.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const IconMap: Record<string, any> = {
  Zap,
  TrendingUp,
  Percent,
  Info,
  Phone,
  HelpCircle,
};
