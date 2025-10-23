import React, { useState } from 'react';
import { GRANULARITY_LEVELS, FAMILIAS } from '../../utils/dataStructure';

export default function Step4Review({ formData, prevStep }) {
  const [isExecuting, setIsExecuting] = useState(false);

  const handleExecute = () => {
    setIsExecuting(true);
    console.log('Executando previsão com:', formData);
    
    // Simular execução
    setTimeout(() => {
      setIsExecuting(false);
      alert('Previsão executada com sucesso!');
    }, 2000);
  };

  const getDataSelectionSummary = () => {
    const level = GRANULARITY_LEVELS[formData.granularityLevel.toUpperCase()];
    
    if (formData.granularityLevel === 'todas_familias') {
      return 'Todas as famílias e processos';
    }
    
    if (formData.granularityLevel === 'por_familia') {
      return `${formData.familiasSelecionadas.length} família(s) selecionada(s)`;
    }
    
    if (formData.granularityLevel === 'por_processo') {
      const totalProcessos = Object.values(formData.processosPorFamilia).reduce(
        (sum, processos) => sum + processos.length, 0
      );
      return `${totalProcessos} processo(s) em ${Object.keys(formData.processosPorFamilia).length} família(s)`;
    }
    
    if (formData.granularityLevel === 'por_sku') {
      return `${formData.skusSelecionados.length} SKU(s) individual(is)`;
    }
    
    return level.label;
  };

  const getActiveFactors = () => {
    return Object.entries(formData.fatoresExternos)
      .filter(([_, value]) => value)
      .map(([key]) => {
        const labels = {
          dadosMarketing: 'Marketing',
          dadosClimaticos: 'Climáticos',
          eventosSetoriais: 'Eventos',
          sazonalidade: 'Sazonalidade',
          calendarioFeriados: 'Feriados',
          indicadoresMacro: 'Macroeconômicos'
        };
        return labels[key];
      });
  };

  const getTotalSKUs = () => {
    if (formData.granularityLevel === 'todas_familias') {
      return Object.values(FAMILIAS).reduce((total, familia) => {
        return total + familia.processos.reduce((sum, p) => sum + p.skus, 0);
      }, 0);
    }
    
    if (formData.granularityLevel === 'por_familia') {
      return formData.familiasSelecionadas.reduce((total, familiaId) => {
        const familia = Object.values(FAMILIAS).find(f => f.id === familiaId);
        return total + (familia ? familia.processos.reduce((sum, p) => sum + p.skus, 0) : 0);
      }, 0);
    }
    
    if (formData.granularityLevel === 'por_processo') {
      return Object.entries(formData.processosPorFamilia).reduce((total, [familiaId, processos]) => {
        const familia = Object.values(FAMILIAS).find(f => f.id === familiaId);
        return total + processos.reduce((sum, processoId) => {
          const processo = familia?.processos.find(p => p.id === processoId);
          return sum + (processo?.skus || 0);
        }, 0);
      }, 0);
    }
    
    if (formData.granularityLevel === 'por_sku') {
      return formData.skusSelecionados.length;
    }
    
    return 0;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Revisão da Configuração</h2>
        <p className="text-gray-600">Confirme os parâmetros antes de executar</p>
      </div>

      <div className="space-y-6">
        {/* Configurações Básicas */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            Configurações Básicas
          </h3>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Período Histórico</p>
              <p className="text-lg font-semibold text-gray-900">{formData.periodoHistorico} meses</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Horizonte de Previsão</p>
              <p className="text-lg font-semibold text-gray-900">{formData.horizontePrevisao} meses</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Modelo</p>
              <p className="text-lg font-semibold text-gray-900 capitalize">{formData.modeloPrevisao}</p>
            </div>
          </div>
        </div>

        {/* Seleção de Dados */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
            Seleção de Dados
          </h3>
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Nível de Granularidade</p>
            <p className="text-lg font-semibold text-gray-900">{getDataSelectionSummary()}</p>
          </div>

          {/* Detalhamento por Família */}
          {formData.granularityLevel === 'por_familia' && formData.familiasSelecionadas.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">Famílias Selecionadas:</p>
              <div className="flex flex-wrap gap-2">
                {formData.familiasSelecionadas.map(familiaId => {
                  const familia = Object.values(FAMILIAS).find(f => f.id === familiaId);
                  return (
                    <span key={familiaId} className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {familia?.label}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Detalhamento por Processo */}
          {formData.granularityLevel === 'por_processo' && Object.keys(formData.processosPorFamilia).length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">Processos Selecionados:</p>
              <div className="space-y-3">
                {Object.entries(formData.processosPorFamilia).map(([familiaId, processos]) => {
                  const familia = Object.values(FAMILIAS).find(f => f.id === familiaId);
                  if (!familia || processos.length === 0) return null;
                  
                  return (
                    <div key={familiaId} className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-900 mb-2">{familia.label}</p>
                      <div className="flex flex-wrap gap-2">
                        {processos.map(processoId => {
                          const processo = familia.processos.find(p => p.id === processoId);
                          return (
                            <span key={processoId} className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded font-medium">
                              {processo?.label}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Detalhamento por SKU */}
          {formData.granularityLevel === 'por_sku' && formData.skusSelecionados.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">SKUs Selecionados:</p>
              <div className="flex flex-wrap gap-2">
                {formData.skusSelecionados.slice(0, 10).map(sku => (
                  <span key={sku} className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {sku}
                  </span>
                ))}
                {formData.skusSelecionados.length > 10 && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                    +{formData.skusSelecionados.length - 10} mais
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Fatores Externos */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            Fatores Externos
          </h3>
          {getActiveFactors().length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {getActiveFactors().map(factor => (
                <span
                  key={factor}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {factor}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Nenhum fator externo selecionado</p>
          )}
        </div>

        {/* Estimativa */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">Estimativa de Execução</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-600">Tempo estimado</p>
                  <p className="text-lg font-bold text-gray-900">
                    ~{Math.ceil(getTotalSKUs() / 100)} min
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">SKUs processados</p>
                  <p className="text-lg font-bold text-gray-900">{getTotalSKUs()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Pontos de dados</p>
                  <p className="text-lg font-bold text-gray-900">~{(getTotalSKUs() * 36).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={prevStep}
          disabled={isExecuting}
          className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-8 py-3 rounded-lg flex items-center gap-2 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Anterior
        </button>
        <button
          onClick={handleExecute}
          disabled={isExecuting}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg flex items-center gap-2 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExecuting ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Executando...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Executar Previsão
            </>
          )}
        </button>
      </div>
    </div>
  );
}