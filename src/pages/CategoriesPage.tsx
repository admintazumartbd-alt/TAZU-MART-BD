import { CATEGORIES } from '@/src/constants';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function CategoriesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12 text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold">All Categories</h1>
        <p className="text-gray-500">Browse our wide range of fashion and lifestyle products</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {CATEGORIES.map((cat) => (
          <Link 
            key={cat.id} 
            to={`/category/${cat.slug}`}
            className="group relative h-[250px] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
          >
            <img 
              src={cat.banner || '/default-banner.png'} 
              alt={cat.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              referrerPolicy="no-referrer"
              onError={(e) => (e.currentTarget.src = '/default-banner.png')}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
              <h2 className="text-2xl font-bold text-white mb-1">{cat.name}</h2>
              <p className="text-gray-300 text-sm mb-4">{cat.nameBn}</p>
              <span className="inline-flex items-center gap-2 text-[#E91E63] font-bold text-sm bg-white px-4 py-2 rounded-full w-fit group-hover:gap-3 transition-all">
                Shop Now <ChevronRight size={16} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
