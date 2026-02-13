import React, { useState } from 'react';
import { useUsers } from '../../hooks/useUsers';
import { User, Mail, Shield, CheckCircle2, AlertCircle, RefreshCw, Key } from 'lucide-react';

const USER_TYPES = {
  COMERCIAL: {
    id: 'comercial',
    label: 'Comercial',
    description: 'Acesso a previsões e relatórios comerciais',
    color: 'border-blue-100 bg-blue-50 text-blue-700'
  },
  ANALISTA: {
    id: 'analista',
    label: 'Analista',
    description: 'Análises avançadas e parametrizações',
    color: 'border-purple-100 bg-purple-50 text-purple-700'
  },
  GESTAO: {
    id: 'gestao',
    label: 'Gestão',
    description: 'Acesso administrativo completo',
    color: 'border-emerald-100 bg-emerald-50 text-emerald-700'
  }
};

export default function UserForm({ user, onClose, onSuccess }) {
  const { addUser, updateUser } = useUsers();
  
  const [formData, setFormData] = useState({
    nome: user?.nome || '',
    email: user?.email || '',
    tipo: user?.tipo || user?.role || 'comercial',
    senha: '',
    ativo: user?.ativo !== undefined ? user.ativo : true
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nome || formData.nome.trim().length < 3) newErrors.nome = 'Nome muito curto';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) newErrors.email = 'E-mail inválido';
    if (!user && (!formData.senha || formData.senha.length < 6)) newErrors.senha = 'Mínimo 6 caracteres';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const result = user ? await updateUser(user.id_usuario, formData) : await addUser(formData);
      if (result.success) {
        setSuccessMessage('Operação realizada com sucesso!');
        setTimeout(() => { onSuccess?.(); onClose(); }, 1000);
      } else {
        setApiError(result.error || 'Erro ao salvar');
      }
    } catch (error) {
      setApiError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-500">
      {apiError && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-sm text-red-800 font-bold">{apiError}</p>
        </div>
      )}

      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <p className="text-sm text-emerald-800 font-bold">{successMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] ml-1">Nome Completo</label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
            <input
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className={`w-full bg-slate-50 border ${errors.nome ? 'border-red-300' : 'border-slate-200'} rounded-2xl py-3.5 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-brand-500/5 focus:border-brand-500 transition-all`}
              placeholder="Ex: Pedro Alvares"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] ml-1">E-mail Corporativo</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full bg-slate-50 border ${errors.email ? 'border-red-300' : 'border-slate-200'} rounded-2xl py-3.5 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-brand-500/5 focus:border-brand-500 transition-all`}
              placeholder="usuario@tigre.com"
            />
          </div>
        </div>

        {!user && (
          <div className="sm:col-span-2 space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] ml-1">Senha Provisória</label>
            <div className="relative group">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
              <input
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                className={`w-full bg-slate-50 border ${errors.senha ? 'border-red-300' : 'border-slate-200'} rounded-2xl py-3.5 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-brand-500/5 focus:border-brand-500 transition-all`}
                placeholder="Mínimo 6 caracteres"
              />
            </div>
          </div>
        )}

        <div className="sm:col-span-2 space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] ml-1">Nível de Acesso</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.values(USER_TYPES).map(type => (
              <label 
                key={type.id}
                className={`relative cursor-pointer border-2 rounded-[20px] p-4 transition-all duration-300 ${
                  formData.tipo === type.id 
                    ? 'border-brand-600 bg-brand-50/50 shadow-sm' 
                    : 'border-slate-100 hover:border-brand-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="tipo"
                  value={type.id}
                  checked={formData.tipo === type.id}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-black uppercase tracking-wider ${formData.tipo === type.id ? 'text-brand-700' : 'text-slate-900'}`}>
                      {type.label}
                    </span>
                    {formData.tipo === type.id && <CheckCircle2 className="w-4 h-4 text-brand-600" />}
                  </div>
                  <p className="text-[10px] font-medium text-slate-500 leading-relaxed">
                    {type.description}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="flex items-center gap-3 cursor-pointer group bg-slate-50/50 p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors">
            <div className="relative">
              <input
                type="checkbox"
                name="ativo"
                checked={formData.ativo}
                onChange={handleChange}
                className="sr-only"
              />
              <div className={`w-10 h-6 rounded-full transition-colors ${formData.ativo ? 'bg-emerald-500' : 'bg-slate-200'}`} />
              <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.ativo ? 'translate-x-4' : ''}`} />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900">Conta Ativa</span>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">Permitir acesso aos módulos da plataforma</p>
            </div>
          </label>
        </div>
      </div>

      <div className="flex gap-4 pt-6 border-t border-slate-100">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-all"
        >
          Descartar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 py-4 rounded-2xl shadow-lg shadow-brand-900/20 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Confirmar Registro'}
        </button>
      </div>
    </form>
  );
}
