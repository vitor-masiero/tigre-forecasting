// ============================================
// ARQUIVO: src/components/GerarPrevisao/Step4Review.jsx (ATUALIZADO)
// ============================================

import React, { useState } from 'react';
import { GRANULARITY_LEVELS, LINHAS, PROCESSOS_MAPPING, CLASSIFICACOES_ABC, extractNumericId } from '../../utils/dataStructure';
import api from '../../utils/Api.js';

export default function Step4Review({ formData, setJsonPredict, nextStep, prevStep }) {
  const [isExecuting, setIsExecuting] = useState(false);

  const handleExecute = async () => {
    setIsExecuting(true);

    const body = convertFormDataToPayload(formData);

    let response;

    try {
      response = await api.post("/predict", body);
    } catch (err) {
      console.error("Error details:", err.response || err);
      setIsExecuting(false);
      return alert("Ocorreu um erro ao executar a previsão. Verifique se a API está acessível.");
    }

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

    // Agregação: todas
    if (formData.granularityLevel === 'todas') {
      return {
        ...base,
        aggregation_type: 'all'
      };
    }

    // Agregação: por SKU
    if (formData.granularityLevel === 'por_sku') {
      const skus = formData.skusSelecionados || [];
      if (skus.length === 0) {
        return { ...base, aggregation_type: 'sku' };
      }
      const payloads = skus.map(sku => ({
        ...base,
        aggregation_type: 'sku',
        sku
      }));
      return payloads.length === 1 ? payloads[0] : payloads;
    }

    // Agregação: combinação
    if (formData.granularityLevel === 'combinacao') {
      const { linha = [], processos = [], classificacoes = [] } = formData.combinacoes;

      const payload = { ...base };

      // Converter IDs de linhas para números
      const familiasIds = linha.length > 0 ? linha.map(l => extractNumericId(l)) : null;

      // Se tem linhas selecionadas
      if (familiasIds && familiasIds.length > 0) {
        // Só linhas
        if (processos.length === 0 && classificacoes.length === 0) {
          return {
            ...payload,
            aggregation_type: 'familia',
            familia: familiasIds
          };
        }

        // Linhas + classificações (sem processos)
        if (processos.length === 0 && classificacoes.length > 0) {
          return {
            ...payload,
            aggregation_type: 'combined',
            familia: familiasIds,
            abc_class: classificacoes
          };
        }

        // Linhas + processos (sem classificações)
        if (processos.length > 0 && classificacoes.length === 0) {
          return {
            ...payload,
            aggregation_type: 'combined',
            familia: familiasIds,
            processo: processos
          };
        }

        // Linhas + processos + classificações
        if (processos.length > 0 && classificacoes.length > 0) {
          return {
            ...payload,
            aggregation_type: 'combined',
            familia: familiasIds,
            processo: processos,
            abc_class: classificacoes
          };
        }
      }

      // Sem linha
      // Só processos
      if (processos.length > 0 && classificacoes.length === 0) {
        return {
          ...payload,
          aggregation_type: 'combined',
          processo: processos
        };
      }

      // Só classificações
      if (processos.length === 0 && classificacoes.length > 0) {
        return {
          ...payload,
          aggregation_type: 'combined',
          abc_class: classificacoes
        };
      }

      // Processos + classificações
      if (processos.length > 0 && classificacoes.length > 0) {
        return {
          ...payload,
          aggregation_type: 'combined',
          processo: processos,
          abc_class: classificacoes
        };
      }

      // Fallback
      return { ...base, aggregation_type: 'all' };
    }

    return { ...base, aggregation_type: 'all' };
  };

  const getDataSelectionSummary = () => {
    if (formData.granularityLevel === 'todas') {
      return 'Todas as linhas, processos e classificações';
    }

    if (formData.granularityLevel === 'combinacao') {
      const { linha = [], processos = [], classificacoes = [] } = formData.combinacoes;

      const parts = [];
      if (linha.length > 0) parts.push(`${linha.length} linha(s)`);
      if (processos.length > 0) parts.push(`${processos.length} processo(s)`);
      if (classificacoes.length > 0) parts.push(`${classificacoes.length} classificação(s)`);

      return parts.length > 0 ? parts.join(' • ') : 'Nenhuma seleção';
    }

    if (formData.granularityLevel === 'por_sku') {
      return `${formData.skusSelecionados.length} SKU(s) individual(is)`;
    }

    return GRANULARITY_LEVELS[formData.granularityLevel.toUpperCase()]?.label || 'Não especificado';
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
          <div className="grid grid-cols-2 gap-6">
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

          {/* Detalhamento de Combinações */}
          {formData.granularityLevel === 'combinacao' && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">Detalhes da Seleção:</p>
              <div className="space-y-3">
                {/* Linhas */}
                {formData.combinacoes.linha && formData.combinacoes.linha.length > 0 && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-md">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                        </svg>
                      </div>
                      <p className="text-base font-bold text-blue-900">Linhas Selecionadas</p>
                    </div>
                    <div className="flex flex-wrap gap-2 ml-13">
                      {formData.combinacoes.linha.map(linhaId => (
                        <span key={linhaId} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold shadow-md hover:bg-blue-700 transition">
                          {LINHAS[linhaId]?.label || linhaId}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Processos */}
                {formData.combinacoes.processos && formData.combinacoes.processos.length > 0 && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center shadow-md">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                      </div>
                      <p className="text-base font-bold text-purple-900">Processos Selecionados</p>
                    </div>
                    <div className="flex flex-wrap gap-2 ml-13">
                      {formData.combinacoes.processos.map(procId => (
                        <span key={procId} className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold shadow-md hover:bg-purple-700 transition">
                          {PROCESSOS_MAPPING[procId]?.label || `Processo ${procId}`}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Classificações */}
                {formData.combinacoes.classificacoes && formData.combinacoes.classificacoes.length > 0 && (
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border-l-4 border-amber-500 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center shadow-md">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                        </svg>
                      </div>
                      <p className="text-base font-bold text-amber-900">Classificações ABC</p>
                    </div>
                    <div className="flex gap-2 ml-13">
                      {formData.combinacoes.classificacoes.map(cls => {
                        const colors = {
                          A: 'bg-emerald-600 hover:bg-emerald-700',
                          B: 'bg-yellow-500 hover:bg-yellow-600',
                          C: 'bg-rose-600 hover:bg-rose-700'
                        };
                        return (
                          <span
                            key={cls}
                            className={`inline-flex items-center px-5 py-2 ${colors[cls]} text-white rounded-lg text-sm font-bold shadow-md transition`}
                          >
                            Classe {cls}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600">Tempo estimado</p>
                  <p className="text-lg font-bold text-gray-900">1-2 min</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Status</p>
                  <p className="text-lg font-bold text-emerald-600">Pronto para executar</p>
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
