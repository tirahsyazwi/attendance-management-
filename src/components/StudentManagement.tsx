import React from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  History, 
  Edit2, 
  Trash2,
  ChevronRight
} from 'lucide-react';
import { Student } from '../types';

interface StudentManagementProps {
  students: Student[];
  onViewHistory: (student: Student) => void;
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export const StudentManagement: React.FC<StudentManagementProps> = ({ 
  students, 
  onViewHistory, 
  onEdit, 
  onDelete, 
  onAdd 
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-slate-200 w-full sm:w-80 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
          <Search size={18} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari nama murid..." 
            className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full font-medium"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all shadow-sm">
            <Filter size={18} />
            Tapis
          </button>
          <button 
            onClick={onAdd}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform" />
            Tambah Murid
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Nama Murid</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Kelas</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Penjaga</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Ketidakhadiran</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {students.map((student, idx) => (
                <motion.tr 
                  key={student.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all">
                        {student.name?.charAt(0) || '?'}
                      </div>
                      <span className="font-bold text-slate-900">{student.name || 'Murid'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
                      {student.class_name || student.class}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-700">{student.parent_name || student.parentName}</p>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">{student.parent_phone || student.parentPhone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`
                      px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border
                      ${student.status === 'Aktif' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                        student.status === 'Gantung' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                        'bg-rose-50 text-rose-600 border-rose-100'}
                    `}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden w-24">
                        <div 
                          className={`h-full rounded-full ${student.totalAbsences > 5 ? 'bg-rose-500' : student.totalAbsences > 2 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${Math.min(student.totalAbsences * 10, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-slate-600">{student.totalAbsences} Hari</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => onViewHistory(student)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        title="Sejarah Kehadiran"
                      >
                        <History size={18} />
                      </button>
                      <button 
                        onClick={() => onEdit(student)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => onDelete(student.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
