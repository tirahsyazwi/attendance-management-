import React from 'react';
import { motion } from 'motion/react';
import { 
  FileBarChart, 
  Download, 
  Printer, 
  Calendar, 
  Filter,
  ChevronDown
} from 'lucide-react';
import { Student } from '../types';

interface ReportsProps {
  students: Student[];
  reportType: 'standard' | 'custom';
  setReportType: (type: 'standard' | 'custom') => void;
  reportData: any[];
  customReportData: any[];
  exportToCSV: (data: any[], filename: string) => void;
}

export const Reports: React.FC<ReportsProps> = ({ 
  students, 
  reportType, 
  setReportType, 
  reportData, 
  customReportData, 
  exportToCSV 
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600">
              <FileBarChart size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Laporan & Analitik</h2>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Jana laporan prestasi kehadiran murid</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 no-print-section">
              <button 
                onClick={() => setReportType('standard')}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${reportType === 'standard' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Laporan Standard
              </button>
              <button 
                onClick={() => setReportType('custom')}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${reportType === 'custom' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Laporan Kustom
              </button>
            </div>

            {reportType === 'custom' && (
              <div className="flex items-center gap-2 no-print-section">
                <select className="bg-white border-2 border-slate-100 rounded-2xl px-4 py-2 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 transition-all">
                  <option>Semua Kelas</option>
                  <option>5 Cekal</option>
                  <option>4 Gigih</option>
                </select>
              </div>
            )}

            <div className="flex gap-2 no-print-section">
              <button 
                onClick={() => window.print()}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
              >
                <Printer size={18} />
                Cetak PDF
              </button>
              <button 
                onClick={() => exportToCSV(reportType === 'standard' ? reportData : customReportData, `Laporan_${reportType}_${new Date().toISOString().split('T')[0]}`)}
                className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
              >
                <Download size={18} />
                Eksport CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">Data Laporan {reportType === 'standard' ? 'Standard' : 'Kustom'}</h3>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <Calendar size={14} /> Mac 2024
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Nama Murid</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Hadir</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Ponteng</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Bersebab</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Peratus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {(reportType === 'standard' ? reportData : customReportData).map((row, idx) => (
                  <motion.tr 
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-slate-900">{row.name}</td>
                    <td className="px-6 py-4 text-emerald-600 font-bold">{row.hadir}</td>
                    <td className="px-6 py-4 text-rose-600 font-bold">{row.ponteng}</td>
                    <td className="px-6 py-4 text-blue-600 font-bold">{row.bersebab}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{row.peratus}%</span>
                        <div className="flex-1 h-1 bg-slate-100 rounded-full w-12">
                          <div 
                            className={`h-full rounded-full ${row.peratus > 90 ? 'bg-emerald-500' : row.peratus > 75 ? 'bg-amber-500' : 'bg-rose-500'}`}
                            style={{ width: `${row.peratus}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-6">Ringkasan Prestasi</h3>
            <div className="space-y-6">
              {[
                { label: 'Purata Kehadiran', value: '92.4%', color: 'emerald', trend: '+0.5%' },
                { label: 'Kes Ponteng Baru', value: '12', color: 'rose', trend: '-2' },
                { label: 'Surat Amaran Dijana', value: '5', color: 'amber', trend: '+1' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                    <p className={`text-2xl font-bold text-${item.color}-600`}>{item.value}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-lg text-[10px] font-bold ${item.trend.includes('+') ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {item.trend}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-indigo-600 p-6 rounded-3xl shadow-lg shadow-indigo-100 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="font-bold text-lg mb-2">Perlukan Bantuan?</h3>
              <p className="text-indigo-100 text-sm mb-6">Hubungi admin untuk bantuan teknikal atau pertanyaan lanjut mengenai sistem.</p>
              <button className="w-full py-3 bg-white text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
                Hubungi Admin
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-indigo-500 rounded-full opacity-20 group-hover:scale-110 transition-transform"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
