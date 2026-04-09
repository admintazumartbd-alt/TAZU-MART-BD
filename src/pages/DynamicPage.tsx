import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Loader2, AlertCircle, ChevronRight, Home } from 'lucide-react';
import axios from '../lib/api';

interface PageData {
  title: string;
  content: string;
  bannerImage?: string;
  seoTitle?: string;
  metaDescription?: string;
}

export default function DynamicPage() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    axios.get(`/api/pages/${slug}`)
      .then(res => {
        setPage(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch page:", err);
        setError(err.response?.data?.error || err.message);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-[#f85606] animate-spin" />
        <p className="text-gray-500 animate-pulse">Loading content...</p>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-50 text-[#f85606] mb-6">
          <AlertCircle size={32} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Content Coming Soon</h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          We're currently working on this page. Please check back later or explore our other collections.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center justify-center px-8 py-3 bg-[#f85606] text-white font-bold rounded-full hover:bg-[#d94800] transition-colors"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white"
    >
      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Link to="/" className="hover:text-[#f85606] flex items-center gap-1">
              <Home size={12} /> Home
            </Link>
            <ChevronRight size={12} />
            <span className="text-gray-900 font-medium">{page.title}</span>
          </div>
        </div>
      </div>

      {/* Banner */}
      {page.bannerImage && (
        <div className="relative h-[200px] md:h-[350px] overflow-hidden">
          <img 
            src={page.bannerImage} 
            alt={page.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white text-center px-4">
              {page.title}
            </h1>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        {!page.bannerImage && (
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 border-b pb-4">
            {page.title}
          </h1>
        )}
        
        <div 
          className="prose prose-orange max-w-none prose-img:rounded-xl prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-[#f85606] prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>
    </motion.div>
  );
}
