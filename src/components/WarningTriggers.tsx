import React from 'react';
import { motion } from 'motion/react';
import { 
  AlertTriangle, 
  Printer, 
  ChevronRight, 
  Mail, 
  Phone
} from 'lucide-react';
import { WarningTrigger } from '../types';

interface WarningTriggersProps {
  warningTriggers: WarningTrigger[];
  onPrintLetter: (student: WarningTrigger) => void;
}

export const WarningTriggers: React.FC<WarningTriggersProps> = ({ 
  warningTriggers, 
  onPrintLetter 
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl flex items-center gap-6">
        <div className="bg-amber-100 p-4 rounded-2xl text-amber-600 animate-pulse">
          <AlertTriangle size={32} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-amber-900">Tindakan Segera Diperlukan</h2>
          <p className="text-amber-700 font-medium">Sistem telah mengesan {warningTriggers.length} murid yang memerlukan tindakan amaran berdasarkan rekod ketidakhadiran.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {warningTriggers.map((trigger, idx) => (
          <motion.div
            key={trigger.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all group"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-600 border border-slate-200 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    {trigger.studentName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{trigger.studentName}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{trigger.studentClass}</p>
                  </div>
                </div>
                <span className={`
                  px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border
                  ${trigger.type === 'Amaran 1' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                    trigger.type === 'Amaran 2' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                    'bg-rose-50 text-rose-600 border-rose-100'}
                `}>
                  {trigger.type}
                </span>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-xs">
                    <span className="text-slate-400 block uppercase font-bold tracking-wider">Sebab</span>
                    <span className="font-semibold text-slate-700">{trigger.reason}</span>
                  </div>
                  <div className="text-xs">
                    <span className="text-slate-400 block uppercase font-bold tracking-wider">Jumlah Ponteng</span>
                    <span className="font-semibold text-slate-700">{trigger.totalAbsentUnexcused} Hari</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => onPrintLetter(trigger)}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 no-print-section"
                >
                  <Printer size={18} />
                  Cetak Surat Amaran
                </button>
                <button className="p-3 bg-white border-2 border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 rounded-2xl transition-all">
                  <Phone size={20} />
                </button>
                <button className="p-3 bg-white border-2 border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 rounded-2xl transition-all">
                  <Mail size={20} />
                </button>
              </div>
            </div>
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dikesan pada: {trigger.date}</span>
              <button className="text-indigo-600 text-xs font-bold hover:underline flex items-center gap-1">
                Lihat Profil <ChevronRight size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
