import React from 'react';
import { Phone, MessageCircle, Mail, MessageSquare, ChevronRight } from 'lucide-react';

const SupportPage: React.FC = () => {
  const supportOptions = [
    {
      icon: Phone,
      label: 'Call Now',
      value: '01834800916',
      action: () => window.open('tel:01834800916'),
      color: 'bg-blue-500',
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: '+8801834800916',
      action: () => window.open('https://wa.me/8801834800916'),
      color: 'bg-green-500',
    },
    {
      icon: MessageSquare,
      label: 'Messenger',
      value: 'Facebook Page',
      action: () => window.open('https://www.facebook.com/share/16VFFfKKox/'),
      color: 'bg-blue-600',
    },
  ];

  const emailSupport = [
    {
      email: 'tazumartbd@gmail.com',
      label: 'Customer Support',
    },
    {
      email: 'admin.tazumartbd@gmail.com',
      label: 'Admin Support',
    },
    {
      email: 'moderator.tazumartbd@gmail.com',
      label: 'Moderator / Report',
    },
    {
      email: 'support.tazumartbd@gmail.com',
      label: 'Technical Support',
    },
  ];

  const handleEmail = (email: string) => {
    window.open(`mailto:${email}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-[#E91E63] text-white py-12 px-4 text-center">
        <h1 className="text-3xl font-bold mb-2">Support Center</h1>
        <p className="text-pink-100">How can we help you today?</p>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-6 space-y-4">
        {/* Quick Contact Options */}
        <div className="grid grid-cols-1 gap-4">
          {supportOptions.map((option, index) => (
            <button
              key={index}
              onClick={option.action}
              className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow text-left w-full"
            >
              <div className={`${option.color} p-3 rounded-xl text-white`}>
                <option.icon size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{option.label}</h3>
                <p className="text-sm text-gray-500">{option.value}</p>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          ))}
        </div>

        {/* Email Support Section */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center gap-2">
            <Mail className="text-[#E91E63]" size={20} />
            <h2 className="font-bold text-gray-900">Email Support</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {emailSupport.map((item, index) => (
              <button
                key={index}
                onClick={() => handleEmail(item.email)}
                className="w-full p-4 flex flex-col gap-1 hover:bg-gray-50 transition-colors text-left"
              >
                <span className="text-sm font-medium text-gray-900">{item.label}</span>
                <span className="text-xs text-gray-500">{item.email}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Working Hours */}
        <div className="bg-pink-50 p-4 rounded-2xl border border-pink-100 text-center">
          <p className="text-xs text-pink-600 font-medium">
            Our support team is available 24/7 to assist you.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
