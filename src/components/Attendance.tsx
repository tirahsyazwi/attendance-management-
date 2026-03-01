import React from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Info,
  Save
} from 'lucide-react';
import { Student, Attendance as AttendanceType, AttendanceStatus } from '../types';

interface AttendanceProps {
  students: Student[];
  attendance: AttendanceType[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  onUpdateStatus: (studentId: string, status: AttendanceStatus) => void;
  onSave: () => void;
}

export const Attendance: React.FC<AttendanceProps> = ({ 
  students, 
  attendance, 
  selectedDate, 
  setSelectedDate, 
  onUpdateStatus, 
  onSave 
}) => {
  const getStatusForStudent = (studentId: string) => {
    return attendance.find(a => a.studentId === studentId && a.date === selectedDate)?.status || 'Hadir';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600">
            <Calendar size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Rekod Kehadiran</h2>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Kelas 5 Cekal</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center bg-slate-50 rounded-2xl border border-slate-200 p-1">
            <button 
              onClick={() => {
                const d = new Date(selectedDate);
                d.setDate(d.getDate() - 1);
                setSelectedDate(d.toISOString().split('T')[0]);
              }}
              className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-500 hover:text-indigo-600"
            >
              <ChevronLeft size={20} />
            </button>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-700 px-4 py-2"
            />
            <button 
              onClick={() => {
                const d = new Date(selectedDate);
                d.setDate(d.getDate() + 1);
                setSelectedDate(d.toISOString().split('T')[0]);
              }}
              className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-500 hover:text-indigo-600"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <button 
            onClick={onSave}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 group"
          >
            <Save size={20} className="group-hover:scale-110 transition-transform" />
            Simpan Rekod
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student, idx) => {
          const status = getStatusForStudent(student.id);
          return (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={`
                p-5 rounded-3xl border-2 transition-all duration-300 group relative overflow-hidden
                ${status === 'Hadir' ? 'bg-white border-slate-100 hover:border-emerald-200' : 
                  status === 'Ponteng' ? 'bg-rose-50 border-rose-100' : 
                  status === 'Bersebab' ? 'bg-blue-50 border-blue-100' : 
                  'bg-amber-50 border-amber-100'}
              `}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`
                    w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold transition-all
                    ${status === 'Hadir' ? 'bg-slate-100 text-slate-600 group-hover:bg-indigo-600 group-hover:text-white' : 
                      status === 'Ponteng' ? 'bg-rose-100 text-rose-600' : 
                      status === 'Bersebab' ? 'bg-blue-100 text-blue-600' : 
                      'bg-amber-100 text-amber-600'}
                  `}>
                    {student.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 leading-tight">{student.name || 'Murid'}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{student.class_name || student.class}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => onUpdateStatus(student.id, 'Hadir')}
                  className={`
                    flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all
                    ${status === 'Hadir' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'bg-white border border-slate-100 text-slate-500 hover:bg-slate-50'}
                  `}
                >
                  <CheckCircle2 size={14} /> Hadir
                </button>
                <button 
                  onClick={() => onUpdateStatus(student.id, 'Ponteng')}
                  className={`
                    flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all
                    ${status === 'Ponteng' ? 'bg-rose-600 text-white shadow-lg shadow-rose-100' : 'bg-white border border-slate-100 text-slate-500 hover:bg-slate-50'}
                  `}
                >
                  <XCircle size={14} /> Ponteng
                </button>
                <button 
                  onClick={() => onUpdateStatus(student.id, 'Bersebab')}
                  className={`
                    flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all
                    ${status === 'Bersebab' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white border border-slate-100 text-slate-500 hover:bg-slate-50'}
                  `}
                >
                  <Info size={14} /> Bersebab
                </button>
                <button 
                  onClick={() => onUpdateStatus(student.id, 'Lewat')}
                  className={`
                    flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all
                    ${status === 'Lewat' ? 'bg-amber-600 text-white shadow-lg shadow-amber-100' : 'bg-white border border-slate-100 text-slate-500 hover:bg-slate-50'}
                  `}
                >
                  <Clock size={14} /> Lewat
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
