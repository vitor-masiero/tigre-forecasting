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

  // 🔒 PROTEÇÃO: Verifica se é usuário base
  const isBaseAdmin = user.is_base_admin === true;
  const isProtected = isBaseAdmin && user.role === 'gestao';

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

  // 🔒 Handler para bloqueio de exclusão
  const handleDeleteClick = () => {
    if (isProtected) {
      alert(
        '🔒 OPERAÇÃO BLOQUEADA\n\n' +
        `O usuário gestor base "${user.nome}" não pode ser excluído ou desativado.\n\n` +
        'Este usuário é essencial para a administração do sistema e está permanentemente protegido.'
      );
      return;
    }
    onDelete();
  };

  return (
    <tr className={`hover:bg-gray-50 transition ${!user.ativo ? 'opacity-60' : ''} ${isProtected ? 'bg-amber-50/30' : ''}`}>
      {/* Nome */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className={`w-10 h-10 ${isProtected ? 'bg-gradient-to-br from-amber-500 to-orange-500' : userTypeConfig.color.split(' ')[0].replace('100', '500')} rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 ${isProtected ? 'ring-2 ring-amber-300' : ''}`}>
            {isProtected ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              user.nome ? user.nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U'
            )}
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">{user.nome}</span>
              
              {/* Badge de Usuário Base Protegido */}
              {isProtected && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-900 rounded-full text-xs font-bold border border-amber-300">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  PROTEGIDO
                </span>
              )}
              
              {!user.ativo && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                  Inativo
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500">
              Cadastrado em {formatDate(user.dt_criacao)}
              {isProtected && (
                <span className="ml-2 text-amber-700 font-medium">• Admin Principal</span>
              )}
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
        <span className={`inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${isProtected ? 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-900 border border-amber-300' : userTypeConfig.color}`}>
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
            className={`transition p-1 ${
              isProtected 
                ? 'text-amber-600 hover:text-amber-800' 
                : 'text-blue-600 hover:text-blue-800'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={isProtected ? 'Editar admin principal (nome/email apenas)' : 'Editar usuário'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          {/* Botão Deletar/Desativar - COM PROTEÇÃO */}
          {isProtected ? (
            // Ícone de cadeado para usuário protegido
            <button
              onClick={handleDeleteClick}
              className="text-gray-400 cursor-not-allowed p-1"
              title="Usuário protegido - não pode ser excluído"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </button>
          ) : (
            // Botão normal de delete
            <button
              onClick={handleDeleteClick}
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
          )}
        </div>
      </td>
    </tr>
  );
}