import React from 'react';
import { Info, Cpu, Calendar, ChevronRight } from 'lucide-react';

export default function Step1Basic({ formData, updateFormData, nextStep }) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-brand-600" />
          Configuração Básica
        </h2>
        <p className="text-slate-500 font-medium text-sm">
          Defina o alcance temporal e o motor de inteligência para esta execução.
        </p>
      </div>

      <div className="space-y-10">
        {/* Horizonte de Previsão */}
        <div className="space-y-4">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">
            Horizonte de Previsão
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {['12', '18', '24', '36'].map(months => (
              <button
                key={months}
                onClick={() => updateFormData('horizontePrevisao', months)}
                className={`
                  group relative px-6 py-4 rounded-2xl font-bold transition-all duration-300 border-2
                  ${formData.horizontePrevisao === months
                    ? 'bg-brand-600 border-brand-600 text-white shadow-lg shadow-brand-900/20 scale-[1.02]'
                    : 'bg-white border-slate-100 text-slate-600 hover:border-brand-200 hover:bg-slate-50'
                  }
                `}
              >
                <div className="text-lg">{months}</div>
                <div className={`text-[10px] uppercase tracking-tighter ${formData.horizontePrevisao === months ? 'text-brand-100' : 'text-slate-400'}`}>meses</div>
              </button>
            ))}
          </div>
        </div>

        {/* Modelo de Previsão */}
        <div className="space-y-4">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            Motor de Inteligência
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { value: 'XGBoost', label: 'XGBoost', desc: 'Gradient Boosting' },
              { value: 'Prophet', label: 'Prophet', desc: 'Séries Temporais' },
              { value: 'ML', label: 'ML Flow', desc: 'Auto Machine Learning' },
            ].map(model => (
              <button
                key={model.value}
                onClick={() => updateFormData('modeloPrevisao', model.value)}
                className={`
                  relative px-6 py-5 rounded-2xl font-bold transition-all duration-300 border-2 text-left
                  ${formData.modeloPrevisao === model.value
                    ? 'bg-brand-600 border-brand-600 text-white shadow-lg shadow-brand-900/20'
                    : 'bg-white border-slate-100 text-slate-600 hover:border-brand-200 hover:bg-slate-50'
                  }
                `}
              >
                <div className="text-sm mb-1">{model.label}</div>
                <div className={`text-[10px] font-medium opacity-70 ${formData.modeloPrevisao === model.value ? 'text-white' : 'text-slate-400'}`}>
                  {model.desc}
                </div>
                {formData.modeloPrevisao === model.value && (
                  <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-white animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-start gap-4">
          <div className="bg-white p-2 rounded-xl shadow-sm">
            <Info className="w-5 h-5 text-brand-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 mb-1">Dica de Performance</p>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Modelos XGBoost tendem a ser mais precisos para dados com alta volatilidade, enquanto o Prophet se destaca em sazonalidades fortes.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-12 pt-8 border-t border-slate-100">
        <button
          onClick={nextStep}
          className="bg-brand-600 hover:bg-brand-700 text-white px-10 py-4 rounded-2xl flex items-center gap-3 transition-all font-bold shadow-lg shadow-brand-900/20 hover:scale-105 active:scale-95"
        >
          Continuar
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
