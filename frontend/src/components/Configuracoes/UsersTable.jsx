import React, { useState } from 'react';
import { useUsers } from '../../hooks/useUsers';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import UserModal from './UserModal';
import { UserPlus, Search, Filter, AlertCircle, RefreshCw } from 'lucide-react';

export default function UsersTable() {
  const { users, loading, error, deleteUser, reactivateUser, refreshUsers } = useUsers();
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [showInactive, setShowInactive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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
    refreshUsers(showInactive);
  };

  const handleDeleteUser = async (userId, isActive) => {
    const action = isActive ? 'desativar' : 'reativar';
    if (!window.confirm(`Tem certeza que deseja ${action} este usuário?`)) return;

    setDeletingUserId(userId);
    const result = isActive ? await deleteUser(userId) : await reactivateUser(userId);
    
    if (!result.success) alert(result.error || `Erro ao ${action} usuário`);
    setDeletingUserId(null);
  };

  const filteredUsers = users
    .filter(u => showInactive || u.ativo)
    .filter(u => 
      u.nome?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (loading && users.length === 0) {
    return (
      <div className="p-20 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin" />
        <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">Sincronizando Colaboradores...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-16 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Falha na Comunicação</h3>
        <p className="text-slate-500 max-w-xs mb-8">{error}</p>
        <button 
          onClick={() => refreshUsers(showInactive)}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros e Busca */}
      <div className="flex flex-col sm:flex-row gap-4 px-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
          <input 
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-brand-500/5 focus:border-brand-500 transition-all"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowInactive(!showInactive)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all border ${
              showInactive 
                ? 'bg-brand-50 border-brand-200 text-brand-700' 
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            {showInactive ? 'Ocultar Inativos' : 'Ver Inativos'}
          </button>
          
          <button 
            onClick={handleAddUser}
            className="flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-2xl font-bold text-sm hover:bg-brand-700 transition-all shadow-lg shadow-brand-900/20"
          >
            <UserPlus className="w-4 h-4" />
            Novo Usuário
          </button>
        </div>
      </div>

      {/* Tabela Refatorada */}
      <div className="overflow-x-auto rounded-2xl border border-slate-100 mx-4">
        <table className="w-full border-collapse">
          <TableHeader />
          <tbody className="bg-white">
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
        
        {filteredUsers.length === 0 && (
          <div className="py-20 text-center bg-slate-50/30">
            <p className="text-slate-400 font-bold text-sm italic">Nenhum registro encontrado para os filtros aplicados.</p>
          </div>
        )}
      </div>

      {/* Footer / Resumo */}
      <div className="flex items-center justify-between px-8 py-4 bg-slate-50/50 border-t border-slate-100 rounded-b-[32px]">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Equipe</span>
            <span className="text-lg font-black text-slate-900">{users.length}</span>
          </div>
          <div className="w-[1px] h-8 bg-slate-200" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Ativos</span>
            <span className="text-lg font-black text-emerald-600">{users.filter(u => u.ativo).length}</span>
          </div>
        </div>
        
        <div className="hidden md:flex gap-4">
          <div className="px-3 py-1.5 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-brand-500" />
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">Sincronizado com IAM</span>
          </div>
        </div>
      </div>

      {showModal && (
        <UserModal
          user={editingUser}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}