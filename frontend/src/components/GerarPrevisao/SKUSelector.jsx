import React from 'react';

export default function SKUSelector({ skuValue, onSKUChange }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-4">
        Digite o SKU
      </label>

      <div className="mb-4">
        <input
          type="text"
          value={skuValue || ''}
          onChange={(e) => onSKUChange(e.target.value)}
          placeholder="Digite o código do SKU..."
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );
}
