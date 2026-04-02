import { useState } from 'react';
import { LayoutDashboard, Users, Settings, LogOut, Search, Bell, Plus, Menu, X, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../store';

export const DashboardPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  
  const { user, logout } = useAuthStore();

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
    <div className="flex h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans overflow-hidden">
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
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm relative z-10 border border-gray-100">
            <div className="flex items-center space-x-3 mb-4 text-orange-500">
              <div className="bg-orange-50 p-2 rounded-full">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Выход из системы</h3>
            </div>
            <p className="text-gray-600 mb-6">Вы уверены, что хотите выйти из своей учетной записи?</p>
            <div className="flex space-x-3">
              <button 
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition"
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
        fixed inset-y-0 left-0 z-50 w-64 border-r border-[#E5E5E5] bg-white flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-[#E5E5E5] flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-blue-600">ТехПлан</h1>
          <button className="lg:hidden p-1" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className="flex items-center space-x-3 p-3 bg-blue-50 text-blue-600 rounded-lg font-medium">
            <LayoutDashboard size={20} />
            <span>Панель управления</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-3 text-gray-600 hover:bg-gray-50 rounded-lg transition">
            <Users size={20} />
            <span>Команда</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-3 text-gray-600 hover:bg-gray-50 rounded-lg transition">
            <Settings size={20} />
            <span>Настройки</span>
          </a>
        </nav>
        <div className="p-4 border-t border-[#E5E5E5]">
          <button 
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex items-center space-x-3 p-3 text-gray-600 hover:text-red-600 transition w-full"
          >
            <LogOut size={20} />
            <span>Выйти</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-[#E5E5E5] bg-white flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <button 
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="relative w-full max-w-md hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Поиск задач..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition text-sm"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4 ml-4">
            <button className="sm:hidden p-2 text-gray-500 hover:bg-gray-50 rounded-full">
              <Search size={20} />
            </button>
            <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
              {userInitials}
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-xl lg:text-2xl font-bold">Обзор проекта</h2>
              <p className="text-gray-500 text-sm">С возвращением, {user?.fullName || user?.userName || 'Пользователь'}.</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2.5 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 transition shadow-sm w-full sm:w-auto">
              <Plus size={18} />
              <span>Новая задача</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl border border-[#E5E5E5] shadow-sm">
              <p className="text-sm text-gray-500 mb-1">Активные задачи</p>
              <h3 className="text-3xl font-bold">12</h3>
            </div>
            <div className="bg-white p-6 rounded-xl border border-[#E5E5E5] shadow-sm">
              <p className="text-sm text-gray-500 mb-1">Завершено сегодня</p>
              <h3 className="text-3xl font-bold text-green-600">8</h3>
            </div>
            <div className="bg-white p-6 rounded-xl border border-[#E5E5E5] shadow-sm sm:col-span-2 lg:col-span-1">
              <p className="text-sm text-gray-500 mb-1">Ожидают проверки</p>
              <h3 className="text-3xl font-bold text-orange-500">4</h3>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-sm overflow-hidden">
            <div className="p-4 lg:p-6 border-b border-[#E5E5E5] flex items-center justify-between">
              <h3 className="font-bold">Последняя активность</h3>
              <button className="text-blue-600 text-sm font-medium hover:underline">Показать все</button>
            </div>
            <div className="divide-y divide-[#E5E5E5]">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 hover:bg-gray-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-4 min-w-0">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${i % 2 === 0 ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">Обновить дизайн-систему лендинга</p>
                      <p className="text-xs text-gray-400">Назначено: Анна Петрова • 2 ч. назад</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-gray-400 self-start sm:self-center">#ЗАДАЧА-10{i}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
