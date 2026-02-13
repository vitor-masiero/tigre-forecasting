import React, { useState } from 'react';
import { GRANULARITY_LEVELS, LINHAS, PROCESSOS_MAPPING, extractNumericId } from '../../utils/dataStructure';
import api from '../../utils/Api.js';
import { ClipboardCheck, Play, ChevronLeft, Rocket, Timer, CheckCircle2 } from 'lucide-react';

export default function Step4Review({ formData, setJsonPredict, nextStep, prevStep }) {
  const [isExecuting, setIsExecuting] = useState(false);

  const handleExecute = async () => {
    setIsExecuting(true);
    const body = convertFormDataToPayload(formData);

    try {
      const response = await api.post("/predict", body);
      let json = response.data;

      if (body?.sku) json.sku = body.sku;

      if (json.metrics?.global?.metrics_global) {
        json.metrics = {
          ...json.metrics,
          ...json.metrics.global.metrics_global
        };
        delete json.metrics.global;
      }

      setJsonPredict(json);
      setIsExecuting(false);
      nextStep();
    } catch (err) {
      console.error("Error details:", err.response || err);
      setIsExecuting(false);
      alert("Ocorreu um erro ao executar a previsão. Verifique se a API está acessível.");
    }
  };

  const convertFormDataToPayload = (formData) => {
    const mapModel = (m) => {
      if (!m) return null;
      if (m === 'automatico') return 'auto';
      return m.charAt(0).toUpperCase() + m.slice(1);
    };

    const base = {
      periods: Number(formData.horizontePrevisao || 0),
      preview_rows: Number(formData.horizontePrevisao || 0),
      model: mapModel(formData.modeloPrevisao)
    };

    if (formData.granularityLevel === 'todas') return { ...base, aggregation_type: 'all' };
    
    if (formData.granularityLevel === 'por_sku') {
      const skus = formData.skusSelecionados || [];
      return { ...base, aggregation_type: 'sku', sku: skus[0] || null };
    }

    if (formData.granularityLevel === 'combinacao') {
      const { linha = [], processos = [], classificacoes = [] } = formData.combinacoes;
      const familiasIds = linha.length > 0 ? linha.map(l => extractNumericId(l)) : null;
      
      return {
        ...base,
        aggregation_type: 'combined',
        familia: familiasIds,
        processo: processos.length > 0 ? processos : null,
        abc_class: classificacoes.length > 0 ? classificacoes : null
      };
    }

    return { ...base, aggregation_type: 'all' };
  };

  const getLinhasOrdenadas = () => {
    if (!formData.combinacoes?.linha) return [];
    return formData.combinacoes.linha
      .map(id => ({ id, label: LINHAS[id]?.label || id }))
      .sort((a, b) => a.label.localeCompare(b.label));
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2 flex items-center gap-2">
          <ClipboardCheck className="w-6 h-6 text-brand-600" />
          Revisão Final
        </h2>
        <p className="text-slate-500 font-medium text-sm">
          Confirme os detalhes da parametrização antes de iniciar o processamento.
        </p>
      </div>

      <div className="space-y-6">
        {/* Sumário em Cards Pequenos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Modelo Selecionado</p>
            <p className="text-lg font-bold text-slate-900 tracking-tight">{formData.modeloPrevisao}</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Horizonte Temporal</p>
            <p className="text-lg font-bold text-slate-900 tracking-tight">{formData.horizontePrevisao} meses</p>
          </div>
        </div>

        {/* Detalhes da Seleção */}
        <div className="bg-white rounded-[24px] border border-slate-200/60 p-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Escopo de Execução</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-slate-50">
              <span className="text-sm font-medium text-slate-600">Nível de Agregação</span>
              <span className="text-sm font-bold text-slate-900 tracking-tight uppercase">
                {GRANULARITY_LEVELS[formData.granularityLevel.toUpperCase()]?.label || formData.granularityLevel}
              </span>
            </div>

            {formData.granularityLevel === 'combinacao' && (
              <>
                <div className="py-3">
                  <span className="text-sm font-medium text-slate-600 block mb-3">Segmentos Selecionados</span>
                  <div className="flex flex-wrap gap-2">
                    {getLinhasOrdenadas().map(linha => (
                      <span key={linha.id} className="px-3 py-1.5 bg-brand-50 text-brand-700 text-[11px] font-bold rounded-lg border border-brand-100">
                        {linha.label}
                      </span>
                    ))}
                    {formData.combinacoes?.processos?.map(p => (
                      <span key={p} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-lg border border-emerald-100">
                        Processo {p}
                      </span>
                    ))}
                    {formData.combinacoes?.classificacoes?.map(c => (
                      <span key={c} className="px-3 py-1.5 bg-amber-50 text-amber-700 text-[11px] font-bold rounded-lg border border-amber-100">
                        Classe {c}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}

            {formData.granularityLevel === 'por_sku' && (
              <div className="py-3">
                <span className="text-sm font-medium text-slate-600 block mb-2">SKU Específico</span>
                <span className="px-3 py-1.5 bg-brand-600 text-white text-xs font-bold rounded-lg">
                  {formData.skusSelecionados[0]}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Estimativa Box */}
        <div className="bg-emerald-50/50 rounded-[24px] border border-emerald-100 p-6 flex items-center gap-5">
          <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
            <Timer className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-1">Estimativa de Processamento</p>
            <div className="flex items-center gap-3">
              <span className="text-lg font-extrabold text-emerald-900 tracking-tight">5 - 15 Segundos</span>
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white rounded-full border border-emerald-200 shadow-sm">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span className="text-[10px] font-bold text-emerald-600 uppercase">Sistema Otimizado</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-12 pt-8 border-t border-slate-100">
        <button
          onClick={prevStep}
          disabled={isExecuting}
          className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
          Ajustar
        </button>
        
        <button
          onClick={handleExecute}
          disabled={isExecuting}
          className={`
            flex items-center gap-3 px-10 py-4 rounded-2xl font-bold transition-all duration-300 shadow-lg
            ${isExecuting 
              ? 'bg-slate-200 text-slate-400' 
              : 'bg-brand-600 text-white shadow-brand-900/20 hover:scale-105 active:scale-95'
            }
          `}
        >
          {isExecuting ? (
            <>
              <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <Rocket className="w-5 h-5" />
              Lançar Previsão
            </>
          )}
        </button>
      </div>
    </div>
  );
}
