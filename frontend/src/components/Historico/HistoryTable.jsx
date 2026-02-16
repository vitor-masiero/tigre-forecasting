import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import api from "../../utils/Api";
import React, { useState, useEffect } from 'react';
import { TrendingUp, BarChart3, Zap, ChevronLeft, ChevronRight, Search, Filter, Download } from 'lucide-react';

function TableSkeleton() {
  return (
    <>
      {[...Array(8)].map((_, i) => (
        <tr key={i} className="border-b border-slate-50">
          <td className="px-6 py-5">
            <div className="h-4 bg-slate-100 rounded-full w-24 mb-2 animate-pulse"></div>
            <div className="h-3 bg-slate-50 rounded-full w-16 animate-pulse"></div>
          </td>
          <td className="px-6 py-5">
            <div className="h-4 bg-slate-100 rounded-full w-32 animate-pulse"></div>
          </td>
          <td className="px-6 py-5">
            <div className="h-6 bg-slate-100 rounded-lg w-20 animate-pulse"></div>
          </td>
          <td className="px-6 py-5">
            <div className="h-4 bg-slate-100 rounded-full w-12 animate-pulse"></div>
          </td>
          <td className="px-6 py-5">
            <div className="h-4 bg-slate-100 rounded-full w-16 animate-pulse"></div>
          </td>
          <td className="px-6 py-5">
            <div className="h-6 bg-slate-100 rounded-full w-24 animate-pulse"></div>
          </td>
        </tr>
      ))}
    </>
  );
}

export default function HistoryTable() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await api.get('/previsoes');
        setPredictions(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar previsões:', error);
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  const totalPages = Math.ceil(predictions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPredictions = predictions.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatTime = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white rounded-[32px] shadow-soft border border-slate-200/60 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Data e Horário
              </th>
              <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Identificador
              </th>
              <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Algoritmo
              </th>
              <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Volume
              </th>
              <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Nível
              </th>
              <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <TableSkeleton />
            ) : (
              currentPredictions.map((prediction) => (
                <tr key={prediction.id_previsao} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm font-bold text-slate-900 leading-tight">
                      {formatDate(prediction.dt_processamento)}
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium">
                      às {formatTime(prediction.dt_processamento)}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-xs text-slate-500 font-mono font-bold tracking-tight bg-slate-100/50 px-2 py-1 rounded-md inline-block">
                      {prediction.id_previsao?.slice(0, 13)}...
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className="px-3 py-1 bg-brand-50 text-brand-700 text-[11px] font-bold rounded-lg border border-brand-100">
                      {prediction.ds_modelo}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-slate-700">
                    {prediction.qtd_total_skus} SKUs
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className="text-xs font-bold text-slate-500 capitalize">
                      {prediction['SKU/Tipo'] === "aggregated" ? "Agregado" : prediction['SKU/Tipo']}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider rounded-full border border-emerald-100 inline-flex">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Concluído
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="px-8 py-6 bg-slate-50/30 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          Mostrando <span className="text-slate-900 font-black">{startIndex + 1}</span>-
          <span className="text-slate-900 font-black">{Math.min(startIndex + itemsPerPage, predictions.length)}</span> de{' '}
          <span className="text-slate-900 font-black">{predictions.length}</span> resultados
        </p>
        
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 text-slate-400 hover:text-brand-600 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1 mx-2">
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              let pageNum;
              if (totalPages <= 5) pageNum = i + 1;
              else if (currentPage <= 3) pageNum = i + 1;
              else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
              else pageNum = currentPage - 2 + i;

              return (
                <button
                  key={i}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-9 h-9 text-xs font-bold rounded-xl transition-all ${
                    currentPage === pageNum
                      ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20'
                      : 'text-slate-500 hover:bg-white hover:border-slate-200 border border-transparent'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-2 text-slate-400 hover:text-brand-600 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
