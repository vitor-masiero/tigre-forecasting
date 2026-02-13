import React from 'react';
import { GRANULARITY_LEVELS } from '../../utils/dataStructure';
import { LayoutGrid, ListFilter, Hash } from 'lucide-react';

export default function GranularitySelector({ currentLevel, onLevelChange }) {
  const getIcon = (iconType) => {
    switch(iconType) {
      case 'all': return <LayoutGrid className="w-6 h-6" />;
      case 'combo': return <ListFilter className="w-6 h-6" />;
      case 'sku': return <Hash className="w-6 h-6" />;
      default: return null;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {Object.values(GRANULARITY_LEVELS).map(level => {
        const isActive = currentLevel === level.id;
        return (
          <button
            key={level.id}
            onClick={() => onLevelChange(level.id)}
            className={`
              relative p-6 rounded-3xl transition-all duration-300 text-left border-2 flex flex-col items-start group
              ${isActive
                ? 'border-brand-600 bg-brand-50 shadow-lg shadow-brand-900/5'
                : 'border-slate-100 bg-white hover:border-brand-200 hover:bg-slate-50'
              }
            `}
          >
            <div className={`
              w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300
              ${isActive ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20' : 'bg-slate-50 text-slate-400 group-hover:scale-110'}
            `}>
              {getIcon(level.icon)}
            </div>
            
            <div className="flex flex-col">
              <span className={`text-base font-bold tracking-tight mb-1 ${isActive ? 'text-brand-700' : 'text-slate-900'}`}>
                {level.label}
              </span>
              <p className={`text-[11px] font-medium leading-relaxed ${isActive ? 'text-brand-600' : 'text-slate-500'}`}>
                {level.description}
              </p>
            </div>

            {isActive && (
              <div className="absolute top-4 right-4 w-5 h-5 bg-brand-600 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}