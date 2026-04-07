import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364] py-16 px-4 text-center">
        <h1 className="text-white text-3xl md:text-4xl font-bold uppercase tracking-tight">Terms of Service</h1>
        <div className="flex items-center justify-center gap-2 mt-4 text-gray-300 text-sm">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight size={14} />
          <span className="text-white">Terms of Service</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-10">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 space-y-8">
          
          <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-4">
            <h2 className="text-lg font-bold text-[#222] mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-100 text-[#f85606] rounded-full flex items-center justify-center text-sm">1</span>
              Introduction
            </h2>
            <p className="text-sm text-[#555] leading-[1.8]">
              Welcome to TAZU MART. By accessing or using our website, you agree to comply with and be bound by these Terms of Service. Please read them carefully before using our services. These terms apply to all visitors, users, and others who access or use the Service.
            </p>
          </section>

          <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-4">
            <h2 className="text-lg font-bold text-[#222] mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-100 text-[#f85606] rounded-full flex items-center justify-center text-sm">2</span>
              User Account Rules
            </h2>
            <p className="text-sm text-[#555] leading-[1.8]">
              When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service. You are responsible for safeguarding the password that you use to access the Service.
            </p>
          </section>

          <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-4">
            <h2 className="text-lg font-bold text-[#222] mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-100 text-[#f85606] rounded-full flex items-center justify-center text-sm">3</span>
              Product Purchase Policy
            </h2>
            <p className="text-sm text-[#555] leading-[1.8]">
              All products listed on TAZU MART are subject to availability. We reserve the right to limit the quantities of any products or services that we offer. All descriptions of products or product pricing are subject to change at anytime without notice, at the sole discretion of us.
            </p>
          </section>

          <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-4">
            <h2 className="text-lg font-bold text-[#222] mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-100 text-[#f85606] rounded-full flex items-center justify-center text-sm">4</span>
              Payment Terms
            </h2>
            <p className="text-sm text-[#555] leading-[1.8]">
              We accept various forms of payment including Cash on Delivery (COD), Mobile Banking (bKash, Nagad), and Online Payments. By providing a payment method, you represent and warrant that you have the legal right to use any credit card(s) or other payment method(s) utilized in connection with any Purchase.
            </p>
          </section>

          <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-4">
            <h2 className="text-lg font-bold text-[#222] mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-100 text-[#f85606] rounded-full flex items-center justify-center text-sm">5</span>
              Return & Refund Policy
            </h2>
            <p className="text-sm text-[#555] leading-[1.8]">
              Our Return and Refund Policy is designed to ensure customer satisfaction. If you are not satisfied with your purchase, you may return the product within 7 days of delivery, provided it is in its original condition and packaging. Refunds will be processed within 10-15 working days.
            </p>
          </section>

          <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-4">
            <h2 className="text-lg font-bold text-[#222] mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-100 text-[#f85606] rounded-full flex items-center justify-center text-sm">6</span>
              Prohibited Activities
            </h2>
            <p className="text-sm text-[#555] leading-[1.8]">
              You may not use the Service for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction. You are prohibited from violating or attempting to violate the security of the website, including, without limitation, accessing data not intended for you.
            </p>
          </section>

          <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-4">
            <h2 className="text-lg font-bold text-[#222] mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-100 text-[#f85606] rounded-full flex items-center justify-center text-sm">7</span>
              Account Suspension Policy
            </h2>
            <p className="text-sm text-[#555] leading-[1.8]">
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
            </p>
          </section>

          <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-4">
            <h2 className="text-lg font-bold text-[#222] mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-100 text-[#f85606] rounded-full flex items-center justify-center text-sm">8</span>
              Changes to Terms
            </h2>
            <p className="text-sm text-[#555] leading-[1.8]">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
          </section>

          <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-4">
            <h2 className="text-lg font-bold text-[#222] mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-100 text-[#f85606] rounded-full flex items-center justify-center text-sm">9</span>
              Contact Information
            </h2>
            <p className="text-sm text-[#555] leading-[1.8]">
              If you have any questions about these Terms, please contact us at support@tazumart.com or call us at +880 1234 567890.
            </p>
          </section>

          <div className="pt-10 border-t border-gray-100 flex flex-col items-center gap-4">
            <ShieldCheck size={48} className="text-[#f85606]" />
            <p className="text-xs text-gray-400">Last Updated: April 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}
