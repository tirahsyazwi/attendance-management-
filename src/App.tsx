import React from 'react';
import { useAuth } from './hooks/useAuth';
import { LoginView } from './views/LoginView';
import { MainView } from './views/MainView';

export default function App() {
  const { token, user, loading, login, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Memuatkan sistem...</p>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    return <LoginView onLogin={login} />;
  }

  return <MainView user={user} onLogout={logout} />;
}
