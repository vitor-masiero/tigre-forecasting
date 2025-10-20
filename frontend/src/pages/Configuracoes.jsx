import React from 'react';
import PageHeader from '../components/Configuracoes/PageHeader';
import UsersTable from '../components/Configuracoes/UsersTable';

export default function Configuracoes() {
  return (
    <div className="flex-1 overflow-y-auto">
      <PageHeader />
      <div className="px-8 -mt-6 pb-8">
        <UsersTable />
      </div>
      <div></div>
    </div>
  );
}
