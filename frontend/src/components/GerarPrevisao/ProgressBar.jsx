import React from 'react';

export default function ProgressBar({ currentStep, totalSteps }) {
  const steps = [
    { number: 1, label: 'Configuração Básica' },
    { number: 2, label: 'Agregação' },
    { number: 3, label: 'Revisão' },
    { number: 4, label: 'Resultado' }
  ];

  return (
    <div className="flex items-center justify-center min-h m-4">
      <div className="max-w-3xl w-full">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition ${
                  step.number === currentStep
                    ? 'bg-white text-blue-600'
                    : step.number < currentStep
                    ? 'bg-blue-400 text-white'
                    : 'bg-white/30 text-white'
                }`}>
                  {step.number < currentStep ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>
                <span className={`text-xs mt-2 font-medium ${
                  step.number === currentStep ? 'text-white' : 'text-blue-200'
                }`}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-2 rounded transition ${
                  step.number < currentStep ? 'bg-blue-400' : 'bg-white/30'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
