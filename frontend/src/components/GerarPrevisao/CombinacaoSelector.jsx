// ============================================
// ARQUIVO: src/components/GerarPrevisao/CombinacaoSelector.jsx (COMPLETO)
// ============================================
import React, { useState } from 'react';
import { LINHAS, CLASSIFICACOES_ABC } from '../../utils/dataStructure';

export default function CombinacaoSelector({ combinacoes, updateFormData }) {
  const [linhasExpandidas, setLinhasExpandidas] = useState({});

  const toggleLinha = (linhaId) => {
    setLinhasExpandidas(prev => ({
      ...prev,
      [linhaId]: !prev[linhaId]
    }));
  };

  // Selecionar linha inteira (todos os processos e classificações)
  const toggleLinhaCompleta = (linhaId) => {
    const newCombinacoes = { ...combinacoes };
    
    if (newCombinacoes[linhaId] && newCombinacoes[linhaId]['_linha']) {
      // Se linha já está selecionada, remove
      delete newCombinacoes[linhaId];
    } else {
      // Seleciona linha inteira com marcador especial
      newCombinacoes[linhaId] = { '_linha': true };
    }
    
    updateFormData('combinacoes', newCombinacoes);
  };

  // Selecionar classificações no nível da linha (sem processo específico)
  const toggleClassificacaoLinha = (linhaId, classificacao) => {
    const newCombinacoes = { ...combinacoes };
    
    if (!newCombinacoes[linhaId]) {
      newCombinacoes[linhaId] = {};
    }
    
    // Remove seleção de linha completa se existir
    if (newCombinacoes[linhaId]['_linha'] !== undefined) {
      delete newCombinacoes[linhaId]['_linha'];
    }
    
    if (!newCombinacoes[linhaId]['_classificacoes']) {
      newCombinacoes[linhaId]['_classificacoes'] = [];
    }
    
    const classificacoes = newCombinacoes[linhaId]['_classificacoes'];
    if (classificacoes.includes(classificacao)) {
      newCombinacoes[linhaId]['_classificacoes'] = classificacoes.filter(c => c !== classificacao);
      // Se não há mais classificações gerais e nenhum processo, remove a linha
      if (newCombinacoes[linhaId]['_classificacoes'].length === 0) {
        delete newCombinacoes[linhaId]['_classificacoes'];
        if (Object.keys(newCombinacoes[linhaId]).length === 0) {
          delete newCombinacoes[linhaId];
        }
      }
    } else {
      newCombinacoes[linhaId]['_classificacoes'] = [...classificacoes, classificacao];
    }
    
    updateFormData('combinacoes', newCombinacoes);
  };

  const toggleProcesso = (linhaId, processoId) => {
    const newCombinacoes = { ...combinacoes };
    
    if (!newCombinacoes[linhaId]) {
      newCombinacoes[linhaId] = {};
    }
    
    // Remove seleção de linha completa se existir
    if (newCombinacoes[linhaId]['_linha'] !== undefined) {
      delete newCombinacoes[linhaId]['_linha'];
    }
    
    if (newCombinacoes[linhaId][processoId]) {
      delete newCombinacoes[linhaId][processoId];
      // Se não sobrou nada na linha, remove ela
      const remaining = Object.keys(newCombinacoes[linhaId]).filter(k => !k.startsWith('_'));
      if (remaining.length === 0 && !newCombinacoes[linhaId]['_classificacoes']) {
        delete newCombinacoes[linhaId];
      }
    } else {
      newCombinacoes[linhaId][processoId] = [];
    }
    
    updateFormData('combinacoes', newCombinacoes);
  };

  const toggleClassificacaoProcesso = (linhaId, processoId, classificacao) => {
    const newCombinacoes = { ...combinacoes };
    
    if (!newCombinacoes[linhaId]) {
      newCombinacoes[linhaId] = {};
    }
    if (!newCombinacoes[linhaId][processoId]) {
      newCombinacoes[linhaId][processoId] = [];
    }
    
    const classificacoes = newCombinacoes[linhaId][processoId];
    if (classificacoes.includes(classificacao)) {
      newCombinacoes[linhaId][processoId] = classificacoes.filter(c => c !== classificacao);
    } else {
      newCombinacoes[linhaId][processoId] = [...classificacoes, classificacao];
    }
    
    updateFormData('combinacoes', newCombinacoes);
  };

  const isLinhaCompletaSelecionada = (linhaId) => {
    return combinacoes[linhaId]?.['_linha'] === true;
  };

  const isLinhaSelected = (linhaId) => {
    return combinacoes[linhaId] && Object.keys(combinacoes[linhaId]).length > 0;
  };

  const isProcessoSelected = (linhaId, processoId) => {
    return combinacoes[linhaId]?.[processoId] !== undefined;
  };

  const isClassificacaoLinhaSelected = (linhaId, classificacao) => {
    return combinacoes[linhaId]?.['_classificacoes']?.includes(classificacao) || false;
  };

  const isClassificacaoProcessoSelected = (linhaId, processoId, classificacao) => {
    return combinacoes[linhaId]?.[processoId]?.includes(classificacao) || false;
  };

  const getLinhaSelectionCount = (linhaId) => {
    if (!combinacoes[linhaId]) return 0;
    
    if (isLinhaCompletaSelecionada(linhaId)) {
      return 'Completa';
    }
    
    const processos = Object.keys(combinacoes[linhaId]).filter(k => !k.startsWith('_'));
    const hasClassificacoes = combinacoes[linhaId]['_classificacoes']?.length > 0;
    
    if (processos.length > 0 && hasClassificacoes) {
      return `${processos.length} proc + class`;
    } else if (processos.length > 0) {
      return `${processos.length} processo(s)`;
    } else if (hasClassificacoes) {
      return `${combinacoes[linhaId]['_classificacoes'].length} class`;
    }
    
    return 0;
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-4">
        Selecione Combinações (Linha → Processo → Classificação)
      </label>
      <div className="space-y-4">
        {Object.values(LINHAS).map(linha => {
          const isExpanded = linhasExpandidas[linha.id];
          const isSelected = isLinhaSelected(linha.id);
          const isLinhaCompleta = isLinhaCompletaSelecionada(linha.id);

          return (
            <div
              key={linha.id}
              className={`border-2 rounded-lg transition ${
                isSelected ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
              }`}
            >
              {/* Cabeçalho da Linha */}
              <button
                onClick={() => toggleLinha(linha.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 rounded-t-lg transition"
              >
                <div className="flex items-center gap-3">
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">{linha.label}</div>
                    <p className="text-xs text-gray-600">{linha.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {isSelected && (
                    <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full font-medium">
                      {getLinhaSelectionCount(linha.id)}
                    </span>
                  )}
                  <svg 
                    className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Conteúdo Expandido */}
              {isExpanded && (
                <div className="border-t border-gray-200 p-4 bg-white rounded-b-lg space-y-4">
                  
                  {/* Opção: Selecionar Linha Completa */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-4">
                    <button
                      onClick={() => toggleLinhaCompleta(linha.id)}
                      className="w-full flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isLinhaCompleta}
                          onChange={() => {}}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="text-left">
                          <p className="text-sm font-semibold text-blue-900">
                            Selecionar Linha Completa
                          </p>
                          <p className="text-xs text-blue-700">
                            Todos os processos e classificações desta linha
                          </p>
                        </div>
                      </div>
                      {isLinhaCompleta && (
                        <span className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full font-medium">
                          Ativo
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Opção: Selecionar Classificações da Linha (sem processos específicos) */}
                  {!isLinhaCompleta && (
                    <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4">
                      <div className="mb-3">
                        <p className="text-sm font-semibold text-amber-900 mb-1">
                          Classificações Gerais da Linha
                        </p>
                        <p className="text-xs text-amber-700">
                          Selecione classificações para todos os processos desta linha
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {['A', 'B', 'C'].map(classificacao => {
                          const classConfig = CLASSIFICACOES_ABC[classificacao];
                          const isClassSelected = isClassificacaoLinhaSelected(linha.id, classificacao);
                          
                          return (
                            <button
                              key={classificacao}
                              onClick={() => toggleClassificacaoLinha(linha.id, classificacao)}
                              className={`flex-1 px-4 py-2.5 rounded-lg border-2 transition text-sm font-semibold ${
                                isClassSelected
                                  ? `border-${classConfig.color}-600 bg-${classConfig.color}-100 text-${classConfig.color}-900 shadow-sm`
                                  : 'border-amber-200 bg-white text-gray-700 hover:border-amber-400'
                              }`}
                            >
                              Classe {classificacao}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Divisor */}
                  {!isLinhaCompleta && (
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-gray-300"></div>
                      <span className="text-xs font-medium text-gray-500 uppercase">ou selecione processos específicos</span>
                      <div className="flex-1 h-px bg-gray-300"></div>
                    </div>
                  )}

                  {/* Lista de Processos */}
                  {!isLinhaCompleta && (
                    <div className="space-y-3">
                      {linha.processos.map(processo => {
                        const processoSelected = isProcessoSelected(linha.id, processo.id);
                        
                        return (
                          <div
                            key={processo.id}
                            className={`border-2 rounded-lg transition ${
                              processoSelected ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
                            }`}
                          >
                            {/* Cabeçalho do Processo */}
                            <button
                              onClick={() => toggleProcesso(linha.id, processo.id)}
                              className="w-full p-3 flex items-center justify-between hover:bg-gray-50 rounded-t-lg transition"
                            >
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={processoSelected}
                                  onChange={() => {}}
                                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                />
                                <span className="text-sm font-medium text-gray-900">{processo.label}</span>
                              </div>
                              {processoSelected && combinacoes[linha.id][processo.id].length > 0 && (
                                <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full font-medium">
                                  {combinacoes[linha.id][processo.id].length} classificação(ões)
                                </span>
                              )}
                            </button>

                            {/* Classificações ABC do Processo */}
                            {processoSelected && (
                              <div className="border-t border-gray-200 p-3 bg-white rounded-b-lg">
                                <p className="text-xs font-medium text-gray-700 mb-2">Classificações deste processo:</p>
                                <div className="flex gap-2">
                                  {processo.classificacoes.map(classificacao => {
                                    const classConfig = CLASSIFICACOES_ABC[classificacao];
                                    const isClassSelected = isClassificacaoProcessoSelected(linha.id, processo.id, classificacao);
                                    
                                    return (
                                      <button
                                        key={classificacao}
                                        onClick={() => toggleClassificacaoProcesso(linha.id, processo.id, classificacao)}
                                        className={`flex-1 px-3 py-2 rounded-lg border-2 transition text-sm font-medium ${
                                          isClassSelected
                                            ? `border-${classConfig.color}-600 bg-${classConfig.color}-100 text-${classConfig.color}-900`
                                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                                        }`}
                                      >
                                        {classificacao}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}