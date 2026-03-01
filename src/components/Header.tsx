import React from 'react';
import { Menu, Search, Bell } from 'lucide-react';
import { ViewType, User } from '../types';

interface HeaderProps {
  currentView: ViewType;
  setIsSidebarOpen: (open: boolean) => void;
  user: User;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setIsSidebarOpen, user }) => {
  const getTitle = () => {
    switch(currentView) {
      case 'dashboard': return 'Dashboard Overview';
      case 'students': return 'Pengurusan Murid';
      case 'attendance': return 'Rekod Kehadiran';
      case 'warnings': return 'Amaran & Tindakan';
      case 'reports': return 'Laporan & Analitik';
      default: return 'Sistem HEM';
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 px-4 lg:px-8 py-4 flex justify-between items-center sticky top-0 z-10 no-print-section">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{getTitle()}</h1>
      </div>

      <div className="flex items-center gap-3 lg:gap-6">
        <div className="hidden md:flex items-center bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
          <Search size={18} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari murid atau kelas..." 
            className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-48 lg:w-64 placeholder:text-slate-400 font-medium"
          />
        </div>
        
        <div className="flex items-center gap-2 lg:gap-4">
          <button className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-all relative group">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white group-hover:scale-110 transition-transform"></span>
          </button>
          
          <div className="h-10 w-px bg-slate-200 mx-1 hidden sm:block"></div>
          
          <button className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-xl hover:bg-slate-100 transition-all group">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900 leading-none">{user.name}</p>
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mt-1">{user.role}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 border border-indigo-200 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              {user.name.charAt(0)}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
