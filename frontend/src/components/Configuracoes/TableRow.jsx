import React from 'react';
import UserTypeIcon from './UserTypeIcon';

const USER_TYPES = {
  comercial: {
    label: 'Comercial',
    color: 'bg-blue-100 text-blue-800'
  },
  analista: {
    label: 'Analista',
    color: 'bg-purple-100 text-purple-800'
  },
  gestao: {
    label: 'Gestão',
    color: 'bg-emerald-100 text-emerald-800'
  }
};

export default function TableRow({ user, onEdit, onDelete, isDeleting }) {
  // Normaliza o tipo/role (pode vir como 'tipo' ou 'role' da API)
  const userType = user.tipo || user.role || 'comercial';
  const userTypeConfig = USER_TYPES[userType] || USER_TYPES.comercial;

  // Formata data de criação
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return '-';
    }
  };

  // Formata último acesso
  const formatLastAccess = (dateString) => {
    if (!dateString) return 'Nunca';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Agora';
      if (diffMins < 60) return `${diffMins}min atrás`;
      if (diffHours < 24) return `${diffHours}h atrás`;
      if (diffDays < 7) return `${diffDays}d atrás`;
      
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'Nunca';
    }
  };

  return (
    <tr className={`hover:bg-gray-50 transition ${!user.ativo ? 'opacity-60' : ''}`}>
      {/* Nome */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className={`w-10 h-10 ${userTypeConfig.color.split(' ')[0].replace('100', '500')} rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}>
            {user.nome ? user.nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U'}
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">{user.nome}</span>
              {!user.ativo && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                  Inativo
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500">
              Cadastrado em {formatDate(user.dt_criacao)}
            </div>
          </div>
        </div>
      </td>

      {/* E-mail */}
      <td className="px-6 py-4">
        <span className="text-sm text-gray-900">{user.email}</span>
      </td>

      {/* CPF (campo local, pode não existir) */}
      <td className="px-6 py-4">
        <span className="text-sm text-gray-600">{user.cpf || '-'}</span>
      </td>

      {/* Cargo (campo local, pode não existir) */}
      <td className="px-6 py-4">
        <span className="text-sm text-gray-900">{user.cargo || '-'}</span>
      </td>

      {/* Tipo */}
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${userTypeConfig.color}`}>
          <UserTypeIcon tipo={userType} />
          {userTypeConfig.label}
        </span>
      </td>

      {/* Último Acesso */}
      <td className="px-6 py-4">
        <div className="text-sm text-gray-600">
          {formatLastAccess(user.dt_ultimo_acesso)}
        </div>
      </td>

      {/* Ações */}
      <td className="px-6 py-4">
        <div className="flex gap-2">
          {/* Botão Editar */}
          <button
            onClick={onEdit}
            disabled={isDeleting}
            className="text-blue-600 hover:text-blue-800 transition p-1 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Editar usuário"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          {/* Botão Deletar */}
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-800 transition p-1 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Desativar usuário"
          >
            {isDeleting ? (
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </button>
        </div>
      </td>
    </tr>
  );
}