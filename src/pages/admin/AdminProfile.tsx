import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Camera, 
  Save, 
  Lock, 
  Eye, 
  EyeOff,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
  Calendar,
  BadgeCheck,
  Key,
  X,
  Edit3,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/src/lib/utils';

export default function AdminProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '01712345678',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    // Placeholder for actual update logic
    console.log('Updating profile:', formData);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-32 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/admin')}
            className="w-14 h-14 flex items-center justify-center bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-[#FF6A00] hover:bg-orange-50 transition-all shadow-sm hover:shadow-md group"
          >
            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">
              Admin <span className="text-[#FF6A00]">Profile</span>
            </h1>
            <p className="text-sm text-gray-500 font-medium uppercase tracking-widest">Master account control & security</p>
          </div>
        </div>
        
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-[#FF6A00] text-white px-10 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-orange-100 hover:bg-[#E65F00] hover:scale-105 transition-all flex items-center gap-3"
          >
            <Edit3 size={18} />
            Edit Profile
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsEditing(false)}
              className="bg-white text-gray-600 px-8 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest shadow-sm border border-gray-100 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              className="bg-[#FF6A00] text-white px-10 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-orange-100 hover:bg-[#E65F00] hover:scale-105 transition-all flex items-center gap-3"
            >
              <Save size={18} />
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Profile Card & Quick Info */}
        <div className="lg:col-span-1 space-y-10">
          <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-50 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-[#FF6A00] via-[#FF8C00] to-[#f85606] opacity-90 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative pt-6">
              <div className="relative inline-block group/avatar">
                <div className="w-32 h-32 rounded-[32px] bg-white p-1.5 shadow-2xl relative z-10 overflow-hidden">
                  {user?.image ? (
                    <img src={user.image} alt={user.name} className="w-full h-full object-cover rounded-[28px]" />
                  ) : (
                    <div className="w-full h-full bg-orange-50 rounded-[28px] flex items-center justify-center text-[#FF6A00]">
                      <User size={48} />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <label className="absolute -bottom-2 -right-2 p-3 bg-[#FF6A00] text-white rounded-2xl shadow-xl cursor-pointer hover:bg-[#E65F00] hover:scale-110 transition-all z-20 border-4 border-white">
                    <Camera size={18} />
                    <input type="file" className="hidden" accept="image/*" />
                  </label>
                )}
              </div>
              
              <div className="mt-6 space-y-1">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">{user?.name || 'Admin User'}</h2>
                <div className="flex items-center justify-center gap-2">
                  <BadgeCheck size={16} className="text-[#FF6A00]" />
                  <p className="text-[10px] font-black text-[#FF6A00] uppercase tracking-widest">Super Administrator</p>
                </div>
              </div>
              
              <div className="mt-10 pt-10 border-t border-gray-50 space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Account Status</p>
                  <span className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm flex items-center gap-1.5">
                    <ShieldCheck size={14} />
                    Verified
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Member Since</p>
                  <div className="flex items-center gap-2 text-gray-900">
                    <Calendar size={14} className="text-gray-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest">April 2026</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Last Login</p>
                  <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">2 Hours Ago</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 p-8 rounded-[40px] border border-orange-100 space-y-4 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-[0.05] group-hover:scale-110 transition-transform duration-700">
              <Shield size={120} />
            </div>
            <div className="flex items-center gap-3 text-[#FF6A00]">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <Shield size={20} />
              </div>
              <h4 className="text-[10px] font-black uppercase tracking-widest">Security Protocol</h4>
            </div>
            <p className="text-[11px] font-bold text-orange-700 leading-relaxed uppercase tracking-wider">
              Your account is protected with enterprise-grade encryption. Enable 2FA for maximum security.
            </p>
            <button className="text-[10px] font-black text-[#FF6A00] uppercase tracking-widest hover:underline flex items-center gap-2">
              Learn More <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Right Column: Form Sections */}
        <div className="lg:col-span-2 space-y-10">
          {/* Account Information Bento */}
          <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-50 space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
              <User size={120} />
            </div>

            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-600 shadow-sm">
                <User size={24} />
              </div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Identity Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Full Legal Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    disabled={!isEditing}
                    className="w-full pl-14 pr-8 py-5 bg-gray-50 border border-transparent rounded-[24px] text-sm font-bold outline-none focus:bg-white focus:border-[#FF6A00] transition-all shadow-inner disabled:opacity-60"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Primary Email</label>
                <div className="relative">
                  <input 
                    type="email" 
                    disabled
                    className="w-full pl-14 pr-8 py-5 bg-gray-50 border border-transparent rounded-[24px] text-sm font-bold outline-none opacity-60 shadow-inner"
                    value={formData.email}
                  />
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Contact Number</label>
                <div className="relative">
                  <input 
                    type="tel" 
                    disabled={!isEditing}
                    className="w-full pl-14 pr-8 py-5 bg-gray-50 border border-transparent rounded-[24px] text-sm font-bold outline-none focus:bg-white focus:border-[#FF6A00] transition-all shadow-inner disabled:opacity-60"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Admin Role</label>
                <div className="relative">
                  <input 
                    type="text" 
                    disabled
                    className="w-full pl-14 pr-8 py-5 bg-gray-50 border border-transparent rounded-[24px] text-sm font-bold outline-none opacity-60 shadow-inner"
                    value="Super Administrator"
                  />
                  <Shield className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>
            </div>
          </div>

          {/* Security Bento */}
          <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-50 space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
              <Key size={120} />
            </div>

            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 shadow-sm">
                <Lock size={24} />
              </div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Security & Credentials</h3>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Current Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    disabled={!isEditing}
                    placeholder="••••••••"
                    className="w-full pl-14 pr-16 py-5 bg-gray-50 border border-transparent rounded-[24px] text-sm font-bold outline-none focus:bg-white focus:border-[#FF6A00] transition-all shadow-inner disabled:opacity-60"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  />
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FF6A00] transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">New Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      disabled={!isEditing}
                      placeholder="••••••••"
                      className="w-full px-8 py-5 bg-gray-50 border border-transparent rounded-[24px] text-sm font-bold outline-none focus:bg-white focus:border-[#FF6A00] transition-all shadow-inner disabled:opacity-60"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Confirm New Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      disabled={!isEditing}
                      placeholder="••••••••"
                      className="w-full px-8 py-5 bg-gray-50 border border-transparent rounded-[24px] text-sm font-bold outline-none focus:bg-white focus:border-[#FF6A00] transition-all shadow-inner disabled:opacity-60"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              
              {isEditing && (
                <div className="bg-gray-50 p-6 rounded-[24px] border border-gray-100 flex items-start gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-rose-500 shadow-sm shrink-0">
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Password Requirements</p>
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1 leading-relaxed">
                      Must be at least 8 characters long and include a mix of uppercase, lowercase, numbers, and symbols.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
