import React from 'react';
import { Phone, Mail, MapPin, MessageCircle, Facebook, Instagram, Send } from 'lucide-react';

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-[#E91E63] text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold">Contact Us</h1>
          <p className="text-pink-100 max-w-2xl mx-auto text-lg">
            Have questions? We're here to help you 24/7.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
              <h2 className="text-2xl font-bold text-[#111111]">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-pink-50 p-3 rounded-xl text-[#E91E63]">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-[#111111]">Phone</p>
                    <p className="text-gray-500">01XXXXXXXXX</p>
                    <p className="text-xs text-gray-400 mt-1">Sat - Thu, 10am - 8pm</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-pink-50 p-3 rounded-xl text-[#E91E63]">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-[#111111]">Email</p>
                    <p className="text-gray-500">info@tazumartbd.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-pink-50 p-3 rounded-xl text-[#E91E63]">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-[#111111]">Office</p>
                    <p className="text-gray-500">Dhaka, Bangladesh</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t">
                <p className="font-bold text-[#111111] mb-4">Follow Us</p>
                <div className="flex gap-4">
                  <a href="#" className="bg-gray-100 p-3 rounded-full text-gray-600 hover:bg-[#E91E63] hover:text-white transition-all">
                    <Facebook size={20} />
                  </a>
                  <a href="#" className="bg-gray-100 p-3 rounded-full text-gray-600 hover:bg-[#E91E63] hover:text-white transition-all">
                    <Instagram size={20} />
                  </a>
                  <a href="#" className="bg-gray-100 p-3 rounded-full text-gray-600 hover:bg-[#E91E63] hover:text-white transition-all">
                    <MessageCircle size={20} />
                  </a>
                </div>
              </div>
            </div>

            {/* WhatsApp Quick Link */}
            <a 
              href="https://wa.me/8801XXXXXXXXX" 
              target="_blank" 
              rel="noreferrer"
              className="bg-[#25D366] text-white p-6 rounded-2xl shadow-lg flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <MessageCircle size={32} />
                <div>
                  <p className="font-bold">Chat on WhatsApp</p>
                  <p className="text-xs opacity-90">Instant reply during office hours</p>
                </div>
              </div>
              <Send size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <h2 className="text-2xl font-bold text-[#111111] mb-8">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600">Full Name *</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-[#E91E63]"
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600">Email Address *</label>
                  <input 
                    required
                    type="email" 
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-[#E91E63]"
                    placeholder="Your email"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-gray-600">Subject *</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-[#E91E63]"
                    placeholder="How can we help?"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-gray-600">Message *</label>
                  <textarea 
                    required
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-[#E91E63] h-40"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>
                <div className="md:col-span-2">
                  <button 
                    type="submit"
                    className="w-full md:w-auto bg-[#E91E63] text-white px-12 py-4 rounded-xl font-bold hover:bg-[#c2185b] transition-all shadow-lg shadow-pink-200"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
