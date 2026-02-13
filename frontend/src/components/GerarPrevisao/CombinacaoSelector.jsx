// ============================================
// ARQUIVO: src/components/GerarPrevisao/CombinacaoSelector.jsx (ATUALIZADO)
// ============================================

import React from 'react';
import { LINHAS, PROCESSOS_MAPPING } from '../../utils/dataStructure';

const CLASSIFICACOES = ['A', 'B', 'C'];

export default function CombinacaoSelector({ combinacoes, updateFormData }) {
  // Garantir que `linhasSelecionadas` seja sempre um array de ids (pode vir como string ou array)
  const linhasSelecionadas = Array.isArray(combinacoes.linha)
    ? combinacoes.linha
    : (combinacoes.linha ? [combinacoes.linha] : []);
  const processosSelecionados = combinacoes.processos || [];
  const classificacoesSelecionadas = combinacoes.classificacoes || [];

  // Mapeia processos para linhas
  const getProcessosParaLinhas = () => {
    const mapping = {};
    Object.values(LINHAS).forEach(linha => {
      linha.processos.forEach(processo => {
        if (!mapping[processo.id]) {
          mapping[processo.id] = [];
        }
        mapping[processo.id].push(linha.id);
      });
    });
    return mapping;
  };

  const processosParaLinhas = getProcessosParaLinhas();

  // Ordenar linhas por label em ordem alfabética
  const linhasOrdenadas = Object.values(LINHAS).sort((a, b) =>
    a.label.localeCompare(b.label)
  );

  // Ordenar processos por label em ordem alfabética
  const processosOrdenados = Object.values(PROCESSOS_MAPPING).sort((a, b) =>
    a.label.localeCompare(b.label)
  );

  // Determina quais linhas estão habilitadas
  const getLinhasHabilitadas = () => {
    if (processosSelecionados.length === 0) {
      return Object.keys(LINHAS);
    }

    // Pega as linhas que contêm TODOS os processos selecionados
    const linhasComTodosProcessos = Object.keys(LINHAS).filter(linhaId => {
      const linha = LINHAS[linhaId];
      return processosSelecionados.every(procId =>
        linha.processos.some(p => p.id === procId)
      );
    });

    return linhasComTodosProcessos;
  };

  // Determina quais processos estão habilitados (interseção entre linhas selecionadas)
  const getProcessosHabilitados = () => {
    if (!linhasSelecionadas || linhasSelecionadas.length === 0) {
      return Object.keys(PROCESSOS_MAPPING);
    }

    // Para cada linha selecionada, pega os ids de processos; depois faz interseção
    const listas = linhasSelecionadas
      .map(lId => (LINHAS[lId]?.processos || []).map(p => p.id))
      .filter(arr => arr.length > 0);

    if (listas.length === 0) return [];

    return listas.reduce((acc, arr) => acc.filter(id => arr.includes(id)), listas[0]);
  };

  const linhasHabilitadas = getLinhasHabilitadas();
  const processosHabilitados = getProcessosHabilitados();

  const toggleLinha = (linhaId) => {
    // adiciona/remove da lista de linhas selecionadas
    const existe = linhasSelecionadas.includes(linhaId);
    const novasLinhas = existe
      ? linhasSelecionadas.filter(l => l !== linhaId)
      : [...linhasSelecionadas, linhaId];

    // Filtra processos que não são compatíveis com TODAS as linhas selecionadas
    let novosProcessos = processosSelecionados;
    if (novasLinhas.length > 0) {
      // interseção dos processos das novasLinhas
      const listas = novasLinhas.map(lId => (LINHAS[lId]?.processos || []).map(p => p.id));
      const intersecao = listas.reduce((acc, arr) => acc.filter(id => arr.includes(id)), listas[0] || []);
      novosProcessos = processosSelecionados.filter(p => intersecao.includes(p));
    }

    updateFormData('combinacoes', {
      ...combinacoes,
      linha: novasLinhas,
      processos: novosProcessos
    });
  };

  const toggleProcesso = (processoId) => {
    let novosProcessos;
    if (processosSelecionados.includes(processoId)) {
      novosProcessos = processosSelecionados.filter(p => p !== processoId);
    } else {
      novosProcessos = [...processosSelecionados, processoId];
    }

    // Se houver linhas selecionadas, remove as que não contenham TODOS os processos selecionados
    let novasLinhas = linhasSelecionadas;
    if (linhasSelecionadas && linhasSelecionadas.length > 0) {
      novasLinhas = linhasSelecionadas.filter(lId => {
        const processosLinha = (LINHAS[lId]?.processos || []).map(p => p.id);
        return novosProcessos.every(p => processosLinha.includes(p));
      });
    }

    updateFormData('combinacoes', {
      ...combinacoes,
      linha: novasLinhas,
      processos: novosProcessos
    });
  };

  const toggleClassificacao = (classificacao) => {
    const novasClassificacoes = classificacoesSelecionadas.includes(classificacao)
      ? classificacoesSelecionadas.filter(c => c !== classificacao)
      : [...classificacoesSelecionadas, classificacao];

    // Ordenar classificações em ordem alfabética (A, B, C)
    const classificacoesOrdenadas = novasClassificacoes.sort();

    updateFormData('combinacoes', {
      ...combinacoes,
      classificacoes: classificacoesOrdenadas
    });
  };

  // Ordenar linhas selecionadas por label
  const linhasSelecionadasOrdenadas = linhasSelecionadas
    .map(id => ({ id, label: LINHAS[id]?.label || id }))
    .sort((a, b) => a.label.localeCompare(b.label))
    .map(item => item.id);

  // Ordenar processos selecionados por label
  const processosSelecionadosOrdenados = processosSelecionados
    .map(id => ({ id, label: PROCESSOS_MAPPING[id]?.label || `Processo ${id}` }))
    .sort((a, b) => a.label.localeCompare(b.label))
    .map(item => item.id);

  // Ordenar classificações selecionadas (já estão em ordem A, B, C)
  const classificacoesSelecionadasOrdenadas = [...classificacoesSelecionadas].sort();

  return (
    <div className="space-y-6">
      {/* Seleção de Linhas */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-blue-900 mb-1">Linhas</h3>
          <p className="text-sm text-blue-700">Selecione uma ou mais linhas</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {linhasOrdenadas.map((linha) => {
            const isSelected = linhasSelecionadas.includes(linha.id);
            const isDisabled = !linhasHabilitadas.includes(linha.id);

            return (
              <button
                key={linha.id}
                onClick={() => !isDisabled && toggleLinha(linha.id)}
                disabled={isDisabled}
                title={isDisabled ? 'Incompatível com os processos selecionados' : ''}
                className={`p-4 rounded-lg border-2 transition text-left relative ${
                  isDisabled
                    ? 'border-gray-300 bg-gray-100 opacity-50 cursor-not-allowed'
                    : isSelected
                    ? 'border-blue-600 bg-blue-100 shadow-md'
                    : 'border-blue-200 bg-white hover:border-blue-400 hover:bg-blue-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-semibold ${isDisabled ? 'text-gray-500' : isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                      {linha.label}
                    </p>
                    <p className={`text-xs mt-1 ${isDisabled ? 'text-gray-400' : 'text-gray-600'}`}>
                      {linha.processos.length} processo(s)
                    </p>
                  </div>
                  {isSelected && (
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Seleção de Processos */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-lg p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-purple-900 mb-1">Processos</h3>
          <p className="text-sm text-purple-700">Selecione um ou mais processos</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {processosOrdenados.map((processo) => {
            const isSelected = processosSelecionados.includes(processo.id);
            const isDisabled = !processosHabilitados.includes(processo.id);
            const linhasCompativeis = processosParaLinhas[processo.id] || [];

            return (
              <button
                key={processo.id}
                onClick={() => !isDisabled && toggleProcesso(processo.id)}
                disabled={isDisabled}
                title={isDisabled ? 'Incompatível com a linha selecionada' : ''}
                className={`p-4 rounded-lg border-2 transition text-left relative ${
                  isDisabled
                    ? 'border-gray-300 bg-gray-100 opacity-50 cursor-not-allowed'
                    : isSelected
                    ? 'border-purple-600 bg-purple-100 shadow-md'
                    : 'border-purple-200 bg-white hover:border-purple-400 hover:bg-purple-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-semibold ${isDisabled ? 'text-gray-500' : isSelected ? 'text-purple-900' : 'text-gray-900'}`}>
                      {processo.label}
                    </p>
                    <p className={`text-xs mt-1 ${isDisabled ? 'text-gray-400' : 'text-gray-600'}`}>
                      {linhasCompativeis.length} linha(s) compatível(is)
                    </p>
                  </div>
                  {isSelected && (
                    <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Seleção de Classificações */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-lg p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-amber-900 mb-1">Classificações ABC</h3>
          <p className="text-sm text-amber-700">Selecione as classificações desejadas</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {CLASSIFICACOES.map((classificacao) => {
            const isSelected = classificacoesSelecionadas.includes(classificacao);

            return (
              <button
                key={classificacao}
                onClick={() => toggleClassificacao(classificacao)}
                className={`p-4 rounded-lg border-2 transition text-center ${
                  isSelected
                    ? 'border-amber-600 bg-amber-100 shadow-md'
                    : 'border-amber-200 bg-white hover:border-amber-400 hover:bg-amber-50'
                }`}
              >
                <p className={`font-bold text-2xl ${isSelected ? 'text-amber-900' : 'text-gray-900'}`}>
                  {classificacao}
                </p>
                <p className={`text-xs mt-1 ${isSelected ? 'text-amber-700' : 'text-gray-600'}`}>
                  Classe {classificacao}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Resumo da Seleção */}
      {(linhasSelecionadas.length > 0 || processosSelecionados.length > 0 || classificacoesSelecionadas.length > 0) && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-3">Resumo da Seleção</h3>
          <div className="space-y-2 text-sm">
            {linhasSelecionadasOrdenadas.length > 0 && (
              <p className="text-green-800">
                <span className="font-semibold">Linhas:</span> {linhasSelecionadasOrdenadas.map(id => LINHAS[id]?.label || id).join(', ')}
              </p>
            )}
            {processosSelecionadosOrdenados.length > 0 && (
              <p className="text-green-800">
                <span className="font-semibold">Processos:</span> {processosSelecionadosOrdenados.map(p => PROCESSOS_MAPPING[p]?.label || p).join(', ')}
              </p>
            )}
            {classificacoesSelecionadasOrdenadas.length > 0 && (
              <p className="text-green-800">
                <span className="font-semibold">Classificações:</span> {classificacoesSelecionadasOrdenadas.join(', ')}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
