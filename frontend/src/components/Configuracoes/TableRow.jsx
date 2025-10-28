import React from 'react';
import { useUsers } from '../../hooks/useUsers';
import UserTypeIcon from './UserTypeIcon';
import { USER_TYPES } from '../../utils/userTypes';

export default function TableRow({ user, onEdit }) {
  const { deleteUser } = useUsers();
  const userType = USER_TYPES[user.tipo.toUpperCase()];

  return (
    <tr className="hover:bg-gray-50 transition">
      {/* Nome */}
      <td className="px-6 py-4">
        <span className="text-sm font-medium text-gray-900">{user.nome}</span>
      </td>

      {/* E-mail */}
      <td className="px-6 py-4">
        <span className="text-sm text-gray-600">{user.email}</span>
      </td>

      {/* CPF */}
      <td className="px-6 py-4">
        <span className="text-sm text-gray-600">{user.cpf}</span>
      </td>

      {/* Cargo */}
      <td className="px-6 py-4">
        <span className="text-sm text-gray-900">{user.cargo}</span>
      </td>

      {/* Tipo */}
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${userType.color}`}>
          <UserTypeIcon tipo={user.tipo} />
          {userType.label}
        </span>
      </td>

      {/* Ações */}
      <td className="px-6 py-4 flex gap-2">
        <button
          onClick={onEdit}
          className="text-blue-600 hover:text-blue-800 transition p-1"
          title="Editar usuário"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={() => deleteUser(user.id)}
          className="text-red-600 hover:text-red-800 transition p-1"
          title="Deletar usuário"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </td>
    </tr>
  );
}
