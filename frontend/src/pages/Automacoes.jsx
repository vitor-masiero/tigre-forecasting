import React from "react";
import MetricsCards from "../components/Automacoes/MetricsCards";
import NextExecution from "../components/Automacoes/NextExecution";
import ConfigurationsTable from "../components/Automacoes/ConfigurationsTable";
import QuickConfiguration from "../components/Automacoes/QuickConfiguration";
import { Layers, Plus, ChevronLeft } from 'lucide-react';

export default function Automacoes() {
  return (
    <div className="flex-1 bg-slate-50/50 overflow-y-auto">
      <div className="max-w-[1600px] mx-auto px-8 py-10">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight mb-2">
              Automações
            </h1>
            <p className="text-slate-500 font-medium">
              Gerencie seus pipelines de processamento agendado
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
              <ChevronLeft className="w-4 h-4" />
              Voltar
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-900/20">
              <Plus className="w-4 h-4" />
              Nova Automação
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <MetricsCards />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-brand-600 rounded-full" />
                  Configurações Ativas
                </h2>
                <ConfigurationsTable />
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                  Próxima Execução
                </h2>
                <NextExecution />
              </div>
              
              <QuickConfiguration />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
