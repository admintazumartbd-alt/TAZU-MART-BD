import React, { useState } from 'react';
import { MapPin, Phone, RotateCcw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ReturnPolicyPopup = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
          >
            <div className="p-4 border-b flex items-center justify-between bg-[#f85606] text-white">
              <h3 className="font-bold flex items-center gap-2">
                <span>🔁</span> রিটার্ন ও এক্সচেঞ্জ নীতিমালা
              </h3>
              <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-3 text-sm text-gray-700 leading-relaxed">
              <div className="flex gap-2">
                <span className="text-[#f85606] font-bold">•</span>
                <p>কাস্টমার ডেলিভারির সময় প্রোডাক্ট ভালোভাবে চেক করে নিবেন।</p>
              </div>
              <div className="flex gap-2">
                <span className="text-[#f85606] font-bold">•</span>
                <p>প্রোডাক্ট পছন্দ না হলে (কালার / ডিজাইন পরিবর্তন) রিটার্ন বা এক্সচেঞ্জ করা যাবে।</p>
              </div>
              <div className="flex gap-2">
                <span className="text-[#f85606] font-bold">•</span>
                <p>ঢাকার ভিতরে রিটার্ন চার্জ: ৬০ টাকা।</p>
              </div>
              <div className="flex gap-2">
                <span className="text-[#f85606] font-bold">•</span>
                <p>ঢাকার বাইরে রিটার্ন চার্জ: ১২০ টাকা।</p>
              </div>
              <div className="flex gap-2">
                <span className="text-[#f85606] font-bold">•</span>
                <p>৭ দিনের মধ্যে রিটার্ন / এক্সচেঞ্জ করা যাবে।</p>
              </div>
              <div className="flex gap-2">
                <span className="text-[#f85606] font-bold">•</span>
                <p>ব্যবহৃত বা ক্ষতিগ্রস্ত প্রোডাক্ট গ্রহণযোগ্য নয়।</p>
              </div>
            </div>
            <div className="p-4 bg-gray-50 flex justify-end">
              <button 
                onClick={onClose}
                className="px-8 py-2 bg-[#f85606] text-white rounded-lg font-bold text-sm hover:bg-[#d94800] transition-colors shadow-md"
              >
                বুঝেছি
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default function FooterInfoSection() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleLaunchMap = () => {
    window.open('https://www.google.com/maps/search/?api=1&query=Rayerbagh,Dhaka', '_blank');
  };

  const handleLaunchPhone = () => {
    window.location.href = 'tel:01834800916';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 mb-6">
      <div className="w-full bg-gray-100 rounded-xl p-4 md:p-5 space-y-3 md:space-y-4 shadow-sm border border-gray-200/50">
        {/* Address */}
        <div 
          onClick={handleLaunchMap}
          className="flex items-start gap-3 cursor-pointer group"
        >
          <div className="bg-white p-2 rounded-lg text-[#f85606] shadow-sm group-hover:bg-[#f85606] group-hover:text-white transition-all">
            <MapPin size={18} />
          </div>
          <div className="flex-1">
            <p className="text-[13px] md:text-sm text-gray-700 leading-tight group-hover:text-[#f85606] transition-colors">
              রায়েরবাগ, হাজী ওয়াসিমুদ্দিন ভূঁইয়া রোড, ওয়ার্ড–৬০, ঢাকা–১২৩৬, বাংলাদেশ
            </p>
          </div>
        </div>

        {/* Phone */}
        <div 
          onClick={handleLaunchPhone}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="bg-white p-2 rounded-lg text-[#f85606] shadow-sm group-hover:bg-[#f85606] group-hover:text-white transition-all">
            <Phone size={18} />
          </div>
          <p className="text-[13px] md:text-sm font-bold text-gray-700 group-hover:text-[#f85606] transition-colors">
            01834800916
          </p>
        </div>

        {/* Return Policy Short */}
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-lg text-[#f85606] shadow-sm">
            <RotateCcw size={18} />
          </div>
          <div className="flex-1 flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="text-[13px] md:text-sm text-gray-700">
              রিটার্ন: ৭ দিনের মধ্যে | ঢাকার ভিতরে ৬০৳, ঢাকার বাইরে ১২০৳
            </p>
            <button 
              onClick={() => setIsPopupOpen(true)}
              className="text-[13px] md:text-sm font-bold text-[#f85606] hover:underline"
            >
              বিস্তারিত পড়ুন
            </button>
          </div>
        </div>
      </div>

      <ReturnPolicyPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
    </div>
  );
}
