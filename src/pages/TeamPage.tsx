import { useState, useEffect } from 'react';
import { Users, Loader2, Plus, X, Save } from 'lucide-react';
import apiClient from '../api/client';
import { UserDto, CreateUserRequest } from '../api/types';
import { useAuthStore } from '../store';

const SUPERVISOR_ROLE = 'Supervisor';
const WORKER_ROLE = 'Worker';
const ADMIN_ROLE = 'Admin';

const InputField = ({ name, placeholder, type = 'text', value, onChange, error, disabled, onPasswordToggle, isPasswordEditable }: any) => (
  <div className="relative">
    <div className="relative flex items-center">
      <input
        type={type === 'password' && isPasswordEditable ? 'text' : type}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border rounded-lg bg-bg-primary text-text-primary ${error ? 'border-red-500' : 'border-gray-300'} ${disabled && !isPasswordEditable ? 'opacity-50' : ''}`}
        value={value}
        onChange={onChange}
        disabled={disabled && !isPasswordEditable}
      />
      {type === 'password' && onPasswordToggle && (
        <button 
          type="button" 
          onClick={onPasswordToggle}
          className="absolute right-2 text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
        >
          {isPasswordEditable ? 'Отмена' : 'Новый пароль'}
        </button>
      )}
      {error && (
        <div className="absolute right-20">
          <AlertTriangle size={20} className="text-red-500" />
        </div>
      )}
    </div>
    {error && (
      <div className="mt-1 p-2 bg-red-100 text-red-800 text-xs rounded shadow-lg">
        {error}
      </div>
    )}
  </div>
);

const STATUS_MAP: Record<string, string> = {
  'Working': 'Работает',
  'OnVacation': 'В отпуске',
  'Dismissed': 'Уволен',
};

export const TeamPage = () => {
  const { user } = useAuthStore();
  const [workers, setWorkers] = useState<UserDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalRole, setModalRole] = useState<string>('');
  const [formData, setFormData] = useState<CreateUserRequest & { status?: string }>({
    userName: '',
    email: '',
    fullName: '',
    password: '',
    status: 'Working',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchWorkers = async () => {
    try {
      const { data } = await apiClient.get<UserDto[]>('/api/workers');
      const sortedWorkers = [...data].sort((a, b) => {
        const fullNameA = a.fullName || '';
        const fullNameB = b.fullName || '';
        if (fullNameA !== fullNameB) return fullNameA.localeCompare(fullNameB);
        return (a.userName || '').localeCompare(b.userName || '');
      });
      setWorkers(sortedWorkers);
    } catch (err) {
      setError('Не удалось загрузить список работников.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isPasswordEditable, setIsPasswordEditable] = useState(false);

  const openEditModal = (worker: UserDto) => {
    setEditingUserId(worker.id || null);
    setModalRole(worker.role || '');
    setFormData({
      userName: worker.userName || '',
      email: worker.email || '',
      fullName: worker.fullName || '',
      password: '',
    });
    setErrors({});
    setIsEditMode(true);
    setIsPasswordEditable(false);
    setIsModalOpen(true);
  };

  const handleSaveUser = async () => {
    setErrors({});
    try {
      const isActive = formData.status !== 'Dismissed';
      if (isEditMode && editingUserId) {
        await apiClient.put(`/api/admin/users/${editingUserId}`, {
          email: formData.email,
          fullName: formData.fullName,
          isActive: isActive,
        });
        await apiClient.patch(`/api/workers/${editingUserId}/status`, {
          status: formData.status,
        });
      } else {
        await apiClient.post('/api/admin/users', { ...formData, role: modalRole });
      }
      setIsModalOpen(false);
      setFormData({ userName: '', email: '', fullName: '', password: '', status: 'Working' });
      fetchWorkers();
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else if (err.response?.data?.title) {
        setErrors({ general: err.response.data.title });
      } else {
        setErrors({ general: 'Произошла ошибка при сохранении пользователя.' });
      }
    }
  };

  const supervisors = workers.filter(w => w.role === SUPERVISOR_ROLE);
  const regularWorkers = workers.filter(w => w.role === WORKER_ROLE);

  const isAdmin = user?.role === ADMIN_ROLE;
  const isSupervisor = user?.role === SUPERVISOR_ROLE || isAdmin;

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-accent" /></div>;
  if (error) return <div className="p-8 text-red-500 text-center">{error}</div>;

  const renderTable = (data: UserDto[], title: string, showAddButton: boolean, roleToAssign: string, allowEdit: boolean) => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-text-primary">{title}</h2>
        {showAddButton && (
          <button 
            onClick={() => { setModalRole(roleToAssign); setIsModalOpen(true); }}
            className="p-2 bg-accent text-white rounded-lg hover:opacity-90 transition"
          >
            <Plus size={20} />
          </button>
        )}
      </div>
      <div className="bg-bg-secondary rounded-2xl border border-gray-200/20 shadow-sm overflow-hidden transition-colors duration-300">
        <table className="w-full text-left">
          <thead className="bg-bg-primary text-text-primary border-b border-gray-200/20">
            <tr>
              <th className="p-4 font-medium">Имя</th>
              <th className="p-4 font-medium">Логин</th>
              <th className="p-4 font-medium">Статус</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/20">
            {data.map((worker) => (
              <tr 
                key={worker.id} 
                className={`transition ${allowEdit ? 'hover:bg-bg-primary cursor-pointer' : ''}`} 
                onClick={() => allowEdit && openEditModal(worker)}
              >
                <td className="p-4 text-text-primary">{worker.fullName}</td>
                <td className="p-4 text-gray-500 dark:text-gray-400">{worker.userName}</td>
                <td className="p-4 text-text-primary">{STATUS_MAP[worker.status || ''] || worker.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-2 sm:p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-text-primary">
        <Users /> Команда
      </h1>

      {renderTable(supervisors, 'Руководитель отдела', isAdmin, SUPERVISOR_ROLE, isAdmin)}
      {renderTable(regularWorkers, 'Работники', isSupervisor, WORKER_ROLE, isSupervisor)}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-bg-secondary p-4 sm:p-6 rounded-2xl border border-gray-200/20 shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-text-primary">
                {isEditMode ? 'Изменить' : 'Добавить пользователя'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-text-primary" /></button>
            </div>
            <div className="space-y-4">
              <InputField name="userName" placeholder="Имя пользователя" value={formData.userName} onChange={(e: any) => setFormData({...formData, userName: e.target.value})} error={errors.userName} disabled={isEditMode} />
              <InputField name="email" placeholder="Email" type="email" value={formData.email} onChange={(e: any) => setFormData({...formData, email: e.target.value})} error={errors.email} />
              <InputField name="fullName" placeholder="Полное имя" value={formData.fullName} onChange={(e: any) => setFormData({...formData, fullName: e.target.value})} error={errors.fullName} />
              <div className="space-y-1">
                <label className="text-sm text-text-primary">Статус</label>
                <select 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-bg-primary text-text-primary"
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                >
                  {Object.entries(STATUS_MAP).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <InputField name="password" placeholder="Пароль" type="password" value={formData.password} onChange={(e: any) => setFormData({...formData, password: e.target.value})} error={errors.password} disabled={isEditMode} onPasswordToggle={() => setIsPasswordEditable(!isPasswordEditable)} isPasswordEditable={isPasswordEditable} />
              {errors.general && <p className="text-red-500 text-sm">{errors.general}</p>}
              <button onClick={handleSaveUser} className="w-full bg-accent text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition">
                <Save size={18} /> Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
