import React from 'react';
import { GRANULARITY_LEVELS } from '../../utils/dataStructure';
import GranularitySelector from './GranularitySelector';
import CombinacaoSelector from './CombinacaoSelector';
import SKUSelector from './SKUSelector';
import { ChevronLeft, ChevronRight, Layers } from 'lucide-react';

export default function Step2DataSelection({ formData, updateFormData, nextStep, prevStep }) {
  const handleGranularityChange = (level) => {
    updateFormData('granularityLevel', level);
    updateFormData('combinacoes', {});
    updateFormData('skusSelecionados', []);
  };

  const handleSKUChange = (skuString) => {
    updateFormData('skusSelecionados', [skuString]);
  };

  const isValid = () => {
    if (formData.granularityLevel === 'todas') return true;

    if (formData.granularityLevel === 'combinacao') {
      const { linha, processos, classificacoes } = formData.combinacoes;
      return linha || (processos && processos.length > 0) || (classificacoes && classificacoes.length > 0);
    }

    if (formData.granularityLevel === 'por_sku') {
      return !!(formData.skusSelecionados && formData.skusSelecionados.length > 0);
    }

    return false;
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2 flex items-center gap-2">
          <Layers className="w-6 h-6 text-brand-600" />
          Escopo dos Dados
        </h2>
        <p className="text-slate-500 font-medium text-sm">
          Defina o nível de detalhamento e quais conjuntos de dados serão processados pelo modelo.
        </p>
      </div>

      <div className="space-y-12">
        {/* Seletor de Granularidade */}
        <div className="space-y-4">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">
            Seleção de Abrangência
          </label>
          <GranularitySelector
            currentLevel={formData.granularityLevel}
            onLevelChange={handleGranularityChange}
          />
        </div>

        {/* Seleção de Combinações / SKUs */}
        {(formData.granularityLevel === 'combinacao' || formData.granularityLevel === 'por_sku') && (
          <div className="bg-slate-50/50 rounded-[32px] p-8 border border-slate-100 animate-in zoom-in-95 duration-300">
            {formData.granularityLevel === 'combinacao' && (
              <CombinacaoSelector
                combinacoes={formData.combinacoes}
                updateFormData={updateFormData}
              />
            )}

            {formData.granularityLevel === 'por_sku' && (
              <SKUSelector
                skuValue={formData.skusSelecionados}
                onSKUChange={handleSKUChange}
              />
            )}
          </div>
        )}
      </div>

      <div className="flex justify-between mt-12 pt-8 border-t border-slate-100">
        <button
          onClick={prevStep}
          className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
          Voltar
        </button>
        
        <button
          onClick={nextStep}
          disabled={!isValid()}
          className={`
            flex items-center gap-3 px-10 py-4 rounded-2xl font-bold transition-all duration-300 shadow-lg
            ${isValid()
              ? 'bg-brand-600 text-white shadow-brand-900/20 hover:scale-105 active:scale-95'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }
          `}
        >
          Continuar
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
