import React, { useState, useEffect } from 'react';
import { ShieldCheck, Truck, RotateCcw, Headphones, Loader2 } from 'lucide-react';
import axios from '../lib/api';

interface PageData {
  title: string;
  content: string;
  bannerImage?: string;
}

export default function AboutPage() {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/pages/about')
      .then(res => {
        if (res.data && !res.data.error) {
          setPageData(res.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-[#f85606] animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">Loading About Us...</p>
      </div>
    );
  }

  if (pageData) {
    return (
      <div className="pb-20">
        <div className="bg-[#111111] text-white py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold">{pageData.title}</h1>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 -mt-12">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-16">
            <div 
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-img:rounded-2xl"
              dangerouslySetInnerHTML={{ __html: pageData.content }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-[#111111] text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold">About Tazu Mart BD</h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Your trusted partner for premium fashion and lifestyle products in Bangladesh.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-12">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-16 space-y-12">
          {/* Story Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-[#111111]">Our Story</h2>
              <p className="text-gray-600 leading-relaxed">
                Tazu Mart BD started with a simple vision: to bring high-quality, fashionable, and authentic products to the doorsteps of every Bangladeshi home. We understand the local market and the desire for premium products at fair prices.
              </p>
              <p className="text-gray-600 leading-relaxed">
                From stylish watches to premium perfume oils and decorative lights, we carefully curate every item in our collection to ensure it meets our strict quality standards.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden h-[300px] md:h-[400px]">
              <img 
                src="https://picsum.photos/seed/about-story/800/600" 
                alt="Our Story" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Mission Section */}
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12 text-center space-y-6">
            <h2 className="text-3xl font-bold text-[#111111]">Our Mission</h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg italic">
              "To empower our customers with style and confidence by providing authentic lifestyle products with an exceptional shopping experience."
            </p>
          </div>

          {/* Trust Factors */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-8">
            {[
              { icon: ShieldCheck, title: '100% Original', desc: 'We only sell authentic products' },
              { icon: Truck, title: 'Fast Delivery', desc: 'Quick shipping across the country' },
              { icon: RotateCcw, title: 'Easy Returns', desc: '7-day hassle-free return policy' },
              { icon: Headphones, title: 'Expert Support', desc: 'Always here to help you' }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-3 p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-all">
                <div className="bg-pink-50 p-4 rounded-full text-[#E91E63]">
                  <item.icon size={32} />
                </div>
                <h3 className="font-bold text-[#111111]">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center pt-12">
            <h2 className="text-2xl font-bold mb-6">Ready to start shopping?</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/shop" className="bg-[#E91E63] text-white px-8 py-3 rounded-full font-bold hover:bg-[#c2185b] transition-all">
                Browse Shop
              </a>
              <a href="/contact" className="bg-[#111111] text-white px-8 py-3 rounded-full font-bold hover:bg-black transition-all">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
