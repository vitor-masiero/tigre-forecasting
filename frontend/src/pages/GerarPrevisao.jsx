import React, { useState } from 'react';
import PageHeader from '../components/GerarPrevisao/PageHeader';
import ConfigurationSteps from '../components/GerarPrevisao/ConfigurationSteps';

export default function GerarPrevisao() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Configurações Básicas
    periodoHistorico: '36',
    horizontePrevisao: '18',
    modeloPrevisao: 'automatico',
    
    // Seleção de Dados (NOVO)
    granularityLevel: 'todas_familias',
    familiasSelecionadas: [],
    processosPorFamilia: {}, // { familia_1: [processo_1, processo_2], ... }
    skusSelecionados: [],
    
    // Fatores Externos
    fatoresExternos: {
      dadosMarketing: true,
      dadosClimaticos: false,
      eventosSetoriais: false,
      sazonalidade: true,
      calendarioFeriados: false,
      indicadoresMacro: false
    }
  });

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <PageHeader currentStep={currentStep} totalSteps={4} />
      <div className="px-8 -mt-6 pb-8">
        <ConfigurationSteps
          currentStep={currentStep}
          formData={formData}
          updateFormData={updateFormData}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      </div>
    </div>
  );
}