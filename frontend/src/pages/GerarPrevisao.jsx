import React, { useState } from 'react';
import PageHeader from '../components/GerarPrevisao/PageHeader';
import ConfigurationSteps from '../components/GerarPrevisao/ConfigurationSteps';

export default function GerarPrevisao() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    periodoHistorico: '12',
    horizontePrevisao: '12',
    modeloPrevisao: 'prophet',
    granularityLevel: 'todas',
    combinacoes: {}, // { linha_1: { processo_1: ['A', 'B'], processo_2: ['C'] } }
    skusSelecionados: [],
    fatoresExternos: {
      dadosMarketing: true,
      dadosClimaticos: false,
      eventosSetoriais: false,
      sazonalidade: true,
      calendarioFeriados: false,
      indicadoresMacro: false
    }
  });
  const [jsonPredict, setJsonPredict] = useState();

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <PageHeader currentStep={currentStep} totalSteps={5} />
      <div className="px-8 -mt-6 pb-8">
        <ConfigurationSteps
          currentStep={currentStep}
          formData={formData}
          updateFormData={updateFormData}
          jsonPredict={jsonPredict}
          setJsonPredict={setJsonPredict}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      </div>
    </div>
  );
}
