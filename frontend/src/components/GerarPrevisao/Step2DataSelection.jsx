import React from 'react';
import { GRANULARITY_LEVELS } from '../../utils/dataStructure';
import GranularitySelector from './GranularitySelector';
import CombinacaoSelector from './CombinacaoSelector';
import SKUSelector from './SKUSelector';

export default function Step2DataSelection({ formData, updateFormData, nextStep, prevStep }) {
  const handleGranularityChange = (level) => {
    updateFormData('granularityLevel', level);
    updateFormData('combinacoes', {});
    updateFormData('skusSelecionados', '');
  };

  const handleSKUChange = (skuString) => {
    updateFormData('skusSelecionados', [skuString]);
  };

  const isValid = () => {
    if (formData.granularityLevel === 'todas') return true;
    if (formData.granularityLevel === 'combinacao') {
      return Object.keys(formData.combinacoes).length > 0;
    }
    if (formData.granularityLevel === 'por_sku') {
      return !!(formData.skusSelecionados && formData.skusSelecionados.toString().trim());
    }
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
      return formData.skusSelecionados ? `SKU: ${formData.skusSelecionados}` : '';
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
            skuValue={formData.skusSelecionados}
            onSKUChange={handleSKUChange}
          />
        )}

        {/* Resumo da Seleção removido conforme solicitado */}
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
