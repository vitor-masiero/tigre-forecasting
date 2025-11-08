import React, { useState } from 'react';
import { useUsers } from '../../hooks/useUsers';

const USER_TYPES = {
  COMERCIAL: {
    id: 'comercial',
    label: 'Comercial',
    description: 'Acesso a previsões e relatórios comerciais',
    color: 'bg-blue-100 text-blue-800'
  },
  ANALISTA: {
    id: 'analista',
    label: 'Analista',
    description: 'Acesso completo a análises e configurações avançadas',
    color: 'bg-purple-100 text-purple-800'
  },
  GESTAO: {
    id: 'gestao',
    label: 'Gestão',
    description: 'Acesso administrativo completo',
    color: 'bg-emerald-100 text-emerald-800'
  }
};

export default function UserForm({ user, onClose, onSuccess }) {
  const { addUser, updateUser } = useUsers();
  
  const [formData, setFormData] = useState({
    nome: user?.nome || '',
    email: user?.email || '',
    tipo: user?.tipo || user?.role || 'comercial', // Trata tanto 'tipo' quanto 'role'
    senha: '',
    ativo: user?.ativo !== undefined ? user.ativo : true
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};
    
    // Nome
    if (!formData.nome || formData.nome.trim().length < 3) {
      newErrors.nome = 'Nome deve ter pelo menos 3 caracteres';
    }
    
    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }
    
    // Senha (apenas para criação)
    if (!user && (!formData.senha || formData.senha.length < 6)) {
      newErrors.senha = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    
    // Limpa erro do campo ao digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setApiError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Valida formulário
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setApiError('');
    setSuccessMessage('');

    try {
      let result;
      
      if (user) {
        // Atualizar usuário existente
        result = await updateUser(user.id_usuario, formData);
      } else {
        // Criar novo usuário
        result = await addUser(formData);
      }

      if (result.success) {
        setSuccessMessage(
          user 
            ? '✅ Usuário atualizado com sucesso!' 
            : '✅ Usuário criado com sucesso!'
        );
        
        // Aguarda 1.5s para mostrar mensagem e fecha
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 1500);
      } else {
        setApiError(result.error || 'Erro ao salvar usuário');
      }
      
    } catch (error) {
      console.error('Erro ao salvar:', error);
      setApiError('Erro inesperado ao salvar usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      {/* Mensagem de SUCESSO */}
      {successMessage && (
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded animate-pulse">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium text-emerald-800">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Mensagem de ERRO da API */}
      {apiError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-800">{apiError}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        {/* Nome */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome Completo *
          </label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className={`w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
              errors.nome ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="João Silva"
            disabled={loading}
          />
          {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome}</p>}
        </div>

        {/* E-mail */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            E-mail *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="email@empresa.com"
            disabled={loading}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Tipo de Usuário */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Tipo de Usuário *
          </label>
          <div className="grid grid-cols-3 gap-3">
            {Object.values(USER_TYPES).map(type => (
              <label
                key={type.id}
                className={`relative flex cursor-pointer rounded-lg border-2 p-4 transition ${
                  formData.tipo === type.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="tipo"
                  value={type.id}
                  checked={formData.tipo === type.id}
                  onChange={handleChange}
                  className="sr-only"
                  disabled={loading}
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-1">{type.label}</div>
                  <p className="text-xs text-gray-600">{type.description}</p>
                </div>
                {formData.tipo === type.id && (
                  <svg className="absolute top-2 right-2 w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Senha (apenas na criação) */}
        {!user && (
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha *
            </label>
            <input
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              className={`w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                errors.senha ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Mínimo 6 caracteres"
              disabled={loading}
            />
            {errors.senha && <p className="text-red-500 text-sm mt-1">{errors.senha}</p>}
          </div>
        )}

        {/* Status Ativo */}
        <div className="col-span-2">
          <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition">
            <input
              type="checkbox"
              name="ativo"
              checked={formData.ativo}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              disabled={loading}
            />
            <div className="flex-1">
              <span className="text-sm font-semibold text-gray-900">Usuário ativo</span>
              <p className="text-xs text-gray-600 mt-1">
                Usuários inativos não podem fazer login no sistema
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Card de Permissões */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Tipo de Usuário: {USER_TYPES[formData.tipo.toUpperCase()]?.label}
        </h3>
        <p className="text-sm text-blue-800">
          {USER_TYPES[formData.tipo.toUpperCase()]?.description}
        </p>
      </div>

      {/* Botões */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-2.5 rounded-lg transition font-medium disabled:opacity-50"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Salvando...
            </>
          ) : (
            user ? 'Atualizar Usuário' : 'Criar Usuário'
          )}
        </button>
      </div>
    </form>
  );
}