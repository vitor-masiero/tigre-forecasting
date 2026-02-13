import React from "react";
import FontesMetricsCards from "../components/FontesDados/FontesMetricsCards";
import ConfiguredSourcesTable from "../components/FontesDados/ConfiguredSourcesTable";
import SourceTypesCard from "../components/FontesDados/SourceTypesCard";
import MonitoringCard from "../components/FontesDados/MonitoringCard";
import { Database, Plus, RefreshCw } from 'lucide-react';

export default function FontesDados() {
  return (
    <div className="flex-1 bg-slate-50/50 overflow-y-auto">
      <div className="max-w-[1600px] mx-auto px-8 py-10">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight mb-2 flex items-center gap-3">
              Fontes de Dados
            </h1>
            <p className="text-slate-500 font-medium">
              Conecte e gerencie os ativos de dados para seus modelos
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
              <RefreshCw className="w-4 h-4" />
              Sincronizar
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-900/20">
              <Plus className="w-4 h-4" />
              Nova Conexão
            </button>
          </div>
        </div>

        <div className="space-y-10">
          <FontesMetricsCards />
          
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <div className="w-1.5 h-6 bg-brand-600 rounded-full" />
              Conexões Configuradas
            </h2>
            <ConfiguredSourcesTable />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <div className="w-1.5 h-6 bg-purple-500 rounded-full" />
                Tipos Disponíveis
              </h2>
              <SourceTypesCard />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                Saúde das Conexões
              </h2>
              <MonitoringCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
