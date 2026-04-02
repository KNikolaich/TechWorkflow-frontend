import { useState } from 'react';
import { Plus, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../store';

export const DashboardPage = () => {
  const { user } = useAuthStore();

  const userInitials = user?.fullName ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : (user?.userName?.slice(0, 2).toUpperCase() || '??');

  return (
    <div className="p-4 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-text-primary">Обзор проекта</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">С возвращением, {user?.fullName || user?.userName || 'Пользователь'}.</p>
        </div>
        <button className="bg-accent text-white px-4 py-2.5 rounded-lg flex items-center justify-center space-x-2 hover:opacity-90 transition shadow-sm w-full sm:w-auto">
          <Plus size={18} />
          <span>Новая задача</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
        <div className="bg-bg-secondary p-6 rounded-xl border border-gray-200/20 shadow-sm transition-colors duration-300">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Активные задачи</p>
          <h3 className="text-3xl font-bold text-text-primary">12</h3>
        </div>
        <div className="bg-bg-secondary p-6 rounded-xl border border-gray-200/20 shadow-sm transition-colors duration-300">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Завершено сегодня</p>
          <h3 className="text-3xl font-bold text-green-600">8</h3>
        </div>
        <div className="bg-bg-secondary p-6 rounded-xl border border-gray-200/20 shadow-sm sm:col-span-2 lg:col-span-1 transition-colors duration-300">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Ожидают проверки</p>
          <h3 className="text-3xl font-bold text-orange-500">4</h3>
        </div>
      </div>

      <div className="bg-bg-secondary rounded-xl border border-gray-200/20 shadow-sm overflow-hidden transition-colors duration-300">
        <div className="p-4 lg:p-6 border-b border-gray-200/20 flex items-center justify-between">
          <h3 className="font-bold text-text-primary">Последняя активность</h3>
          <button className="text-accent text-sm font-medium hover:underline">Показать все</button>
        </div>
        <div className="divide-y divide-gray-200/20">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 hover:bg-bg-primary transition flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-4 min-w-0">
                <div className={`w-2 h-2 rounded-full shrink-0 ${i % 2 === 0 ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                <div className="min-w-0">
                  <p className="font-medium text-sm text-text-primary truncate">Обновить дизайн-систему лендинга</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Назначено: Анна Петрова • 2 ч. назад</p>
                </div>
              </div>
              <span className="text-xs font-mono text-gray-500 dark:text-gray-400 self-start sm:self-center">#ЗАДАЧА-10{i}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
