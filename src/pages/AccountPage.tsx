import React from 'react';
import { useAuth } from '@/src/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import { 
  Package, Heart, MapPin, User, Settings, LogOut, 
  ChevronRight, Bell, Star, Ticket, CreditCard, 
  CircleHelp, ShieldCheck
} from 'lucide-react';

export default function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const quickActions = [
    { label: 'Orders', icon: Package, path: '/account/orders' },
    { label: 'Wishlist', icon: Heart, path: '/wishlist' },
    { label: 'Reviews', icon: Star, path: '/account/reviews' },
    { label: 'Coupons', icon: Ticket, path: '/account/coupons' },
  ];

  const menuItems = [
    { label: 'My Orders', icon: Package, path: '/account/orders' },
    { label: 'My Addresses', icon: MapPin, path: '/account/addresses' },
    { label: 'Payment Methods', icon: CreditCard, path: '/account/payments' },
    { label: 'Notifications', icon: Bell, path: '/account/notifications' },
    { label: 'Wishlist', icon: Heart, path: '/wishlist' },
    { label: 'My Reviews', icon: Star, path: '/account/reviews' },
    { label: 'Help Center', icon: CircleHelp, path: '/contact' },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-32">
      {/* Topbar - Gradient Background */}
      <div className="bg-gradient-to-br from-[#f85606] to-[#ff7a00] px-5 pt-6 pb-12 flex items-center justify-between text-white">
        <h1 className="text-2xl font-bold tracking-tight">TAZU MART BD</h1>
        <div className="flex items-center gap-4">
          <button className="hover:opacity-80 transition-opacity"><Bell size={22} /></button>
          <button className="hover:opacity-80 transition-opacity"><Settings size={22} /></button>
        </div>
      </div>

      <div className="max-w-[480px] mx-auto space-y-4">
        {/* Profile Card - Overlapping */}
        <div className="bg-white mx-4 -mt-6 rounded-2xl p-5 shadow-[0_6px_20px_rgba(0,0,0,0.08)] border border-gray-50 flex flex-col sm:flex-row items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="w-[60px] h-[60px] rounded-full border-2 border-[#f85606] bg-orange-50 flex items-center justify-center text-[#f85606] overflow-hidden shrink-0">
              {user.image ? (
                <img src={user.image} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <User size={32} />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-[#222]">Hello, {user.name}</h2>
              <p className="text-sm text-[#777]">{user.address || 'Manage your account easily'}</p>
            </div>
          </div>
          <button className="bg-[#fff2eb] text-[#f85606] w-full sm:w-auto px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#ffe5d4] transition-all">
            Edit Profile
          </button>
        </div>

        {/* Quick Actions - Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-4">
          {quickActions.map((action) => (
            <Link 
              key={action.label} 
              to={action.path}
              className="bg-white p-4 rounded-2xl shadow-[0_4px_14px_rgba(0,0,0,0.06)] flex flex-col items-center gap-2 hover:-translate-y-1 transition-all duration-300"
            >
              <action.icon size={20} className="text-[#f85606]" />
              <span className="text-[13px] font-semibold text-[#333]">{action.label}</span>
            </Link>
          ))}
        </div>

        {/* Menu Section */}
        <div className="px-4 space-y-3">
          {menuItems.map((item) => (
            <Link 
              key={item.label}
              to={item.path}
              className="bg-white flex items-center justify-between p-4 rounded-2xl shadow-[0_4px_14px_rgba(0,0,0,0.05)] hover:scale-[1.01] transition-all group"
            >
              <div className="flex items-center gap-4">
                <item.icon size={18} className="text-[#f85606] w-[22px]" />
                <span className="text-[15px] font-semibold text-[#333]">{item.label}</span>
              </div>
              <ChevronRight size={18} className="text-[#aaa] group-hover:text-[#f85606] transition-all" />
            </Link>
          ))}
        </div>

        {/* Logout Section */}
        <div className="px-4 pt-2">
          <button 
            onClick={handleLogout}
            className="w-full bg-[#f85606] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#d94800] transition-all shadow-lg shadow-orange-100"
          >
            Logout
          </button>
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 text-gray-300 text-[10px] font-bold uppercase tracking-widest pt-4">
          <ShieldCheck size={14} />
          <span>Secure Account - Tazu Mart BD</span>
        </div>
      </div>
    </div>
  );
}
