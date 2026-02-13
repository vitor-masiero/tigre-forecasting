import React from 'react';
import UserTypeIcon from './UserTypeIcon';
import { Edit2, Trash2, Shield, Lock } from 'lucide-react';

const USER_TYPES = {
  comercial: {
    label: 'Comercial',
    color: 'bg-blue-50 text-blue-700 border-blue-100'
  },
  analista: {
    label: 'Analista',
    color: 'bg-purple-50 text-purple-700 border-purple-100'
  },
  gestao: {
    label: 'Gestão',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-100'
  }
};

export default function TableRow({ user, onEdit, onDelete, isDeleting }) {
  const userType = user.tipo || user.role || 'comercial';
  const userTypeConfig = USER_TYPES[userType] || USER_TYPES.comercial;
  const isProtected = user.is_base_admin === true && user.role === 'gestao';

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const formatLastAccess = (dateString) => {
    if (!dateString) return 'Sem registro';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMins = Math.floor((now - date) / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Online agora';
      if (diffMins < 60) return `${diffMins}m atrás`;
      if (diffHours < 24) return `${diffHours}h atrás`;
      return `${diffDays}d atrás`;
    } catch {
      return 'Nunca';
    }
  };

  return (
    <tr className={`group border-b border-slate-50 transition-colors hover:bg-slate-50/50 ${!user.ativo ? 'opacity-50' : ''}`}>
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shadow-sm transition-transform group-hover:scale-105 ${
            isProtected 
              ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white' 
              : 'bg-white border border-slate-200 text-slate-600'
          }`}>
            {isProtected ? <Shield className="w-5 h-5" /> : getInitials(user.nome)}
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">{user.nome}</span>
              {isProtected && (
                <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-black uppercase rounded-md tracking-tighter">System</span>
              )}
            </div>
            <span className="text-[11px] font-medium text-slate-400">ID: {user.id_usuario}</span>
          </div>
        </div>
      </td>

      <td className="px-6 py-4">
        <span className="text-sm font-semibold text-slate-600">{user.email}</span>
      </td>

      <td className="px-6 py-4">
        <span className="text-xs font-bold text-slate-400 font-mono">{user.cpf || '---'}</span>
      </td>

      <td className="px-6 py-4">
        <span className="text-sm font-bold text-slate-700">{user.cargo || 'Não definido'}</span>
      </td>

      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${userTypeConfig.color}`}>
          <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
          {userTypeConfig.label}
        </span>
      </td>

      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-700">{formatLastAccess(user.dt_ultimo_acesso)}</span>
          {user.ativo ? (
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">Ativo</span>
          ) : (
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Inativo</span>
          )}
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-2 text-slate-400 hover:text-brand-600 hover:bg-white hover:shadow-sm rounded-lg transition-all"
            title="Editar Colaborador"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          {isProtected ? (
            <div className="p-2 text-slate-300" title="Registro Protegido">
              <Lock className="w-4 h-4" />
            </div>
          ) : (
            <button
              onClick={onDelete}
              disabled={isDeleting}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-white hover:shadow-sm rounded-lg transition-all"
              title={user.ativo ? "Desativar" : "Reativar"}
            >
              {isDeleting ? (
                <div className="w-4 h-4 border-2 border-slate-300 border-t-red-500 rounded-full animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
