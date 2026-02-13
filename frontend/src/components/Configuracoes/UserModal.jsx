import React from 'react';
import UserForm from './UserForm';
import { X, UserPlus, Edit3 } from 'lucide-react';

export default function UserModal({ user, onClose, onSuccess }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Glass Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div 
        className="relative bg-white rounded-[32px] shadow-2xl shadow-slate-950/20 max-w-2xl w-full overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Modern & Integrated */}
        <div className="bg-slate-50/50 border-b border-slate-100 px-8 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-900/20">
              {user ? <Edit3 className="w-6 h-6 text-white" /> : <UserPlus className="w-6 h-6 text-white" />}
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {user ? 'Atualizar Perfil' : 'Novo Colaborador'}
              </h2>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                {user ? `Editando registro ID: ${user.id_usuario}` : 'Cadastro de acesso ao sistema'}
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white hover:shadow-sm rounded-xl transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-8">
          <UserForm 
            user={user} 
            onClose={onClose} 
            onSuccess={onSuccess}
          />
        </div>
      </div>
    </div>
  );
}