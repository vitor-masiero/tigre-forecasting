import React, { useState } from 'react';
import { useUsers } from '../../hooks/useUsers';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import UserModal from './UserModal';

export default function UsersTable() {
  const { users, loading, error, deleteUser, reactivateUser, refreshUsers } = useUsers();
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [showInactive, setShowInactive] = useState(false);

  const handleAddUser = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const handleSuccess = () => {
    // Atualiza lista após criar/editar
    refreshUsers(showInactive);
  };

  const handleDeleteUser = async (userId, isActive) => {
    if (isActive) {
      // Desativar
      if (!window.confirm('Tem certeza que deseja desativar este usuário? Ele não poderá mais fazer login.')) {
        return;
      }

      setDeletingUserId(userId);
      const result = await deleteUser(userId);
      
      if (result.success) {
        console.log('✅ Usuário desativado com sucesso');
      } else {
        alert(result.error || 'Erro ao desativar usuário');
      }
      
      setDeletingUserId(null);
    } else {
      // Reativar
      if (!window.confirm('Deseja reativar este usuário? Ele poderá fazer login novamente.')) {
        return;
      }

      setDeletingUserId(userId);
      const result = await reactivateUser(userId);
      
      if (result.success) {
        console.log('✅ Usuário reativado com sucesso');
      } else {
        alert(result.error || 'Erro ao reativar usuário');
      }
      
      setDeletingUserId(null);
    }
  };

  const handleToggleInactive = async () => {
    setShowInactive(!showInactive);
    await refreshUsers(!showInactive);
  };

  // Filtra usuários baseado no toggle
  const filteredUsers = showInactive 
    ? users 
    : users.filter(u => u.ativo);

  // Estado de loading
  if (loading && users.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Equipe</h2>
          <p className="text-sm text-gray-500 mt-1">Gerenciamento de usuários e permissões</p>
        </div>
        
        <div className="p-12 text-center">
          <div className="flex items-center justify-center mb-4">
            <svg className="animate-spin h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-gray-600">Carregando usuários...</p>
        </div>
      </div>
    );
  }

  // Estado de erro
  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Equipe</h2>
          <p className="text-sm text-gray-500 mt-1">Gerenciamento de usuários e permissões</p>
        </div>
        
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-red-600 font-medium mb-2">Erro ao carregar usuários</p>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <button 
            onClick={() => refreshUsers(showInactive)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header da Tabela */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Equipe</h2>
              <p className="text-sm text-gray-500 mt-1">
                Gerenciamento de usuários e permissões • {filteredUsers.length} usuário{filteredUsers.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex gap-3">
              {/* Toggle Inativos */}
              <label className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition">
                <input
                  type="checkbox"
                  checked={showInactive}
                  onChange={handleToggleInactive}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Mostrar inativos
                </span>
              </label>

              {/* Botão Novo Usuário */}
              <button
                onClick={handleAddUser}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Novo Usuário
              </button>
            </div>
          </div>
        </div>

        {/* Tabela */}
        {filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <TableHeader />
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <TableRow
                    key={user.id_usuario}
                    user={user}
                    onEdit={() => handleEditUser(user)}
                    onDelete={() => handleDeleteUser(user.id_usuario, user.ativo)}
                    isDeleting={deletingUserId === user.id_usuario}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // Sem usuários
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <p className="text-gray-600 font-medium mb-2">
              {showInactive ? 'Nenhum usuário inativo' : 'Nenhum usuário cadastrado'}
            </p>
            <p className="text-gray-500 text-sm mb-4">
              {showInactive 
                ? 'Todos os usuários estão ativos' 
                : 'Comece adicionando o primeiro usuário'
              }
            </p>
            {!showInactive && (
              <button
                onClick={handleAddUser}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Adicionar Primeiro Usuário
              </button>
            )}
          </div>
        )}

        {/* Estatísticas no Footer */}
        {filteredUsers.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <div className="flex gap-6">
                <div>
                  <span className="text-gray-500">Total: </span>
                  <span className="font-semibold text-gray-900">{users.length}</span>
                </div>
                <div>
                  <span className="text-gray-500">Ativos: </span>
                  <span className="font-semibold text-emerald-600">
                    {users.filter(u => u.ativo).length}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Inativos: </span>
                  <span className="font-semibold text-gray-600">
                    {users.filter(u => !u.ativo).length}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-gray-600">Gestão: {users.filter(u => u.tipo === 'gestao' || u.role === 'gestao').length}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-600">Analista: {users.filter(u => u.tipo === 'analista' || u.role === 'analista').length}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">Comercial: {users.filter(u => u.tipo === 'comercial' || u.role === 'comercial').length}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Adicionar/Editar */}
      {showModal && (
        <UserModal
          user={editingUser}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}