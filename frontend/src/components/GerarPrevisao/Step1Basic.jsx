import React from 'react';

export default function Step1Basic({ formData, updateFormData, nextStep }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Configuração Básica</h2>
        <p className="text-gray-600">Defina os parâmetros principais da previsão</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Período Histórico
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['12', '24', '36', '48'].map(months => (
                <button
                  key={months}
                  onClick={() => updateFormData('periodoHistorico', months)}
                  className={`px-4 py-3 rounded-lg font-medium transition ${
                    formData.periodoHistorico === months
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {months} meses
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Horizonte de Previsão
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['6', '12', '18', '24'].map(months => (
                <button
                  key={months}
                  onClick={() => updateFormData('horizontePrevisao', months)}
                  className={`px-4 py-3 rounded-lg font-medium transition ${
                    formData.horizontePrevisao === months
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {months} meses
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Modelo de Previsão
          </label>
          <div className="grid grid-cols-4 gap-3">
            {[
              { value: 'automatico', label: 'Automático', desc: 'Melhor Fit' },
              { value: 'arima', label: 'ARIMA', desc: 'Estatístico' },
              { value: 'prophet', label: 'Prophet', desc: 'Facebook' },
              { value: 'ensemble', label: 'Ensemble', desc: 'Combinado' }
            ].map(model => (
              <button
                key={model.value}
                onClick={() => updateFormData('modeloPrevisao', model.value)}
                className={`px-4 py-3 rounded-lg font-medium transition text-left ${
                  formData.modeloPrevisao === model.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div>{model.label}</div>
                <div className={`text-xs mt-1 ${
                  formData.modeloPrevisao === model.value ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {model.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-medium text-blue-900">Dica</p>
              <p className="text-sm text-blue-800 mt-1">
                Recomendamos usar pelo menos 24 meses de histórico para previsões mais precisas.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
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