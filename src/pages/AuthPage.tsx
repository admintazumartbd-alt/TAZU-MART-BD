import React, { useState, useEffect } from 'react';
import { useAuth } from '@/src/context/AuthContext';
import { useCart } from '@/src/context/CartContext';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, Lock, Phone, User, Eye, EyeOff, 
  Facebook, Chrome, ShieldCheck, X, ChevronRight
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '', phone: '', address: '' });
  const { login, register, loginWithGoogle, loginWithFacebook, sendMagicLink, resetPassword, user } = useAuth();
  const { cart, mergeCart } = useCart();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isMagicLinkLoading, setIsMagicLinkLoading] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError("Please enter your email first.");
      return;
    }
    setError(null);
    setSuccessMessage(null);
    setIsResetLoading(true);
    try {
      await resetPassword(formData.email);
      setSuccessMessage("Password reset link sent! Please check your email.");
    } catch (err: any) {
      setError(err.message || "Failed to send reset link.");
    } finally {
      setIsResetLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!formData.email) {
      setError("Please enter your email first.");
      return;
    }
    setError(null);
    setSuccessMessage(null);
    setIsMagicLinkLoading(true);
    try {
      await sendMagicLink(formData.email);
      setSuccessMessage("Magic link sent! Please check your email.");
    } catch (err: any) {
      setError(err.message || "Failed to send magic link.");
    } finally {
      setIsMagicLinkLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const guestCart = [...cart];
      if (activeTab === 'login') {
        await login(formData.email, formData.password);
      } else {
        await register(formData);
      }
      if (guestCart.length > 0) mergeCart(guestCart);
    } catch (err: any) {
      console.error("Auth error:", err);
      if (err.message?.includes('rate limit')) {
        setError("Too many attempts. Please wait a few minutes before trying again.");
      } else {
        setError(err.message || "Authentication failed. Please check your credentials.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const guestCart = [...cart];
      await loginWithGoogle();
      if (guestCart.length > 0) mergeCart(guestCart);
    } catch (error) {
      console.error("Google login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setIsLoading(true);
    try {
      const guestCart = [...cart];
      await loginWithFacebook();
      if (guestCart.length > 0) mergeCart(guestCart);
    } catch (error) {
      console.error("Facebook login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect after login
  useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/account');
      }
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12 relative font-sans">
      {/* Main Auth Card */}
      <div className="w-full max-w-[430px] bg-white rounded-[22px] shadow-[0_12px_30px_rgba(0,0,0,0.08)] overflow-hidden p-[28px_22px]">
        <div className="text-center mb-[22px]">
          <h1 className="text-[30px] font-bold text-[#f85606] mb-2">TAZU MART BD</h1>
          <p className="text-[#666] text-sm">Welcome back! Login or create your account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="p-1 bg-rose-500 rounded-full text-white mt-0.5 shrink-0">
              <Lock size={12} />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold text-rose-600 leading-relaxed">{error}</p>
              {((['admin.tazumart060@gmail.com', 'admin.tazumartbd@gmail.com', 'admin.tazumart@gmail.com'].includes(formData.email.trim().toLowerCase())) && (error.includes('incorrect') || error.includes('credentials'))) && (
                <button 
                  type="button"
                  onClick={handleMagicLink}
                  disabled={isMagicLinkLoading}
                  className="text-[10px] font-black text-rose-700 uppercase tracking-widest hover:underline flex items-center gap-1"
                >
                  {isMagicLinkLoading ? 'Sending...' : 'Send Magic Link Instead'}
                </button>
              )}
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="p-1 bg-emerald-500 rounded-full text-white mt-0.5 shrink-0">
              <ShieldCheck size={12} />
            </div>
            <p className="text-xs font-bold text-emerald-600 leading-relaxed">{successMessage}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex bg-[#fff2eb] rounded-[12px] p-1 mb-6">
          <button 
            onClick={() => setActiveTab('login')}
            className={cn(
              "flex-1 py-3 font-bold text-sm transition-all rounded-[10px]",
              activeTab === 'login' ? "bg-[#f85606] text-white" : "text-[#666] hover:text-gray-800"
            )}
          >
            Login
          </button>
          <button 
            onClick={() => setActiveTab('register')}
            className={cn(
              "flex-1 py-3 font-bold text-sm transition-all rounded-[10px]",
              activeTab === 'register' ? "bg-[#f85606] text-white" : "text-[#666] hover:text-gray-800"
            )}
          >
            Register
          </button>
        </div>

        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {activeTab === 'register' && (
                  <>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-[#333]">Full Name</label>
                      <input 
                        required
                        type="text" 
                        placeholder="Full Name"
                        className="w-full px-[15px] py-[14px] border border-[#ddd] rounded-[12px] focus:border-[#f85606] focus:ring-4 focus:ring-[#f85606]/10 focus:outline-none transition-all text-[15px]"
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-[#333]">Phone Number</label>
                      <input 
                        required
                        type="tel" 
                        placeholder="01XXXXXXXXX"
                        className="w-full px-[15px] py-[14px] border border-[#ddd] rounded-[12px] focus:border-[#f85606] focus:ring-4 focus:ring-[#f85606]/10 focus:outline-none transition-all text-[15px]"
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-[#333]">Address</label>
                      <input 
                        required
                        type="text" 
                        placeholder="Enter your address"
                        className="w-full px-[15px] py-[14px] border border-[#ddd] rounded-[12px] focus:border-[#f85606] focus:ring-4 focus:ring-[#f85606]/10 focus:outline-none transition-all text-[15px]"
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#333]">Email</label>
                  <input 
                    required
                    type="email" 
                    placeholder="Enter your email"
                    className="w-full px-[15px] py-[14px] border border-[#ddd] rounded-[12px] focus:border-[#f85606] focus:ring-4 focus:ring-[#f85606]/10 focus:outline-none transition-all text-[15px]"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                {activeTab === 'register' ? null : null}

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-semibold text-[#333]">Password</label>
                      {activeTab === 'login' && (
                        <button 
                          type="button" 
                          onClick={handleForgotPassword}
                          disabled={isResetLoading}
                          className="text-xs text-[#f85606] font-bold hover:underline disabled:opacity-50"
                        >
                          {isResetLoading ? 'Sending...' : 'Forgot?'}
                        </button>
                      )}
                    </div>
                  <div className="relative">
                    <input 
                      required
                      type={showPassword ? 'text' : 'password'} 
                      placeholder={activeTab === 'login' ? "Enter your password" : "Create password"}
                      className="w-full px-[15px] py-[14px] border border-[#ddd] rounded-[12px] focus:border-[#f85606] focus:ring-4 focus:ring-[#f85606]/10 focus:outline-none transition-all text-[15px] pr-12"
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#f85606] text-white py-[14px] rounded-[12px] font-bold text-[15px] hover:bg-[#de4c00] transition-all disabled:opacity-50 mt-2"
            >
              {isLoading ? 'Processing...' : activeTab === 'login' ? 'Login' : 'Create Account'}
            </button>
          </form>

          <div className="divider">
            <span className="text-[#999] text-[13px]">OR</span>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-1 gap-3">
            <button 
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="flex items-center justify-center gap-3 w-full py-[14px] border border-[#ddd] rounded-[12px] hover:bg-gray-50 transition-all font-bold text-[#333] text-[15px] disabled:opacity-50"
            >
              <Chrome size={20} className="text-[#db4437]" />
              Continue with Google
            </button>
            <button 
              onClick={handleFacebookLogin}
              disabled={isLoading}
              className="flex items-center justify-center gap-3 w-full py-[14px] border border-[#ddd] rounded-[12px] hover:bg-gray-50 transition-all font-bold text-[#333] text-[15px] disabled:opacity-50"
            >
              <Facebook size={20} className="text-[#1877F2]" />
              Continue with Facebook
            </button>
          </div>

          <p className="text-center text-[13px] text-[#999] leading-relaxed">
            By continuing, you agree to our <button className="text-gray-600 font-bold hover:underline">Terms</button> and <button className="text-gray-600 font-bold hover:underline">Privacy Policy</button>.
          </p>

          <div className="pt-4 border-t border-gray-50 text-center">
            <button 
              onClick={() => navigate('/admin-login')}
              className="text-[11px] font-black text-gray-300 uppercase tracking-[0.2em] hover:text-[#f85606] transition-colors"
            >
              Admin Portal Access
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
