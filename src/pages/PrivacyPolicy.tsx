import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Lock } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364] py-16 px-4 text-center">
        <h1 className="text-white text-3xl md:text-4xl font-bold uppercase tracking-tight">Privacy Policy</h1>
        <div className="flex items-center justify-center gap-2 mt-4 text-gray-300 text-sm">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight size={14} />
          <span className="text-white">Privacy Policy</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-10">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 space-y-8">
          
          <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-4">
            <h2 className="text-lg font-bold text-[#222] mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-100 text-[#f85606] rounded-full flex items-center justify-center text-sm">1</span>
              Information We Collect
            </h2>
            <p className="text-sm text-[#555] leading-[1.8]">
              We collect information you provide directly to us when you create an account, make a purchase, or communicate with us. This may include your name, email address, phone number, shipping address, and payment information. We also collect information about your interactions with our website, such as your IP address, browser type, and pages visited.
            </p>
          </section>

          <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-4">
            <h2 className="text-lg font-bold text-[#222] mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-100 text-[#f85606] rounded-full flex items-center justify-center text-sm">2</span>
              How We Use Information
            </h2>
            <p className="text-sm text-[#555] leading-[1.8]">
              We use the information we collect to provide, maintain, and improve our services, process your transactions, communicate with you about your orders, and send you promotional offers and updates. We also use information to monitor and analyze trends, usage, and activities in connection with our services.
            </p>
          </section>

          <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-4">
            <h2 className="text-lg font-bold text-[#222] mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-100 text-[#f85606] rounded-full flex items-center justify-center text-sm">3</span>
              Cookies Policy
            </h2>
            <p className="text-sm text-[#555] leading-[1.8]">
              We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </section>

          <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-4">
            <h2 className="text-lg font-bold text-[#222] mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-100 text-[#f85606] rounded-full flex items-center justify-center text-sm">4</span>
              Data Protection
            </h2>
            <p className="text-sm text-[#555] leading-[1.8]">
              The security of your data is important to us. We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information. We use encryption to protect sensitive information transmitted online.
            </p>
          </section>

          <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-4">
            <h2 className="text-lg font-bold text-[#222] mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-100 text-[#f85606] rounded-full flex items-center justify-center text-sm">5</span>
              Third-party Sharing
            </h2>
            <p className="text-sm text-[#555] leading-[1.8]">
              We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information unless we provide you with advance notice. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.
            </p>
          </section>

          <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-4">
            <h2 className="text-lg font-bold text-[#222] mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-100 text-[#f85606] rounded-full flex items-center justify-center text-sm">6</span>
              User Rights
            </h2>
            <p className="text-sm text-[#555] leading-[1.8]">
              You have the right to access, update, or delete the personal information we have on you. You can do this by logging into your account or by contacting us directly. You also have the right to object to our processing of your personal data and the right to data portability.
            </p>
          </section>

          <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-4">
            <h2 className="text-lg font-bold text-[#222] mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-100 text-[#f85606] rounded-full flex items-center justify-center text-sm">7</span>
              Policy Updates
            </h2>
            <p className="text-sm text-[#555] leading-[1.8]">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-4">
            <h2 className="text-lg font-bold text-[#222] mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-100 text-[#f85606] rounded-full flex items-center justify-center text-sm">8</span>
              Contact Support
            </h2>
            <p className="text-sm text-[#555] leading-[1.8]">
              If you have any questions about this Privacy Policy, please contact our support team at privacy@tazumart.com or call us at +880 1234 567890.
            </p>
          </section>

          <div className="pt-10 border-t border-gray-100 flex flex-col items-center gap-4">
            <Lock size={48} className="text-[#f85606]" />
            <p className="text-xs text-gray-400">Last Updated: April 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}
