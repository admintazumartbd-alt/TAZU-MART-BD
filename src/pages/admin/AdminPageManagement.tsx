import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Plus, Search, Filter, MoreVertical, Edit2, Trash2, Save, X, Eye, FileText, Globe, Image as ImageIcon, Settings } from 'lucide-react';
import axios from '../../lib/api';
import { Page } from '../../types';
import { cn } from '@/src/lib/utils';

export default function AdminPageManagement() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState<Partial<Page>>({
    title: '',
    slug: '',
    content: '',
    status: 'DRAFT',
    seoTitle: '',
    metaDescription: '',
    bannerImage: ''
  });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/admin/pages');
      setPages(response.data);
    } catch (err) {
      console.error("Failed to fetch pages:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.post('/api/admin/pages', currentPage);
      if (response.data.success || response.status === 200) {
        setIsEditing(false);
        fetchPages();
        setCurrentPage({ title: '', slug: '', content: '', status: 'DRAFT' });
      }
    } catch (err) {
      console.error("Failed to save page:", err);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Page Management</h1>
          <p className="text-sm text-gray-500">Create and manage dynamic content pages like About Us, Terms, etc.</p>
        </div>
        <button 
          onClick={() => {
            setCurrentPage({ title: '', slug: '', content: '', status: 'DRAFT' });
            setIsEditing(true);
          }}
          className="flex items-center gap-2 bg-[#f85606] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#d94800] transition-all shadow-lg shadow-orange-100"
        >
          <Plus size={20} />
          Create New Page
        </button>
      </div>

      {isEditing ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-6 shadow-xl border border-orange-100 mb-8"
        >
          <div className="flex justify-between items-center mb-8 border-b pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#f85606] flex items-center justify-center">
                <FileText size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{currentPage.id ? 'Edit Page' : 'Create New Page'}</h2>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-all"
              >
                Discard
              </button>
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 bg-[#f85606] text-white px-8 py-2.5 rounded-xl font-bold hover:bg-[#d94800] transition-all shadow-lg shadow-orange-100"
              >
                <Save size={20} />
                Publish Page
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Page Title</label>
                <input 
                  type="text" 
                  value={currentPage.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                    setCurrentPage({ ...currentPage, title, slug });
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#f85606] focus:ring-2 focus:ring-orange-100 outline-none transition-all text-lg font-bold"
                  placeholder="e.g. About Tazu Mart BD"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Content (HTML Supported)</label>
                <textarea 
                  value={currentPage.content}
                  onChange={(e) => setCurrentPage({ ...currentPage, content: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#f85606] focus:ring-2 focus:ring-orange-100 outline-none transition-all min-h-[400px] font-mono text-sm"
                  placeholder="Enter page content here..."
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-2xl p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Globe size={16} className="text-[#f85606]" />
                    URL Slug
                  </label>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                    tazumartbd.com/ <span className="text-[#f85606] font-bold">{currentPage.slug}</span>
                  </div>
                  <input 
                    type="text" 
                    value={currentPage.slug}
                    onChange={(e) => setCurrentPage({ ...currentPage, slug: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#f85606] outline-none transition-all text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <ImageIcon size={16} className="text-[#f85606]" />
                    Banner Image URL
                  </label>
                  <input 
                    type="text" 
                    value={currentPage.bannerImage}
                    onChange={(e) => setCurrentPage({ ...currentPage, bannerImage: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#f85606] outline-none transition-all text-sm"
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Settings size={16} className="text-[#f85606]" />
                    Status
                  </label>
                  <select 
                    value={currentPage.status}
                    onChange={(e) => setCurrentPage({ ...currentPage, status: e.target.value as any })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#f85606] outline-none transition-all text-sm"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                  </select>
                </div>
              </div>

              <div className="bg-blue-50 rounded-2xl p-6 space-y-4 border border-blue-100">
                <h3 className="text-sm font-bold text-blue-900">SEO Settings</h3>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">SEO Title</label>
                  <input 
                    type="text" 
                    value={currentPage.seoTitle}
                    onChange={(e) => setCurrentPage({ ...currentPage, seoTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:border-blue-500 outline-none transition-all text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">Meta Description</label>
                  <textarea 
                    value={currentPage.metaDescription}
                    onChange={(e) => setCurrentPage({ ...currentPage, metaDescription: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-blue-200 focus:border-blue-500 outline-none transition-all text-xs min-h-[80px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full p-20 text-center text-gray-400 animate-pulse">Loading pages...</div>
          ) : pages.length > 0 ? (
            pages.map((page) => (
              <motion.div 
                key={page.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={cn(
                    "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                    page.status === 'PUBLISHED' ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-400"
                  )}>
                    {page.status}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => {
                        setCurrentPage(page);
                        setIsEditing(true);
                      }}
                      className="p-2 text-gray-400 hover:text-[#f85606] hover:bg-orange-50 rounded-lg transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{page.title}</h3>
                <p className="text-xs text-[#f85606] font-medium mb-4">/{page.slug}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <span className="text-[10px] text-gray-400">Created: {new Date(page.createdAt).toLocaleDateString()}</span>
                  <Link 
                    to={`/${page.slug}`} 
                    target="_blank"
                    className="text-xs font-bold text-gray-600 hover:text-[#f85606] flex items-center gap-1"
                  >
                    <Eye size={14} /> View
                  </Link>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full bg-white rounded-2xl p-20 text-center border border-dashed border-gray-200">
              <p className="text-gray-400">No pages created yet. Start by creating a new page.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
