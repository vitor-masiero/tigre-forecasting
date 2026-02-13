import React from "react";
import ExternalVariablesUploadCard from "../components/ImportarDados/ExternalVariablesUploadCard";
import HistoricalDataUploadCard from "../components/ImportarDados/HistoricalDataUploadCard";
import { UploadCloud, FileText, AlertCircle } from 'lucide-react';

export default function ImportarDados() {
  return (
    <div className="flex-1 bg-slate-50/50 overflow-y-auto">
      <div className="max-w-[1600px] mx-auto px-8 py-10">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight mb-2">
              Importação de Dados
            </h1>
            <p className="text-slate-500 font-medium">
              Alimente o motor de IA com novos históricos ou variáveis externas
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <div className="w-1.5 h-6 bg-brand-600 rounded-full" />
              Variáveis Externas
            </h2>
            <ExternalVariablesUploadCard />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
              Dados Históricos
            </h2>
            <HistoricalDataUploadCard />
          </div>
        </div>

        {/* Guia de Formato */}
        <div className="bg-white rounded-[32px] border border-slate-200/60 p-8 shadow-soft">
          <div className="flex items-start gap-6">
            <div className="p-4 bg-amber-50 rounded-2xl">
              <AlertCircle className="w-8 h-8 text-amber-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">Guia de Formatação</h3>
              <p className="text-slate-500 font-medium mb-6">Certifique-se de que seus arquivos seguem o padrão exigido para evitar erros de processamento.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Extensões</p>
                  <p className="text-sm font-bold text-slate-700">CSV, XLSX ou JSON</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Encoding</p>
                  <p className="text-sm font-bold text-slate-700">UTF-8 (recomendado)</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Separador</p>
                  <p className="text-sm font-bold text-slate-700">Vírgula ou Ponto e Vírgula</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
