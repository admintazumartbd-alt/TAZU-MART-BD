import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import ProductDetails from './pages/ProductDetails';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import WishlistPage from './pages/WishlistPage';
import SearchPage from './pages/SearchPage';
import CategoriesPage from './pages/CategoriesPage';
import DynamicPage from './pages/DynamicPage';
import FilteredProductPage from './pages/FilteredProductPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AuthPage from './pages/AuthPage';
import AccountPage from './pages/AccountPage';
import SupportPage from './pages/SupportPage';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';

// Admin Pages
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCustomerList from './pages/admin/AdminCustomerList';
import AdminOrderList from './pages/admin/AdminOrderList';
import AdminProductList from './pages/admin/AdminProductList';
import AdminMenuManagement from './pages/admin/AdminMenuManagement';
import AdminPageManagement from './pages/admin/AdminPageManagement';
import AdminOfferManagement from './pages/admin/AdminOfferManagement';
import AdminContactSettings from './pages/admin/AdminContactSettings';
import AdminFooterSettings from './pages/AdminFooterSettings';
import AdminCustomerMonitoring from './pages/AdminCustomerMonitoring';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminProductAdd from './pages/admin/AdminProductAdd';
import AdminProductCategories from './pages/admin/AdminProductCategories';
import AdminProductInventory from './pages/admin/AdminProductInventory';
import AdminProfile from './pages/admin/AdminProfile';
import AdminSettings from './pages/admin/AdminSettings';
import AdminAbandonedCart from './pages/admin/AdminAbandonedCart';
import AdminSupportNotes from './pages/admin/AdminSupportNotes';
import AdminOrderDetails from './pages/admin/AdminOrderDetails';
import AdminMarketing from './pages/admin/AdminMarketing';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminLogistics from './pages/admin/AdminLogistics';
import AdminFinance from './pages/admin/AdminFinance';
import AdminVendors from './pages/admin/AdminVendors';
import AdminReviews from './pages/admin/AdminReviews';
import AdminReports from './pages/admin/AdminReports';
import AdminManagement from './pages/admin/AdminManagement';
import AdminBrandingStorage from './pages/admin/AdminBrandingStorage';
import AdminPlaceholder from './pages/admin/AdminPlaceholder';

// Marketing Hub
import FacebookAdSetup from './pages/admin/MarketingHub/FacebookAdSetup';
import GoogleAdSetup from './pages/admin/MarketingHub/GoogleAdSetup';
import TikTokAdSetup from './pages/admin/MarketingHub/TikTokAdSetup';
import WebsiteTracking from './pages/admin/MarketingHub/WebsiteTracking';
import ServerSideTracking from './pages/admin/MarketingHub/ServerSideTracking';
import CustomerTrackingAnalytics from './pages/admin/MarketingHub/CustomerTrackingAnalytics';

import { useAuth } from './context/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-12 h-12 border-4 border-orange-100 border-t-[#FF6A00] rounded-full animate-spin mb-4" />
      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Verifying Access...</p>
    </div>
  );
  
  if (!user) {
    return <Navigate to={requireAdmin ? "/admin-login" : "/auth"} />;
  }
  
  if (requireAdmin && user.role !== 'ADMIN') {
    console.warn('Unauthorized admin access attempt by:', user.email);
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public & Customer Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<CategoriesPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="category/:slug" element={<CategoryPage />} />
          <Route path="category/:slug/:subSlug" element={<CategoryPage />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="auth" element={<AuthPage />} />
          <Route path="admin-login" element={<AdminLoginPage />} />
          <Route path="account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
          <Route path="search" element={<SearchPage />} />
          
          {/* Dynamic & Filtered Routes */}
          <Route path="new-arrivals" element={<FilteredProductPage title="New Arrivals" filterType="isNewArrival" />} />
          <Route path="best-selling" element={<FilteredProductPage title="Best Selling" filterType="isBestSelling" />} />
          <Route path="offers" element={<FilteredProductPage title="Offers" filterType="isOfferProduct" />} />
          
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="support" element={<SupportPage />} />
          <Route path="terms-of-service" element={<TermsOfService />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="track-order" element={<div className="p-12 text-center">Order Tracking Coming Soon</div>} />
          
          {/* Dynamic Page Route (MUST BE LAST) */}
          <Route path=":slug" element={<DynamicPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/*" element={
          <ProtectedRoute requireAdmin>
            <AdminLayout>
              <Routes>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="profile" element={<AdminProfile />} />
                
                {/* Content Management */}
                <Route path="menus" element={<AdminMenuManagement />} />
                <Route path="pages" element={<AdminPageManagement />} />
                <Route path="offers" element={<AdminOfferManagement />} />
                <Route path="contact-settings" element={<AdminContactSettings />} />
                
                {/* Orders */}
                <Route path="orders" element={<AdminOrderList />} />
                <Route path="orders/pending" element={<AdminOrderList status="Pending" />} />
                <Route path="orders/confirmed" element={<AdminOrderList status="Confirmed" />} />
                <Route path="orders/processing" element={<AdminOrderList status="Processing" />} />
                <Route path="orders/packed" element={<AdminOrderList status="Packed" />} />
                <Route path="orders/shipped" element={<AdminOrderList status="Shipped" />} />
                <Route path="orders/out-for-delivery" element={<AdminOrderList status="Out for Delivery" />} />
                <Route path="orders/delivered" element={<AdminOrderList status="Delivered" />} />
                <Route path="orders/cancelled" element={<AdminOrderList status="Cancelled" />} />
                <Route path="orders/returned" element={<AdminOrderList status="Returned" />} />
                <Route path="orders/refunded" element={<AdminOrderList status="Refunded" />} />
                <Route path="orders/:id" element={<AdminOrderDetails />} />
                
                {/* Customers */}
                <Route path="customers" element={<AdminCustomerList />} />
                <Route path="customers/segments" element={<AdminPlaceholder />} />
                <Route path="customers/behavior" element={<AdminCustomerMonitoring />} />
                <Route path="customers/abandoned" element={<AdminAbandonedCart />} />
                <Route path="customers/support" element={<AdminSupportNotes />} />
                
                {/* Products */}
                <Route path="products" element={<AdminProductList />} />
                <Route path="products/add" element={<AdminProductAdd />} />
                <Route path="products/edit/:id" element={<AdminProductAdd />} />
                <Route path="products/categories" element={<AdminProductCategories />} />
                <Route path="products/brands" element={<AdminPlaceholder />} />
                <Route path="products/attributes" element={<AdminPlaceholder />} />
                <Route path="products/inventory" element={<AdminProductInventory />} />

                {/* Marketing */}
                <Route path="marketing" element={<AdminMarketing />} />
                <Route path="marketing/coupons" element={<AdminMarketing />} />
                <Route path="marketing/flash-sale" element={<AdminMarketing />} />
                <Route path="marketing/campaigns" element={<AdminMarketing />} />
                <Route path="marketing/push" element={<AdminMarketing />} />
                <Route path="marketing/email" element={<AdminMarketing />} />

                {/* Marketing Hub */}
                <Route path="marketing-hub/ads/facebook" element={<FacebookAdSetup />} />
                <Route path="marketing-hub/ads/google" element={<GoogleAdSetup />} />
                <Route path="marketing-hub/ads/tiktok" element={<TikTokAdSetup />} />
                <Route path="marketing-hub/tracking/website" element={<WebsiteTracking />} />
                <Route path="marketing-hub/tracking/server" element={<ServerSideTracking />} />
                <Route path="marketing-hub/tracking/analytics" element={<CustomerTrackingAnalytics />} />

                {/* Analytics */}
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="analytics/sales" element={<AdminAnalytics />} />
                <Route path="analytics/customers" element={<AdminAnalytics />} />
                <Route path="analytics/conversion" element={<AdminAnalytics />} />
                <Route path="analytics/products" element={<AdminAnalytics />} />

                {/* Logistics */}
                <Route path="logistics" element={<AdminLogistics />} />
                <Route path="logistics/methods" element={<AdminLogistics />} />
                <Route path="logistics/zones" element={<AdminLogistics />} />
                <Route path="logistics/couriers" element={<AdminLogistics />} />

                {/* Payments */}
                <Route path="payments" element={<AdminFinance />} />
                <Route path="payments/methods" element={<AdminFinance />} />
                <Route path="payments/transactions" element={<AdminFinance />} />
                <Route path="payments/refunds" element={<AdminFinance />} />

                {/* Finance */}
                <Route path="finance" element={<AdminFinance />} />
                <Route path="finance/earnings" element={<AdminFinance />} />
                <Route path="finance/expenses" element={<AdminFinance />} />
                <Route path="finance/payouts" element={<AdminFinance />} />

                {/* Vendors */}
                <Route path="vendors" element={<AdminVendors />} />
                <Route path="vendors/list" element={<AdminVendors />} />
                <Route path="vendors/approvals" element={<AdminVendors />} />
                <Route path="vendors/products" element={<AdminVendors />} />

                {/* AI Intelligent */}
                <Route path="ai/marketing" element={<AdminPlaceholder />} />
                <Route path="ai/inventory" element={<AdminPlaceholder />} />
                <Route path="ai/customers" element={<AdminPlaceholder />} />

                {/* Reviews */}
                <Route path="reviews" element={<AdminReviews />} />

                {/* Reports */}
                <Route path="reports" element={<AdminReports />} />
                <Route path="reports/sales" element={<AdminReports />} />
                <Route path="reports/orders" element={<AdminReports />} />
                <Route path="reports/customers" element={<AdminReports />} />
                
                {/* Settings */}
                <Route path="settings" element={<AdminSettings />} />
                <Route path="settings/general" element={<AdminSettings />} />
                <Route path="settings/info" element={<AdminSettings />} />
                <Route path="settings/email-sms" element={<AdminSettings />} />
                <Route path="settings/notifications" element={<AdminSettings />} />
                <Route path="settings/tax" element={<AdminSettings />} />
                <Route path="settings/payments" element={<AdminSettings />} />
                <Route path="settings/roles" element={<AdminSettings />} />

                {/* Admin Management */}
                <Route path="management" element={<AdminManagement />} />
                <Route path="management/list" element={<AdminManagement />} />
                <Route path="management/add" element={<AdminManagement />} />
                <Route path="management/roles" element={<AdminManagement />} />
                
                <Route path="branding-storage" element={<AdminBrandingStorage />} />
                <Route path="footer" element={<AdminFooterSettings />} />
                
                <Route path="*" element={<div className="p-8 text-center font-black text-gray-400 uppercase tracking-widest">Section Coming Soon</div>} />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}
