import React from 'react';
import { FAMILIAS } from '../../utils/dataStructure';

export default function FamilySelector({ 
  selectedFamilias, 
  onFamiliaToggle, 
  showProcesses,
  selectedProcessos,
  onProcessoToggle 
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-4">
        Selecione as Famílias {showProcesses && 'e Processos'}
      </label>
      <div className="space-y-4">
        {Object.values(FAMILIAS).map(familia => {
          const isFamiliaSelected = selectedFamilias.includes(familia.id);
          const totalSKUs = familia.processos.reduce((sum, p) => sum + p.skus, 0);
          const processosSelecionados = selectedProcessos[familia.id] || [];
          const skusProcessosSelecionados = processosSelecionados.reduce((sum, processoId) => {
            const processo = familia.processos.find(p => p.id === processoId);
            return sum + (processo?.skus || 0);
          }, 0);

          return (
            <div
              key={familia.id}
              className={`border-2 rounded-lg transition ${
                isFamiliaSelected ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
              }`}
            >
              {/* Cabeçalho da Família */}
              <button
                onClick={() => onFamiliaToggle(familia.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 rounded-t-lg transition"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isFamiliaSelected}
                    onChange={() => {}}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">{familia.label}</div>
                    <p className="text-xs text-gray-600">{familia.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{totalSKUs} SKUs</p>
                    <p className="text-xs text-gray-600">{familia.processos.length} processos</p>
                  </div>
                  {showProcesses && isFamiliaSelected && (
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </div>
              </button>

              {/* Lista de Processos */}
              {showProcesses && isFamiliaSelected && (
                <div className="border-t border-gray-200 p-4 bg-white rounded-b-lg">
                  <p className="text-xs font-semibold text-gray-700 mb-3">
                    Processos da {familia.label}
                    {processosSelecionados.length > 0 && (
                      <span className="ml-2 text-blue-600">
                        ({processosSelecionados.length} selecionado{processosSelecionados.length !== 1 && 's'}, {skusProcessosSelecionados} SKUs)
                      </span>
                    )}
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {familia.processos.map(processo => {
                      const isProcessoSelected = processosSelecionados.includes(processo.id);
                      
                      return (
                        <label
                          key={processo.id}
                          className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition ${
                            isProcessoSelected
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isProcessoSelected}
                            onChange={() => onProcessoToggle(familia.id, processo.id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">{processo.label}</div>
                            <div className="text-xs text-gray-600">{processo.skus} SKUs</div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}