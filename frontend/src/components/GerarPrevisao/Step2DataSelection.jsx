import React from 'react';
import { GRANULARITY_LEVELS } from '../../utils/dataStructure';
import GranularitySelector from './GranularitySelector';
import CombinacaoSelector from './CombinacaoSelector';
import SKUSelector from './SKUSelector';

export default function Step2DataSelection({ formData, updateFormData, nextStep, prevStep }) {
  const handleGranularityChange = (level) => {
    updateFormData('granularityLevel', level);
    updateFormData('combinacoes', {});
    updateFormData('skusSelecionados', []);
  };

  const handleSKUAdd = (sku) => {
    if (!formData.skusSelecionados.includes(sku)) {
      updateFormData('skusSelecionados', [...formData.skusSelecionados, sku]);
    }
  };

  const handleSKURemove = (sku) => {
    updateFormData('skusSelecionados', formData.skusSelecionados.filter(s => s !== sku));
  };

  const isValid = () => {
    if (formData.granularityLevel === 'todas') return true;
    if (formData.granularityLevel === 'combinacao') {
      return Object.keys(formData.combinacoes).length > 0;
    }
    if (formData.granularityLevel === 'por_sku') return formData.skusSelecionados.length > 0;
    return false;
  };

  const getSelectionSummary = () => {
    if (formData.granularityLevel === 'todas') {
      return 'Todas as linhas, processos e classificações';
    }
    
    if (formData.granularityLevel === 'combinacao') {
      const totalLinhas = Object.keys(formData.combinacoes).length;
      const totalProcessos = Object.values(formData.combinacoes).reduce(
        (sum, processos) => sum + Object.keys(processos).length, 0
      );
      return `${totalLinhas} linha(s) • ${totalProcessos} processo(s)`;
    }
    
    if (formData.granularityLevel === 'por_sku') {
      return `${formData.skusSelecionados.length} SKU(s) selecionado(s)`;
    }
    
    return '';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Seleção de Dados</h2>
        <p className="text-gray-600">Escolha o nível de granularidade e os dados para previsão</p>
      </div>

      <div className="space-y-8">
        {/* Seletor de Granularidade */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            Nível de Granularidade
          </label>
          <GranularitySelector
            currentLevel={formData.granularityLevel}
            onLevelChange={handleGranularityChange}
          />
        </div>

        {/* Seleção de Combinações */}
        {formData.granularityLevel === 'combinacao' && (
          <CombinacaoSelector
            combinacoes={formData.combinacoes}
            updateFormData={updateFormData}
          />
        )}

        {/* Seleção de SKUs */}
        {formData.granularityLevel === 'por_sku' && (
          <SKUSelector
            selectedSKUs={formData.skusSelecionados}
            onSKUAdd={handleSKUAdd}
            onSKURemove={handleSKURemove}
          />
        )}

        {/* Resumo da Seleção */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-900">Seleção Atual</p>
              <p className="text-sm text-blue-700">{getSelectionSummary()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={prevStep}
          className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-8 py-3 rounded-lg flex items-center gap-2 transition font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Anterior
        </button>
        <button
          onClick={nextStep}
          disabled={!isValid()}
          className={`px-8 py-3 rounded-lg flex items-center gap-2 transition font-medium ${
            isValid()
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Próximo
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}