import React, { useState } from 'react';
import { GRANULARITY_LEVELS, FAMILIAS } from '../../utils/dataStructure';
import GranularitySelector from './GranularitySelector';
import FamilySelector from './FamilySelector';
import ProcessSelector from './ProcessSelector';
import SKUSelector from './SKUSelector';

export default function Step2DataSelection({ formData, updateFormData, nextStep, prevStep }) {
  const handleGranularityChange = (level) => {
    updateFormData('granularityLevel', level);
    // Reset seleções ao trocar de nível
    updateFormData('familiasSelecionadas', []);
    updateFormData('processosPorFamilia', {});
    updateFormData('skusSelecionados', []);
  };

  const handleFamiliaToggle = (familiaId) => {
    const current = formData.familiasSelecionadas;
    if (current.includes(familiaId)) {
      updateFormData('familiasSelecionadas', current.filter(f => f !== familiaId));
      // Remove processos dessa família
      const newProcessos = { ...formData.processosPorFamilia };
      delete newProcessos[familiaId];
      updateFormData('processosPorFamilia', newProcessos);
    } else {
      updateFormData('familiasSelecionadas', [...current, familiaId]);
    }
  };

  const handleProcessoToggle = (familiaId, processoId) => {
    const currentProcessos = formData.processosPorFamilia[familiaId] || [];
    
    if (currentProcessos.includes(processoId)) {
      updateFormData('processosPorFamilia', {
        ...formData.processosPorFamilia,
        [familiaId]: currentProcessos.filter(p => p !== processoId)
      });
    } else {
      updateFormData('processosPorFamilia', {
        ...formData.processosPorFamilia,
        [familiaId]: [...currentProcessos, processoId]
      });
    }
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
    if (formData.granularityLevel === 'todas_familias') return true;
    if (formData.granularityLevel === 'por_familia') return formData.familiasSelecionadas.length > 0;
    if (formData.granularityLevel === 'por_processo') {
      return Object.values(formData.processosPorFamilia).some(processos => processos.length > 0);
    }
    if (formData.granularityLevel === 'por_sku') return formData.skusSelecionados.length > 0;
    return false;
  };

  const getTotalSKUs = () => {
    if (formData.granularityLevel === 'todas_familias') {
      return Object.values(FAMILIAS).reduce((total, familia) => {
        return total + familia.processos.reduce((sum, p) => sum + p.skus, 0);
      }, 0);
    }
    
    if (formData.granularityLevel === 'por_familia') {
      return formData.familiasSelecionadas.reduce((total, familiaId) => {
        const familia = Object.values(FAMILIAS).find(f => f.id === familiaId);
        return total + (familia ? familia.processos.reduce((sum, p) => sum + p.skus, 0) : 0);
      }, 0);
    }
    
    if (formData.granularityLevel === 'por_processo') {
      return Object.entries(formData.processosPorFamilia).reduce((total, [familiaId, processos]) => {
        const familia = Object.values(FAMILIAS).find(f => f.id === familiaId);
        return total + processos.reduce((sum, processoId) => {
          const processo = familia?.processos.find(p => p.id === processoId);
          return sum + (processo?.skus || 0);
        }, 0);
      }, 0);
    }
    
    if (formData.granularityLevel === 'por_sku') {
      return formData.skusSelecionados.length;
    }
    
    return 0;
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

        {/* Seleção de Famílias */}
        {(formData.granularityLevel === 'por_familia' || formData.granularityLevel === 'por_processo') && (
          <FamilySelector
            selectedFamilias={formData.familiasSelecionadas}
            onFamiliaToggle={handleFamiliaToggle}
            showProcesses={formData.granularityLevel === 'por_processo'}
            selectedProcessos={formData.processosPorFamilia}
            onProcessoToggle={handleProcessoToggle}
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-blue-900">Total Selecionado</p>
                <p className="text-xs text-blue-700">
                  {formData.granularityLevel === 'todas_familias' && 'Todas as famílias e processos'}
                  {formData.granularityLevel === 'por_familia' && `${formData.familiasSelecionadas.length} família(s)`}
                  {formData.granularityLevel === 'por_processo' && `${Object.keys(formData.processosPorFamilia).length} família(s) com processos selecionados`}
                  {formData.granularityLevel === 'por_sku' && `${formData.skusSelecionados.length} SKU(s) individual(is)`}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-900">{getTotalSKUs()}</p>
              <p className="text-xs text-blue-700">SKUs totais</p>
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