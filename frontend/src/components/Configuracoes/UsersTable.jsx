import React, { useState } from 'react';
import { useUsers } from '../../hooks/useUsers';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import UserModal from './UserModal';

export default function UsersTable() {
  const { users } = useUsers();
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

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

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Equipe</h2>
            <p className="text-sm text-gray-500 mt-1">Gerenciamento de usuários e permissões</p>
          </div>
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

        <div className="overflow-x-auto">
          <table className="w-full">
            <TableHeader />
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  user={user}
                  onEdit={() => handleEditUser(user)}
                />
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-gray-500">Nenhum usuário cadastrado</p>
          </div>
        )}
      </div>

      {showModal && (
        <UserModal
          user={editingUser}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}