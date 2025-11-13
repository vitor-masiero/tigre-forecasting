import React from 'react';
import ProgressBar from './ProgressBar';

export default function PageHeader({ currentStep, totalSteps }) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gerar Nova Previsão</h1>
          <p className="text-blue-100">Configure e execute previsões personalizadas</p>
        </div>
      </div>

      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
    </div>
  );
}
