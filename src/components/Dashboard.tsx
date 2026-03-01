import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  ArrowRight,
  FileBarChart
} from 'lucide-react';
import { Student, WarningTrigger } from '../types';

interface DashboardProps {
  students: Student[];
  warningTriggers: WarningTrigger[];
  setCurrentView: (view: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ students, warningTriggers, setCurrentView }) => {
  const stats = [
    { label: 'Jumlah Murid', value: students.length, icon: Users, color: 'indigo', trend: '+2 bulan ini' },
    { label: 'Kehadiran Hari Ini', value: '94%', icon: UserCheck, color: 'emerald', trend: '+1.2% dari semalam' },
    { label: 'Ketidakhadiran', value: '6%', icon: UserX, color: 'rose', trend: '-0.5% dari semalam' },
    { label: 'Kes Amaran', value: warningTriggers.length, icon: AlertTriangle, color: 'amber', trend: `${warningTriggers.length} kes aktif` },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.trend.includes('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                {stat.trend.includes('+') ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {stat.trend}
              </div>
            </div>
            <h3 className="text-slate-500 text-sm font-semibold mb-1">{stat.label}</h3>
            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity or Warnings */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">
              {warningTriggers.length > 0 ? 'Amaran Perlu Dijana' : 'Aktiviti Terkini'}
            </h2>
            <button 
              onClick={() => setCurrentView(warningTriggers.length > 0 ? 'warnings' : 'attendance')}
              className="text-indigo-600 text-sm font-bold hover:underline flex items-center gap-1"
            >
              Lihat Semua <ArrowRight size={14} />
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {warningTriggers.length > 0 ? (
              warningTriggers.slice(0, 4).map((trigger, idx) => (
                <div key={idx} className="p-4 hover:bg-slate-50 transition-colors flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold border border-amber-100`}>
                    {trigger.studentName?.charAt(0) || '?'}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-700">
                      <span className="font-bold text-slate-900">{trigger.studentName || 'Murid'}</span> memerlukan <span className="font-bold text-amber-600">{trigger.type}</span>
                    </p>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">{trigger.reason}</p>
                  </div>
                  <button 
                    onClick={() => setCurrentView('warnings')}
                    className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
              ))
            ) : (
              [
                { type: 'attendance', user: 'Ahmad Ali', action: 'ditandakan Hadir', time: '2 minit yang lalu', color: 'emerald' },
                { type: 'attendance', user: 'Siti Aminah', action: 'ditandakan Bersebab', time: '2 jam yang lalu', color: 'blue' },
                { type: 'status', user: 'Chong Wei Ming', action: 'status dikemaskini ke Aktif', time: '3 jam yang lalu', color: 'indigo' },
              ].map((activity, idx) => (
                <div key={idx} className="p-4 hover:bg-slate-50 transition-colors flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full bg-${activity.color}-500 shadow-lg shadow-${activity.color}-200`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-700">
                      <span className="font-bold text-slate-900">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Tindakan Pantas</h2>
          <div className="space-y-4">
            <button 
              onClick={() => setCurrentView('attendance')}
              className="w-full p-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all flex items-center justify-between group shadow-lg shadow-indigo-100"
            >
              <span>Ambil Kehadiran</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => setCurrentView('students')}
              className="w-full p-4 rounded-2xl bg-white border-2 border-slate-100 text-slate-700 font-bold hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center justify-between group"
            >
              <span>Tambah Murid Baru</span>
              <Users size={18} className="group-hover:scale-110 transition-transform" />
            </button>
            <button 
              onClick={() => setCurrentView('reports')}
              className="w-full p-4 rounded-2xl bg-white border-2 border-slate-100 text-slate-700 font-bold hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center justify-between group"
            >
              <span>Jana Laporan</span>
              <FileBarChart size={18} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
