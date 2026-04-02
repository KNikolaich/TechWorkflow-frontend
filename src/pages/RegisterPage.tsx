import { useState, FormEvent } from 'react';
import { LogIn, ShieldCheck, Loader2, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import { CreateUserRequest } from '../api/types';
import { DbConnectionIndicator } from '../components/DbConnectionIndicator';

export const RegisterPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<CreateUserRequest>({
    userName: '',
    email: '',
    fullName: '',
    role: 'worker',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await apiClient.post('/api/auth/register', formData);
      navigate('/login');
    } catch (err: any) {
      console.error('Registration full error:', err);
      console.error('Registration response data:', err.response?.data);
      setError(err.response?.data?.message || 'Ошибка регистрации. Проверьте данные и попробуйте еще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-4">
      <div className="mb-8 flex items-center space-x-2">
        <div className="bg-blue-600 p-2 rounded-lg">
          <UserPlus className="text-white" size={24} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#1A1A1A]">ТехПоток</h1>
      </div>
      
      <div className="bg-white p-8 rounded-2xl shadow-xl shadow-blue-500/5 border border-[#E5E5E5] w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-gray-900">Регистрация</h2>
          <p className="text-gray-500 text-sm mt-1">Создайте новый аккаунт</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleRegister}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Имя пользователя</label>
            <input 
              type="text" 
              required
              value={formData.userName}
              onChange={(e) => setFormData({...formData, userName: e.target.value})}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Полное имя</label>
            <input 
              type="text" 
              required
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Роль</label>
            <select 
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
            >
              <option value="worker">Работник</option>
              <option value="manager">Руководитель</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
            <input 
              type="password" 
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold flex items-center justify-center space-x-2 hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 disabled:opacity-70"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <UserPlus size={18} />
            )}
            <span>{isLoading ? 'Регистрация...' : 'Зарегистрироваться'}</span>
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            Уже есть аккаунт? <a href="/login" className="text-blue-600 font-medium hover:underline">Войти</a>
          </p>
        </div>
      </div>
      <DbConnectionIndicator />
    </div>
  );
};
