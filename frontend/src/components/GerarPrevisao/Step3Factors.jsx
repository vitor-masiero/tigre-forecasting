import React from 'react';

export default function Step3Factors({ formData, updateFormData, nextStep, prevStep }) {
  const handleFactorChange = (factor, checked) => {
    updateFormData('fatoresExternos', {
      ...formData.fatoresExternos,
      [factor]: checked
    });
  };

  const factors = [
    { id: 'dadosMarketing', label: 'Dados de Marketing', description: 'Campanhas e promoções' },
    { id: 'dadosClimaticos', label: 'Dados Climáticos', description: 'Temperatura e clima' },
    { id: 'eventosSetoriais', label: 'Eventos Setoriais', description: 'Feiras e eventos' },
    { id: 'sazonalidade', label: 'Sazonalidade', description: 'Padrões sazonais' },
    { id: 'calendarioFeriados', label: 'Calendário de Feriados', description: 'Feriados nacionais' },
    { id: 'indicadoresMacro', label: 'Indicadores Macroeconômicos', description: 'PIB, inflação, etc' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Fatores Externos</h2>
        <p className="text-gray-600">Selecione os fatores que influenciam suas previsões</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {factors.map(factor => (
          <label
            key={factor.id}
            className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition ${
              formData.fatoresExternos[factor.id]
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="checkbox"
              checked={formData.fatoresExternos[factor.id]}
              onChange={(e) => handleFactorChange(factor.id, e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
            />
            <div className="flex-1">
              <div className="font-semibold text-gray-900">{factor.label}</div>
              <p className="text-xs text-gray-600 mt-1">{factor.description}</p>
            </div>
          </label>
        ))}
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mt-6">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-emerald-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-medium text-emerald-900">Dica</p>
            <p className="text-sm text-emerald-800 mt-1">
              Selecionar fatores externos relevantes pode melhorar significativamente a precisão das previsões. Recomendamos pelo menos Sazonalidade e Dados de Marketing.
            </p>
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
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg flex items-center gap-2 transition font-medium"
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