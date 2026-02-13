import React from 'react';

export default function PageHeader() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">Configurações</h1>
          <p className="text-blue-100">Gerencie usuários e permissões do sistema</p>
        </div>
      </div>
    </div>
  );
}

