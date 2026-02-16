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
