import React from 'react';
import { AGGREGATION_MODES, AGGREGATION_DIMENSIONS } from '../../utils/userTypes';
import DimensionCard from './DimensionCard';

export default function Step2Aggregation({ formData, updateFormData, nextStep, prevStep }) {
  const handleModeChange = (mode) => {
    updateFormData('aggregationMode', mode);
    updateFormData('selectedDimensions', []);
  };

  const handleDimensionToggle = (dimensionId) => {
    const current = formData.selectedDimensions;
    const maxDimensions = formData.aggregationMode === 'single' ? 1 : 
                          formData.aggregationMode === 'double' ? 2 : 3;

    if (current.includes(dimensionId)) {
      updateFormData('selectedDimensions', current.filter(d => d !== dimensionId));
    } else {
      if (current.length < maxDimensions) {
        updateFormData('selectedDimensions', [...current, dimensionId]);
      }
    }
  };

  const isValid = formData.aggregationMode === 'none' || 
                  (formData.aggregationMode === 'single' && formData.selectedDimensions.length === 1) ||
                  (formData.aggregationMode === 'double' && formData.selectedDimensions.length === 2) ||
                  (formData.aggregationMode === 'triple' && formData.selectedDimensions.length === 3);

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Nível de Agregação</h2>
        <p className="text-gray-600">Defina como os dados serão agrupados para a previsão</p>
      </div>

      <div className="space-y-6">
        {/* Modo de Agregação */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Modo de Agregação
          </label>
          <div className="grid grid-cols-2 gap-3">
            {Object.values(AGGREGATION_MODES).map(mode => (
              <button
                key={mode.id}
                onClick={() => handleModeChange(mode.id)}
                className={`p-4 rounded-lg border-2 transition text-left ${
                  formData.aggregationMode === mode.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="font-semibold text-gray-900">{mode.label}</div>
                  {mode.recommended && (
                    <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium">
                      Recomendado
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{mode.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Seleção de Dimensões */}
        {formData.aggregationMode !== 'none' && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Selecione as Dimensões
              <span className="text-gray-500 font-normal ml-2">
                ({formData.selectedDimensions.length} de {
                  formData.aggregationMode === 'single' ? 1 :
                  formData.aggregationMode === 'double' ? 2 : 3
                } selecionada{formData.aggregationMode !== 'single' && 's'})
              </span>
            </label>
            <div className="grid grid-cols-3 gap-4">
              {Object.values(AGGREGATION_DIMENSIONS).map(dimension => (
                <DimensionCard
                  key={dimension.id}
                  dimension={dimension}
                  isSelected={formData.selectedDimensions.includes(dimension.id)}
                  onToggle={() => handleDimensionToggle(dimension.id)}
                  disabled={
                    !formData.selectedDimensions.includes(dimension.id) &&
                    formData.selectedDimensions.length >= (
                      formData.aggregationMode === 'single' ? 1 :
                      formData.aggregationMode === 'double' ? 2 : 3
                    )
                  }
                />
              ))}
            </div>
          </div>
        )}

        {/* Informações sobre Agregação */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-purple-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-medium text-purple-900">Como funciona?</p>
              <p className="text-sm text-purple-800 mt-1">
                {formData.aggregationMode === 'none' && 'As previsões serão geradas individualmente para cada SKU.'}
                {formData.aggregationMode === 'single' && 'Os SKUs serão agrupados por uma dimensão antes de gerar as previsões.'}
                {formData.aggregationMode === 'double' && 'Os SKUs serão agrupados por duas dimensões simultaneamente, permitindo análises cruzadas.'}
                {formData.aggregationMode === 'triple' && 'Agregação completa por todas as dimensões, ideal para análises estratégicas de alto nível.'}
              </p>
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
          disabled={!isValid}
          className={`px-8 py-3 rounded-lg flex items-center gap-2 transition font-medium ${
            isValid
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
