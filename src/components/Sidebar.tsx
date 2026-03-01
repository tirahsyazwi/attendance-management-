import React from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  AlertTriangle, 
  FileBarChart, 
  LogOut,
  GraduationCap,
  X
} from 'lucide-react';
import { ViewType, User } from '../types';

interface SidebarProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  user: User;
  onLogout: () => void;
  warningCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  setCurrentView, 
  isSidebarOpen, 
  setIsSidebarOpen,
  user,
  onLogout,
  warningCount
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Murid', icon: Users },
    { id: 'attendance', label: 'Kehadiran', icon: CalendarCheck },
    { id: 'warnings', label: 'Amaran', icon: AlertTriangle },
    { id: 'reports', label: 'Laporan', icon: FileBarChart },
  ];

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out no-print-section
      lg:relative lg:translate-x-0
      ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl">
            <GraduationCap className="text-white" size={24} />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">Sistem HEM</span>
        </div>
        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-500 hover:text-slate-800">
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setCurrentView(item.id as ViewType);
              setIsSidebarOpen(false);
            }}
            className={`
              w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group
              ${currentView === item.id 
                ? 'bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}
            `}
          >
            <item.icon size={20} className={currentView === item.id ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'} />
            <span className="font-semibold">{item.label}</span>
            {item.id === 'warnings' && warningCount > 0 && (
              <span className="ml-auto bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {warningCount}
              </span>
            )}
            {currentView === item.id && item.id !== 'warnings' && (
              <motion.div layoutId="active-pill" className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600" />
            )}
            {currentView === item.id && item.id === 'warnings' && warningCount === 0 && (
              <motion.div layoutId="active-pill" className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600" />
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100 space-y-4">
        <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border border-indigo-200">
            {user.name?.charAt(0) || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">{user.name || 'Pengguna'}</p>
            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider truncate">{user.role}</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors font-semibold"
        >
          <LogOut size={20} />
          <span>Log Keluar</span>
        </button>
      </div>
    </aside>
  );
};
