import { useState } from 'react';
import { useAuthStore, useThemeStore } from '../store';
import { Pencil, Save, X, User, Settings as SettingsIcon } from 'lucide-react';
import apiClient from '../api/client';

export const SettingsPage = () => {
  const { user, setAuth } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data } = await apiClient.put(`/api/admin/users/${user.id}`, formData);
      setAuth(data, null); // Assuming accessToken doesn't change
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-2 sm:p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-text-primary">
        <SettingsIcon /> Настройки
      </h1>

      <div className="space-y-8">
        {/* Login Category */}
        <section className="bg-bg-secondary p-2 sm:p-6 rounded-2xl border border-gray-200/20 shadow-sm transition-colors duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-text-primary">
              <User /> Логин
            </h2>
            {user?.isActive && (
              <button onClick={() => setIsEditing(!isEditing)} className="p-2 hover:bg-bg-primary rounded-full transition">
                {isEditing ? <X size={20} className="text-text-primary" /> : <Pencil size={20} className="text-text-primary" />}
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary">Полное имя</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-bg-primary text-text-primary disabled:opacity-70 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-bg-primary text-text-primary disabled:opacity-70 transition"
              />
            </div>
            {isEditing && (
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="bg-accent text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition"
              >
                <Save size={18} /> {isLoading ? 'Сохранение...' : 'Сохранить'}
              </button>
            )}
          </div>
        </section>

        {/* General Category */}
        <section className="bg-bg-secondary p-2 sm:p-6 rounded-2xl border border-gray-200/20 shadow-sm transition-colors duration-300">
          <h2 className="text-lg font-bold mb-4 text-text-primary">Общие</h2>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Тема оформления</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg capitalize bg-bg-primary text-text-primary transition"
            >
              <option value="light">Светлая</option>
              <option value="dark">Тёмная</option>
              <option value="warm">Тёплая</option>
              <option value="cold">Холодная</option>
              <option value="green">Салатовая</option>
            </select>
          </div>
        </section>
      </div>
    </div>
  );
};
