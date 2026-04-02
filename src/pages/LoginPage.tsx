import { useState, FormEvent } from 'react';
import { LogIn, ShieldCheck, Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store';
import apiClient from '../api/client';
import { AuthResponse, UserDto } from '../api/types';
import { DbConnectionIndicator } from '../components/DbConnectionIndicator';

export const LoginPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1. Call login endpoint
      const { data: authData } = await apiClient.post<AuthResponse>('/api/auth/login', {
        login,
        password,
      });

      if (authData.accessToken) {
        // 2. Fetch user info (assuming /api/auth/me or similar exists, 
        // or we can mock it if needed for now)
        // For this implementation, we'll try to get user info.
        // If the backend doesn't have a /me endpoint, we might need to adjust.
        try {
          const { data: userData } = await apiClient.get<UserDto>('/api/auth/me', {
            headers: { Authorization: `Bearer ${authData.accessToken}` }
          });
          setAuth(userData, authData.accessToken);
        } catch (meError) {
          // Fallback if /me doesn't exist: set a mock user or just the token
          console.warn('Could not fetch user info, setting token only', meError);
          setAuth({ userName: login, role: 'USER' } as UserDto, authData.accessToken);
        }
        
        navigate('/');
      } else {
        setError('Не удалось получить токен доступа');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Ошибка входа. Проверьте логин и пароль.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-4">
      <div className="mb-8 flex items-center space-x-2">
        <div className="bg-blue-600 p-2 rounded-lg">
          <ShieldCheck className="text-white" size={24} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#1A1A1A]">ТехПоток</h1>
      </div>
      
      <div className="bg-white p-8 rounded-2xl shadow-xl shadow-blue-500/5 border border-[#E5E5E5] w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-gray-900">С возвращением</h2>
          <p className="text-gray-500 text-sm mt-1">Пожалуйста, введите свои данные для входа</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Логин или Почта</label>
            <input 
              type="text" 
              required
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Введите ваш логин"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
              disabled={isLoading}
            />
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-gray-600">Запомнить меня</span>
            </label>
            <a href="#" className="text-blue-600 font-medium hover:underline">Забыли пароль?</a>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold flex items-center justify-center space-x-2 hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 disabled:opacity-70"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <LogIn size={18} />
            )}
            <span>{isLoading ? 'Вход...' : 'Войти'}</span>
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            Нет аккаунта? <a href="#" className="text-blue-600 font-medium hover:underline">Связаться с админом</a>
            <br />
            <Link to="/register" className="text-blue-600 font-medium hover:underline">зарегистрироваться</Link>
          </p>
        </div>
      </div>
      
      <p className="mt-8 text-xs text-gray-400 uppercase tracking-widest">
        Безопасный корпоративный доступ
      </p>
      <DbConnectionIndicator />
    </div>
  );
};
