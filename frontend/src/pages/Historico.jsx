import React from "react";
import HistoryTable from "../components/Historico/HistoryTable";
import { Clock, Download, Filter } from 'lucide-react';

export default function Historico() {
  return (
    <div className="flex-1 bg-slate-50/50 overflow-y-auto">
      <div className="max-w-[1600px] mx-auto px-8 py-10">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight mb-2">
              Histórico de Previsões
            </h1>
            <p className="text-slate-500 font-medium">
              Consulte e exporte os resultados de execuções anteriores
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
              <Filter className="w-4 h-4" />
              Filtros Avançados
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-900/20">
              <Download className="w-4 h-4" />
              Exportar Tudo
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[32px] border border-slate-200/60 shadow-soft overflow-hidden">
          <div className="p-8 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-50 rounded-lg">
                <Clock className="w-5 h-5 text-brand-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Logs de Processamento</h2>
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mostrando últimas 100 execuções</span>
          </div>
          <div className="p-4">
            <HistoryTable />
          </div>
        </div>
      </div>
    </div>
  );
}
