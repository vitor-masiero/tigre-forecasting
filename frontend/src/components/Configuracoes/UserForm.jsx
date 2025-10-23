import React, { useState } from 'react';
import { useUsers } from '../../hooks/useUsers';

export default function UserForm({ user, onClose }) {
  const { addUser, updateUser } = useUsers();
  const [formData, setFormData] = useState(user || {
    nome: '',
    email: '',
    cpf: '',
    cargo: '',
    tipo: 'comercial',
    contato: '',
    senha: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nome) newErrors.nome = 'Nome é obrigatório';
    if (!formData.email) newErrors.email = 'E-mail é obrigatório';
    if (!formData.cpf) newErrors.cpf = 'CPF é obrigatório';
    if (!formData.cargo) newErrors.cargo = 'Cargo é obrigatório';
    if (!user && !formData.senha) newErrors.senha = 'Senha é obrigatória';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (user) {
      updateUser(user.id, formData);
    } else {
      addUser(formData);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome *
          </label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className={`w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
              errors.nome ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Nome completo"
          />
          {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome}</p>}
        </div>

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
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CPF *
          </label>
          <input
            type="text"
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
            className={`w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
              errors.cpf ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="123.456.789-00"
          />
          {errors.cpf && <p className="text-red-500 text-sm mt-1">{errors.cpf}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contato
          </label>
          <input
            type="tel"
            name="contato"
            value={formData.contato}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="(11) 98765-4321"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cargo *
          </label>
          <select
            name="cargo"
            value={formData.cargo}
            onChange={handleChange}
            className={`w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
              errors.cargo ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Selecione um cargo</option>
            {USER_CARGOS.map(cargo => (
              <option key={cargo} value={cargo}>{cargo}</option>
            ))}
          </select>
          {errors.cargo && <p className="text-red-500 text-sm mt-1">{errors.cargo}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Usuário *
          </label>
          <select
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          >
            {Object.values(USER_TYPES).map(type => (
              <option key={type.id} value={type.id}>{type.label}</option>
            ))}
          </select>
        </div>

        {!user && (
          <div>
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
              placeholder="••••••••"
            />
            {errors.senha && <p className="text-red-500 text-sm mt-1">{errors.senha}</p>}
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Tipo de Usuário: {USER_TYPES[formData.tipo.toUpperCase()].label}</h3>
        <p className="text-sm text-blue-800">{USER_TYPES[formData.tipo.toUpperCase()].description}</p>
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-2.5 rounded-lg transition font-medium"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition font-medium"
        >
          {user ? 'Atualizar' : 'Criar'} Usuário
        </button>
      </div>
    </form>
  );
}
