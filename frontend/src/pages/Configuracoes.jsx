import React from 'react';
import UsersTable from '../components/Configuracoes/UsersTable';
import { Users } from 'lucide-react';

export default function Configuracoes() {
  return (
    <div className="flex-1 bg-slate-50/50 overflow-y-auto">
      <div className="max-w-[1600px] mx-auto px-8 py-10">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight mb-2">
              Gestão da Equipe
            </h1>
            <p className="text-slate-500 font-medium">
              Gerencie colaboradores, níveis de acesso e atividade dos usuários na plataforma
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-[32px] border border-slate-200/60 shadow-soft overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-brand-600 rounded-xl shadow-lg shadow-brand-900/20">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">Colaboradores Ativos</h2>
                  <p className="text-sm text-slate-500 font-medium">Controle de acesso e nível de privilégio</p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <UsersTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
