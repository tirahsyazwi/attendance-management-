import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  History, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Info, 
  Clock 
} from 'lucide-react';
import { Student, Attendance } from '../types';

interface StudentHistoryModalProps {
  student: Student | null;
  history: Attendance[];
  onClose: () => void;
}

export const StudentHistoryModal: React.FC<StudentHistoryModalProps> = ({ 
  student, 
  history, 
  onClose 
}) => {
  if (!student) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 no-print-section">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="p-6 sm:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-indigo-100">
                {student.name?.charAt(0) || '?'}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{student.name || 'Murid'}</h2>
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mt-1">{student.class_name || student.class}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Hadir', value: history.filter(h => h.status === 'Hadir').length, color: 'emerald', icon: CheckCircle2 },
                { label: 'Ponteng', value: history.filter(h => h.status === 'Ponteng').length, color: 'rose', icon: XCircle },
                { label: 'Bersebab', value: history.filter(h => h.status === 'Bersebab').length, color: 'blue', icon: Info },
                { label: 'Lewat', value: history.filter(h => h.status === 'Lewat').length, color: 'amber', icon: Clock },
              ].map((stat, idx) => (
                <div key={idx} className={`p-4 rounded-2xl bg-${stat.color}-50 border border-${stat.color}-100 text-center`}>
                  <p className={`text-[10px] font-bold text-${stat.color}-600 uppercase tracking-widest mb-1`}>{stat.label}</p>
                  <p className={`text-2xl font-bold text-${stat.color}-700`}>{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <History size={18} className="text-indigo-600" />
                Rekod Kehadiran Terkini
              </h3>
              <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white border-b border-slate-200">
                      <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tarikh</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Catatan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {history.length > 0 ? (
                      history.map((record, idx) => (
                        <tr key={idx} className="hover:bg-white transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                              <Calendar size={14} className="text-slate-400" />
                              {record.date}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`
                              px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border
                              ${record.status === 'Hadir' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                record.status === 'Ponteng' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                                record.status === 'Bersebab' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                                'bg-amber-50 text-amber-600 border-amber-100'}
                            `}>
                              {record.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500 italic">
                            {record.reason || '-'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="px-6 py-12 text-center text-slate-400 font-medium italic">
                          Tiada rekod sejarah ditemui.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
