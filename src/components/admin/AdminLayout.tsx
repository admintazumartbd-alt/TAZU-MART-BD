import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  Tag, 
  BarChart3, 
  Truck, 
  Settings, 
  Menu, 
  X, 
  ChevronDown, 
  ChevronRight,
  Bell,
  Search,
  LogOut,
  User as UserIcon,
  ChevronLeft,
  MousePointerClick,
  ShoppingBag,
  MessageSquare,
  FileText,
  Layers,
  Box,
  History,
  Globe,
  CreditCard,
  ShieldCheck,
  UserCircle,
  Megaphone,
  Wallet,
  Store,
  Star,
  FileBarChart,
  UserPlus,
  Sparkles,
  Globe2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

interface SidebarItemData {
  icon?: React.ElementType;
  label: string;
  path?: string;
  subItems?: SidebarItemData[];
}

interface SidebarItemProps extends SidebarItemData {
  isCollapsed: boolean;
  active: boolean;
  onClick?: () => void;
  depth?: number;
  key?: string | number;
}

const isPathActive = (path: string | undefined, subItems: SidebarItemData[] | undefined, currentPath: string): boolean => {
  if (path && currentPath === path) return true;
  if (subItems) {
    return subItems.some(item => isPathActive(item.path, item.subItems, currentPath));
  }
  return false;
};

const SidebarItem = ({ icon: Icon, label, path, subItems, isCollapsed, active, onClick, depth = 0 }: SidebarItemProps) => {
  const location = useLocation();
  const hasSubItems = subItems && subItems.length > 0;
  const isSubItemActive = hasSubItems ? isPathActive(undefined, subItems, location.pathname) : false;
  
  const [isOpen, setIsOpen] = useState(active || isSubItemActive);

  // Sync isOpen with active state when depth is 0 (top level)
  React.useEffect(() => {
    if (isSubItemActive && depth === 0) {
      setIsOpen(true);
    }
  }, [isSubItemActive, depth]);

  if (isCollapsed && depth === 0) {
    return (
      <div className="relative group px-2">
        <Link
          to={path || '#'}
          className={cn(
            "flex items-center justify-center w-12 h-12 mx-auto rounded-xl transition-all duration-200",
            (active || isSubItemActive) ? "bg-[#FF6A00] text-white shadow-lg shadow-orange-200" : "text-gray-500 hover:bg-orange-50 hover:text-[#FF6A00]"
          )}
        >
          {Icon && <Icon size={22} />}
        </Link>
        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
          {label}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(depth === 0 ? "px-3" : "")}>
      <div
        onClick={() => {
          if (hasSubItems) setIsOpen(!isOpen);
          if (onClick && !hasSubItems) onClick();
        }}
        className={cn(
          "flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group relative",
          (active && !hasSubItems) ? "bg-orange-50 text-[#FF6A00] font-bold active-menu-item" : "text-gray-600 hover:bg-orange-50 hover:text-[#FF6A00]",
          depth > 0 && "py-2 px-3"
        )}
        style={{ paddingLeft: depth > 0 ? `${(depth * 12) + 16}px` : undefined }}
      >
        {active && !hasSubItems && depth === 0 && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#FF6A00] rounded-r-full" />
        )}
        <div className="flex items-center gap-3">
          {Icon && <Icon size={depth === 0 ? 20 : 16} className={cn((active || isSubItemActive) ? "text-[#FF6A00]" : "text-gray-500 group-hover:text-[#FF6A00]")} />}
          {path && !hasSubItems ? (
            <Link to={path} className={cn(depth === 0 ? "text-sm" : "text-xs")}>{label}</Link>
          ) : (
            <span className={cn(depth === 0 ? "text-sm" : "text-xs")}>{label}</span>
          )}
        </div>
        {hasSubItems && (
          <ChevronRight size={16} className={cn("transition-transform duration-200", isOpen && "rotate-90")} />
        )}
      </div>
      
      {hasSubItems && isOpen && (
        <div className={cn(
          "mt-1 space-y-1 animate-in slide-in-from-top-2 duration-200",
          depth === 0 && "ml-4 pl-0 border-l border-gray-100"
        )}>
          {subItems.map((item, idx) => (
            <SidebarItem 
              key={idx}
              {...item}
              isCollapsed={isCollapsed}
              active={location.pathname === item.path}
              depth={depth + 1}
              onClick={onClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const sidebarRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (sidebarRef.current) {
      const activeItem = sidebarRef.current.querySelector('.active-menu-item');
      if (activeItem) {
        activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [location.pathname]);

  const menuSections: SidebarItemData[] = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin/dashboard',
      subItems: [
        { label: 'Overview Metrics', path: '/admin/dashboard' },
        { label: 'Sales Summary', path: '/admin/dashboard/sales' },
        { label: 'Recent Activities', path: '/admin/dashboard/activities' },
        { label: 'Quick Links', path: '/admin/dashboard/links' },
      ]
    },
    {
      label: 'Orders',
      icon: ShoppingCart,
      subItems: [
        { label: 'All Orders', path: '/admin/orders' },
        { label: 'Pending Orders', path: '/admin/orders/pending' },
        { label: 'Completed Orders', path: '/admin/orders/completed' },
        { label: 'Cancelled Orders', path: '/admin/orders/cancelled' },
        { label: 'Returns / Refunds', path: '/admin/orders/returns' },
        { label: 'Order Search / Filter', path: '/admin/orders/search' },
      ]
    },
    {
      label: 'Customers',
      icon: Users,
      subItems: [
        { label: 'Customer List', path: '/admin/customers' },
        { label: 'Customer Groups', path: '/admin/customers/groups' },
        { label: 'Customer Activity Log', path: '/admin/customers/logs' },
        { label: 'Loyalty / Rewards Program', path: '/admin/customers/loyalty' },
      ]
    },
    {
      label: 'Content Management',
      icon: Globe,
      subItems: [
        { label: 'Menu Builder', path: '/admin/menus' },
        { label: 'Dynamic Pages', path: '/admin/pages' },
        { label: 'Offers & Coupons', path: '/admin/offers' },
        { label: 'Contact Settings', path: '/admin/contact-settings' },
        { label: 'Footer Settings', path: '/admin/footer' },
      ]
    },
    {
      label: 'Products',
      icon: Package,
      subItems: [
        { label: 'Product List', path: '/admin/products' },
        { label: 'Add New Product', path: '/admin/products/add' },
        { label: 'Product Categories', path: '/admin/products/categories' },
        { label: 'Inventory Management', path: '/admin/products/inventory' },
        { label: 'Product Reviews', path: '/admin/products/reviews' },
        { label: 'Bulk Upload / Import', path: '/admin/products/bulk' },
      ]
    },
    {
      label: 'Marketing',
      icon: Megaphone,
      subItems: [
        { label: 'Marketing Overview', path: '/admin/marketing' },
        { label: 'Quick Campaign Links', path: '/admin/marketing/campaigns' },
      ]
    },
    {
      label: 'Marketing Hub',
      icon: Layers,
      subItems: [
        {
          label: 'Ad Setup',
          subItems: [
            { label: 'Facebook', path: '/admin/marketing-hub/ads/facebook' },
            { label: 'Google', path: '/admin/marketing-hub/ads/google' },
            { label: 'TikTok', path: '/admin/marketing-hub/ads/tiktok' },
          ]
        },
        {
          label: 'Tracking',
          subItems: [
            { label: 'Website Tracking', path: '/admin/marketing-hub/tracking/website' },
            { label: 'Server-Side Tracking', path: '/admin/marketing-hub/tracking/server' },
            { label: 'Customer Tracking & Analytics', path: '/admin/marketing-hub/tracking/analytics' },
          ]
        }
      ]
    },
    {
      label: 'Analytics',
      icon: BarChart3,
      subItems: [
        { label: 'Sales Analytics', path: '/admin/analytics/sales' },
        { label: 'Customer Analytics', path: '/admin/analytics/customers' },
        { label: 'Product Performance', path: '/admin/analytics/products' },
        { label: 'Marketing Campaign Analytics', path: '/admin/analytics/marketing' },
        { label: 'Custom Reports', path: '/admin/analytics/reports' },
      ]
    },
    {
      label: 'Logistics',
      icon: Truck,
      subItems: [
        { label: 'Shipping Providers', path: '/admin/logistics/providers' },
        { label: 'Shipment Tracking', path: '/admin/logistics/tracking' },
        { label: 'Delivery Status Dashboard', path: '/admin/logistics/dashboard' },
        { label: 'Warehouse Management', path: '/admin/logistics/warehouse' },
      ]
    },
    {
      label: 'Payments',
      icon: CreditCard,
      subItems: [
        { label: 'Payment Gateways', path: '/admin/payments/gateways' },
        { label: 'Transaction History', path: '/admin/payments/transactions' },
        { label: 'Refund Management', path: '/admin/payments/refunds' },
        { label: 'Settlement Reports', path: '/admin/payments/settlements' },
      ]
    },
    {
      label: 'Finance',
      icon: Wallet,
      subItems: [
        { label: 'Revenue Summary', path: '/admin/finance/revenue' },
        { label: 'Expense Tracking', path: '/admin/finance/expenses' },
        { label: 'Profit & Loss Reports', path: '/admin/finance/reports' },
        { label: 'Financial Dashboard', path: '/admin/finance/dashboard' },
      ]
    },
    {
      label: 'Vendors',
      icon: Store,
      subItems: [
        { label: 'Vendor List', path: '/admin/vendors/list' },
        { label: 'Vendor Management', path: '/admin/vendors/manage' },
        { label: 'Vendor Payments', path: '/admin/vendors/payments' },
        { label: 'Vendor Reports', path: '/admin/vendors/reports' },
      ]
    },
    {
      label: 'AI Intelligent',
      icon: Sparkles,
      subItems: [
        { label: 'Marketing Suggestions', path: '/admin/ai/marketing' },
        { label: 'Inventory Forecast', path: '/admin/ai/inventory' },
        { label: 'Customer Insights', path: '/admin/ai/customers' },
      ]
    },
    {
      label: 'Reviews',
      icon: Star,
      subItems: [
        { label: 'Product Reviews', path: '/admin/reviews/products' },
        { label: 'Customer Feedback', path: '/admin/reviews/feedback' },
        { label: 'Review Analytics', path: '/admin/reviews/analytics' },
      ]
    },
    {
      label: 'Reports',
      icon: FileBarChart,
      subItems: [
        { label: 'Sales Reports', path: '/admin/reports/sales' },
        { label: 'Orders Reports', path: '/admin/reports/orders' },
        { label: 'Customer Reports', path: '/admin/reports/customers' },
        { label: 'Marketing Reports', path: '/admin/reports/marketing' },
      ]
    },
    {
      label: 'Settings',
      icon: Settings,
      subItems: [
        { label: 'General Settings', path: '/admin/settings/general' },
        { label: 'User Roles & Permissions', path: '/admin/settings/roles' },
        { label: 'Notification Settings', path: '/admin/settings/notifications' },
        { label: 'Integration Settings', path: '/admin/settings/integrations' },
      ]
    },
    {
      label: 'Admin Management',
      icon: ShieldCheck,
      subItems: [
        { label: 'Admin Users List', path: '/admin/management/list' },
        { label: 'Role Management', path: '/admin/management/roles' },
        { label: 'Activity Logs', path: '/admin/management/logs' },
      ]
    },
    {
      label: 'Branding & Storage',
      icon: Globe2,
      path: '/admin/branding-storage'
    }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  return (
    <div className="flex h-screen bg-[#F5F6FA] overflow-hidden admin-body">
      {/* Sidebar - Desktop */}
      <aside 
        className={cn(
          "hidden md:flex flex-col bg-white border-r border-gray-100 transition-all duration-300 z-30 h-screen sticky top-0",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="p-6 flex items-center justify-between border-b border-gray-50 shrink-0">
          {!isCollapsed && (
            <Link to="/admin/dashboard" className="text-xl font-black text-[#FF6A00] tracking-tighter">
              TAZU ADMIN
            </Link>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-orange-50 text-gray-400 hover:text-[#FF6A00] transition-colors"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav ref={sidebarRef} className="flex-1 overflow-y-auto py-4 space-y-1 scroll-smooth">
          {menuSections.map((section) => (
            <SidebarItem 
              key={section.label}
              {...section}
              isCollapsed={isCollapsed}
              active={isPathActive(section.path, section.subItems, location.pathname)}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-gray-50 shrink-0">
          <button 
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all group",
              isCollapsed && "justify-center"
            )}
          >
            <LogOut size={20} />
            {!isCollapsed && <span className="font-medium text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden animate-in fade-in duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 w-64 bg-white z-50 transform transition-transform duration-300 md:hidden flex flex-col",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 flex items-center justify-between border-b border-gray-50 shrink-0">
          <Link to="/admin/dashboard" className="text-xl font-black text-[#FF6A00] tracking-tighter">TAZU ADMIN</Link>
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400"><X size={24} /></button>
        </div>
        <nav className="flex-1 overflow-y-auto py-6 space-y-1 no-scrollbar">
          {menuSections.map((section) => (
            <SidebarItem 
              key={section.label}
              {...section}
              isCollapsed={false}
              active={isPathActive(section.path, section.subItems, location.pathname)}
              onClick={() => {
                if (!section.subItems) setIsMobileMenuOpen(false);
              }}
            />
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 shrink-0 z-20 sticky top-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 text-gray-500 hover:bg-gray-50 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl w-64 md:w-80 border border-transparent focus-within:border-orange-200 focus-within:bg-white transition-all">
              <Search size={18} className="text-gray-400" />
              <input 
                type="text" 
                placeholder="Quick search..." 
                className="bg-transparent border-none outline-none text-sm w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button className="relative p-2 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#FF6A00] rounded-full border-2 border-white" />
            </button>
            
            <div className="h-8 w-px bg-gray-100 mx-1" />

            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 pl-2 hover:bg-gray-50 p-1 rounded-xl transition-all"
              >
                <div className="hidden md:block text-right">
                  <p className="text-sm font-bold text-gray-900 leading-none">{user?.name}</p>
                  <p className="text-[10px] font-bold text-[#FF6A00] uppercase tracking-tighter mt-1">{user?.email}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-[#FF6A00] border border-orange-100 overflow-hidden">
                  {user?.image ? (
                    <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon size={20} />
                  )}
                </div>
              </button>

              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-gray-50">
                      <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <div className="p-1">
                      <Link 
                        to="/admin/profile" 
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-orange-50 hover:text-[#FF6A00] transition-all"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <UserCircle size={18} />
                        Profile
                      </Link>
                      <Link 
                        to="/admin/settings/info" 
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-orange-50 hover:text-[#FF6A00] transition-all"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings size={18} />
                        Settings
                      </Link>
                    </div>
                    <div className="p-1 border-t border-gray-50 mt-1">
                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-all"
                      >
                        <LogOut size={18} />
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 no-scrollbar scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
}
