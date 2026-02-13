import React, { useState } from 'react';
import PageHeader from '../components/GerarPrevisao/PageHeader';
import ConfigurationSteps from '../components/GerarPrevisao/ConfigurationSteps';

export default function GerarPrevisao() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    periodoHistorico: '12',
    horizontePrevisao: '12',
    modeloPrevisao: 'XGBoost',
    granularityLevel: 'todas',
    combinacoes: {}, 
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
    <div className="flex-1 bg-slate-50/50 overflow-y-auto">
      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="mb-12">
          <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight mb-2">
            Configurar Nova Previsão
          </h1>
          <p className="text-slate-500 font-medium">
            Siga os passos abaixo para parametrizar e executar seu modelo de inteligência artificial.
          </p>
        </div>

        <div className="bg-white rounded-[32px] border border-slate-200/60 shadow-soft overflow-hidden">
          <div className="flex">
            {/* Sidebar de Passos */}
            <div className="w-72 bg-slate-50 border-r border-slate-200/60 p-8 hidden lg:block">
              <PageHeader currentStep={currentStep} totalSteps={4} />
            </div>

            {/* Conteúdo do Passo */}
            <div className="flex-1 p-10 min-h-[600px]">
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
        </div>
      </div>
    </div>
  );
}
