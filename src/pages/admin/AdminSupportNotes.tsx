import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, Search, User, Clock, MoreVertical, Edit2, Trash2, Save, X, RefreshCw } from 'lucide-react';
import { cn } from '../../lib/utils';
import axios from '../../lib/api';

export default function AdminSupportNotes() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/admin/support-notes');
        setNotes(response.data);
      } catch (error) {
        console.error('Failed to fetch support notes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 text-[#FF6A00] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight uppercase">Support Notes</h1>
          <p className="text-xs text-gray-500 font-bold mt-1 uppercase tracking-wider">Internal administrative notes about customers</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#f85606] text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-orange-100 hover:bg-[#d94800] transition-all"
        >
          <Plus size={18} />
          Add Note
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <input 
            type="text" 
            placeholder="Search notes or customers..." 
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-50 transition-all"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {notes.map((note) => (
          <div key={note.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50 space-y-4 group hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-[#f85606] border border-orange-100">
                  <User size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900 tracking-tight">{note.customer}</h3>
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    <Clock size={12} />
                    {note.date}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 text-gray-400 hover:text-[#f85606] hover:bg-orange-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                  <Edit2 size={14} />
                </button>
                <button className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl border border-transparent group-hover:border-orange-100 transition-all">
              <p className="text-xs font-bold text-gray-600 leading-relaxed italic">"{note.note}"</p>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Added by: {note.admin}</span>
              <button className="text-[10px] font-black text-[#f85606] uppercase tracking-widest hover:underline">View Profile</button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Note Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 rounded-xl text-[#f85606]">
                  <Plus size={20} />
                </div>
                <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase">Add Support Note</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Customer</label>
                <select className="w-full px-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-50 transition-all appearance-none">
                  <option value="">Choose a customer...</option>
                  <option value="rahat">Rahat Khan</option>
                  <option value="sumi">Sumi Akter</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Note Content</label>
                <textarea 
                  rows={4}
                  placeholder="Enter internal note about this customer..."
                  className="w-full px-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold outline-none focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-50 transition-all resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-[#f85606] text-white px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-orange-100 hover:bg-[#d94800] transition-all flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
