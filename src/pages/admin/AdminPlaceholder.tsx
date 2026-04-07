import React from 'react';
import { useLocation } from 'react-router-dom';
import { Construction } from 'lucide-react';

const AdminPlaceholder: React.FC = () => {
  const location = useLocation();
  const path = location.pathname.split('/').pop()?.replace(/-/g, ' ') || 'Page';

  return (
    <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
      <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center text-[#FF6A00]">
        <Construction size={40} />
      </div>
      <div>
        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
          {path} Under Construction
        </h2>
        <p className="text-gray-500 font-medium max-w-md mx-auto mt-2">
          We are working hard to bring you the {path} module. Stay tuned for updates!
        </p>
      </div>
      <button 
        onClick={() => window.history.back()}
        className="bg-[#FF6A00] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#E65F00] transition-all shadow-lg shadow-orange-100"
      >
        Go Back
      </button>
    </div>
  );
};

export default AdminPlaceholder;
