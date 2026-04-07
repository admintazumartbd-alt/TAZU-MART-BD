import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const phoneNumber = '01834800916'; // Using the provided number
  const message = 'Hello Tazu Mart BD, I would like to inquire about your products.';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-20 right-4 z-50 bg-[#25D366] text-white p-3 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={24} fill="currentColor" />
      <span className="absolute right-full mr-3 bg-white text-gray-800 px-3 py-1.5 rounded-lg text-xs font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-gray-100">
        Chat with us
      </span>
    </a>
  );
}
