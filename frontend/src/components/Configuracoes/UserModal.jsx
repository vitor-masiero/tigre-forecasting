import React from 'react';
import UserForm from './UserForm';

export default function UserModal({ user, onClose, onSuccess }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {user ? 'Editar Usuário' : 'Novo Usuário'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {user 
                ? 'Altere os dados e clique em Atualizar' 
                : 'Preencha os dados para criar um novo usuário'
              }
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <UserForm 
          user={user} 
          onClose={onClose} 
          onSuccess={onSuccess}
        />
      </div>
    </div>
  );
}