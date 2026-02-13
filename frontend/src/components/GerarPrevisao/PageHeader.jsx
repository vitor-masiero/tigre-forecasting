import React from 'react';

const steps = [
  { id: 1, title: 'Parâmetros Básicos', description: 'Horizonte e modelos' },
  { id: 2, title: 'Granularidade', description: 'Nível de detalhamento' },
  { id: 3, title: 'Revisão', description: 'Validar configurações' },
  { id: 4, title: 'Resultado', description: 'Processamento e saída' }
];

export default function PageHeader({ currentStep }) {
  return (
    <div className="space-y-8">
      <div className="mb-10">
        <span className="text-[10px] font-bold text-brand-600 uppercase tracking-widest block mb-1">Passo a Passo</span>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">Workflow</h3>
      </div>

      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-[15px] top-0 bottom-0 w-[2px] bg-slate-200" />

        <div className="space-y-10 relative z-10">
          {steps.map((step) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div key={step.id} className="flex items-start gap-4 group">
                <div className={`
                  flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                  ${isActive ? 'bg-brand-600 text-white ring-4 ring-brand-100' : ''}
                  ${isCompleted ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : ''}
                  ${!isActive && !isCompleted ? 'bg-white border-2 border-slate-200 text-slate-400' : ''}
                `}>
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : step.id}
                </div>

                <div>
                  <p className={`text-sm font-bold tracking-tight mb-0.5 transition-colors ${isActive ? 'text-brand-700' : isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                    {step.title}
                  </p>
                  <p className={`text-[11px] font-medium leading-tight ${isActive ? 'text-brand-500' : 'text-slate-400'}`}>
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}