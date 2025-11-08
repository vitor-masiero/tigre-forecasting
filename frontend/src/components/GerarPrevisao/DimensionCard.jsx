import React from 'react';

export default function DimensionCard({ dimension, isSelected, onToggle, disabled }) {
  const getIcon = () => {
    switch(dimension.icon) {
      case 'layers':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
          </svg>
        );
      case 'process':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        );
      case 'tag':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`p-4 rounded-lg border-2 transition text-left ${
        isSelected
          ? `border-${dimension.color}-600 bg-${dimension.color}-50`
          : disabled
          ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${
        isSelected ? `bg-${dimension.color}-100 text-${dimension.color}-600` : 'bg-gray-100 text-gray-600'
      }`}>
        {getIcon()}
      </div>
      <div className="font-semibold text-gray-900 mb-1">{dimension.label}</div>
      <p className="text-xs text-gray-600">{dimension.description}</p>
    </button>
  );
}
