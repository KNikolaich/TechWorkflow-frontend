import { useState } from 'react';
import { LayoutDashboard, Users, Settings, LogOut, Search, Bell, Plus, Menu, X, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../store';
import { Outlet, useNavigate } from 'react-router-dom';

export const DashboardLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const userInitials = user?.fullName ? getInitials(user.fullName) : (user?.userName?.slice(0, 2).toUpperCase() || '??');

  return (
    <div className="flex h-screen bg-bg-primary text-text-primary font-sans overflow-hidden transition-colors duration-300">
      {/* Sidebar Overlay for Mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsLogoutModalOpen(false)} />
          <div className="bg-bg-secondary rounded-2xl shadow-2xl p-6 w-full max-w-sm relative z-10 border border-gray-200/20">
            <div className="flex items-center space-x-3 mb-4 text-orange-500">
              <div className="bg-orange-50 p-2 rounded-full">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-bold text-text-primary">Выход из системы</h3>
            </div>
            <p className="text-gray-500 mb-6">Вы уверены, что хотите выйти из своей учетной записи?</p>
            <div className="flex space-x-3">
              <button 
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200/20 text-gray-500 rounded-xl font-medium hover:bg-bg-primary transition"
              >
                Отмена
              </button>
              <button 
                onClick={() => logout()}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition shadow-lg shadow-red-500/20"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 border-r border-gray-200/20 bg-bg-secondary flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-gray-200/20 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-accent">ТехПлан</h1>
          <button className="lg:hidden p-1" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => navigate('/')} className="flex items-center space-x-3 p-3 text-text-primary hover:bg-bg-primary rounded-lg font-medium w-full transition">
            <LayoutDashboard size={20} />
            <span>Панель управления</span>
          </button>
          <button onClick={() => navigate('/team')} className="flex items-center space-x-3 p-3 text-text-primary hover:bg-bg-primary rounded-lg transition w-full">
            <Users size={20} />
            <span>Команда</span>
          </button>
          <button onClick={() => navigate('/settings')} className="flex items-center space-x-3 p-3 text-text-primary hover:bg-bg-primary rounded-lg transition w-full">
            <Settings size={20} />
            <span>Настройки</span>
          </button>
        </nav>
        <div className="p-4 border-t border-gray-200/20">
          <button 
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex items-center space-x-3 p-3 text-text-primary hover:text-red-500 transition w-full"
          >
            <LogOut size={20} />
            <span>Выйти</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-gray-200/20 bg-bg-secondary flex items-center justify-between px-4 lg:px-8 shrink-0 transition-colors duration-300">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <button 
              className="lg:hidden p-2 text-text-primary hover:bg-bg-primary rounded-lg"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="relative w-full max-w-md hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Поиск задач..." 
                className="w-full pl-10 pr-4 py-2 bg-bg-primary border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 transition text-sm"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4 ml-4">
            <button className="sm:hidden p-2 text-text-primary hover:bg-bg-primary rounded-full">
              <Search size={20} />
            </button>
            <button className="p-2 text-text-primary hover:bg-bg-primary rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button 
              onClick={() => navigate('/settings')}
              className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 hover:opacity-90 transition"
            >
              {userInitials}
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
