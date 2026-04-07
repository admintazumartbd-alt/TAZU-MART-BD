import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Eye, EyeOff, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Check if it's the admin email first for better UX, 
      // though the backend/context will handle the role assignment.
      if (email.toLowerCase() !== 'admin.tazumartbd@gmail.com') {
        setError('Access Denied: Only authorized administrators can log in here.');
        setIsLoading(false);
        return;
      }

      await login(email, password);
      // The navigate to /admin will happen in the useEffect or after login success
      // But we can also check here if the login was successful.
      navigate('/admin');
    } catch (err: any) {
      console.error('Admin login error:', err);
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // If already logged in as admin, redirect
  React.useEffect(() => {
    if (user && user.role === 'ADMIN') {
      navigate('/admin');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Back Link */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-[#f85606] transition-colors group">
            <div className="p-2 rounded-lg group-hover:bg-orange-50 transition-colors">
              <ArrowLeft size={20} />
            </div>
            <span className="text-sm font-bold">Back to Store</span>
          </Link>
          <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">
            <ShieldCheck size={16} className="text-[#f85606]" />
            <span className="text-[10px] font-black text-[#f85606] uppercase tracking-widest">Secure Admin Portal</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-2xl shadow-orange-100/50 border border-gray-50 relative overflow-hidden">
          {/* Decorative Background Element */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-50 rounded-full blur-3xl opacity-50" />
          
          <div className="relative">
            <div className="mb-10 text-center">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">ADMIN LOGIN</h1>
              <p className="text-gray-500 font-medium text-sm">Enter your administrative credentials to access the panel.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="p-1 bg-rose-500 rounded-full text-white mt-0.5">
                  <Lock size={12} />
                </div>
                <p className="text-xs font-bold text-rose-600 leading-relaxed">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Admin Email</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#f85606] transition-colors">
                    <Mail size={20} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@tazumartbd.com"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium outline-none focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Secure Password</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#f85606] transition-colors">
                    <Lock size={20} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium outline-none focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#f85606] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-orange-200 hover:bg-[#d94800] hover:shadow-orange-300 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  'Access Dashboard'
                )}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-gray-50 text-center">
              <p className="text-xs text-gray-400 font-medium">
                Authorized Personnel Only. All access attempts are logged.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">
            © 2026 TAZU MART BD • ADMIN PORTAL V2.0
          </p>
        </div>
      </div>
    </div>
  );
}
