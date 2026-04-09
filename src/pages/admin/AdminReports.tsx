import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Plus, 
  ChevronRight, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Calendar, 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Activity, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Sparkles,
  FileSpreadsheet,
  FileJson,
  FileCode,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import axios from '../../lib/api';

export default function AdminReports() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/admin/reports');
        setReports(response.data);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 text-[#FF6A00] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FF6A00] flex items-center justify-center text-white shadow-lg shadow-orange-100">
              <FileText size={24} />
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">
              Report <span className="text-[#FF6A00]">Archive</span>
            </h1>
          </div>
          <p className="text-sm text-gray-500 font-medium max-w-md">
            Generate and manage comprehensive business reports, financial statements, and performance audits.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button className="bg-white text-gray-900 px-8 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest shadow-sm border border-gray-100 hover:shadow-md hover:bg-gray-50 transition-all flex items-center gap-3 group">
            <Calendar size={18} className="group-hover:translate-y-0.5 transition-transform" />
            Schedule Report
          </button>
          <button className="bg-[#FF6A00] text-white px-8 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-orange-100 hover:bg-[#E65F00] hover:scale-105 transition-all flex items-center gap-3">
            <Plus size={20} />
            Generate New
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Reports Generated', value: '1,240', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+124' },
          { label: 'Scheduled Tasks', value: '12', icon: Clock, color: 'text-[#FF6A00]', bg: 'bg-orange-50', trend: '+2' },
          { label: 'Audit Compliance', value: '100%', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '0%' },
          { label: 'Storage Used', value: '4.2 GB', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50', trend: '+0.5 GB' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 hover:shadow-2xl transition-all group">
            <div className="flex items-center justify-between mb-6">
              <div className={cn("p-4 rounded-2xl transition-colors shadow-sm", stat.bg, stat.color)}>
                <stat.icon size={24} />
              </div>
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-tighter shadow-sm border border-emerald-100">
                <ArrowUpRight size={14} />
                {stat.trend}
              </div>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-gray-900 tracking-tight leading-none">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Reports Table */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[40px] shadow-sm border border-gray-50 overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-[#FF6A00]">
                  <Activity size={20} />
                </div>
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Recent Reports</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <input 
                    type="text" 
                    placeholder="Search reports..." 
                    className="pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl text-[10px] font-bold outline-none focus:bg-white focus:border-[#FF6A00] transition-all w-48 shadow-inner"
                  />
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF6A00]" size={16} />
                </div>
                <button className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 hover:text-gray-600 transition-all">
                  <Filter size={18} />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Report Name</th>
                    <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Type & Format</th>
                    <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Generated</th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {reports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50/50 transition-all group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-[#FF6A00] group-hover:bg-orange-50 transition-all border border-gray-100 shadow-sm">
                            <FileText size={20} />
                          </div>
                          <div>
                            <p className="text-xs font-black text-gray-900 uppercase tracking-tight group-hover:text-[#FF6A00] transition-colors">{report.name}</p>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">{report.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <p className="text-xs font-black text-gray-900 uppercase tracking-tight">{report.type}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {report.format === 'PDF' ? <FileText size={12} className="text-rose-500" /> : <FileSpreadsheet size={12} className="text-emerald-500" />}
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{report.format}</p>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border shadow-sm",
                          report.status === 'Ready' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                          report.status === 'Processing' ? "bg-orange-50 text-[#FF6A00] border-orange-100" :
                          "bg-gray-50 text-gray-500 border-gray-100"
                        )}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <p className="text-[10px] font-black text-gray-900 uppercase tracking-tight">{report.date}</p>
                        <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-1">Timestamp</p>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-gray-400 hover:text-[#FF6A00] hover:bg-orange-50 rounded-xl transition-all" title="Download">
                            <Download size={18} />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-xl transition-all">
                            <MoreHorizontal size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Report Templates Bento */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 space-y-8 relative overflow-hidden group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Sparkles size={20} />
              </div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Report Templates</h3>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Sales Summary', icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Inventory Audit', icon: PieChart, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Customer Insights', icon: TrendingUp, color: 'text-[#FF6A00]', bg: 'bg-orange-50' },
                { label: 'Financial Statement', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50' },
              ].map((template, i) => (
                <button 
                  key={i}
                  className="w-full flex items-center justify-between p-5 bg-gray-50 rounded-[28px] border border-transparent hover:border-orange-100 hover:bg-white hover:shadow-md transition-all group/temp"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm group-hover/temp:scale-110 transition-transform", template.bg, template.color)}>
                      <template.icon size={20} />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-black text-gray-900 uppercase tracking-tight">{template.label}</p>
                      <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-1">Standard Format</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 group-hover/temp:text-[#FF6A00] group-hover/temp:translate-x-1 transition-all" />
                </button>
              ))}
            </div>

            <div className="bg-blue-50 p-6 rounded-[32px] border border-blue-100 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-[0.05] group-hover:scale-110 transition-transform duration-700">
                <AlertCircle size={80} />
              </div>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">Automated Reports</p>
              <p className="text-[11px] font-bold text-blue-700 leading-relaxed uppercase tracking-wider relative z-10">
                Your weekly performance summary will be generated every Monday at 8:00 AM and sent to your email.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
