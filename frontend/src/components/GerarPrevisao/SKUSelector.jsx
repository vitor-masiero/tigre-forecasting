import React, { useState } from 'react';

export default function SKUSelector({ selectedSKUs, onSKUAdd, onSKURemove }) {
  const [skuInput, setSKUInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Simulação de busca de SKUs
  const mockSKUs = [
    'SKU-001-A', 'SKU-002-B', 'SKU-003-C', 'SKU-004-D', 'SKU-005-E',
    'SKU-006-F', 'SKU-007-G', 'SKU-008-H', 'SKU-009-I', 'SKU-010-J'
  ];

  const handleSearch = (value) => {
    setSKUInput(value);
    if (value.length >= 2) {
      const results = mockSKUs.filter(sku => 
        sku.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleAddSKU = (sku) => {
    onSKUAdd(sku);
    setSKUInput('');
    setSearchResults([]);
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-4">
        Buscar e Adicionar SKUs
      </label>

      {/* Campo de Busca */}
      <div className="relative mb-4">
        <input
          type="text"
          value={skuInput}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Digite o código do SKU..."
          className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <svg className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>

        {/* Resultados da Busca */}
        {searchResults.length > 0 && (
          <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {searchResults.map(sku => (
              <button
                key={sku}
                onClick={() => handleAddSKU(sku)}
                disabled={selectedSKUs.includes(sku)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition ${
                  selectedSKUs.includes(sku) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{sku}</span>
                  {selectedSKUs.includes(sku) ? (
                    <span className="text-xs text-gray-500">Já selecionado</span>
                  ) : (
                    <span className="text-xs text-blue-600">Clique para adicionar</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* SKUs Selecionados */}
      {selectedSKUs.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">
            SKUs Selecionados ({selectedSKUs.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedSKUs.map(sku => (
              <div
                key={sku}
                className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <span className="text-sm font-medium text-blue-900">{sku}</span>
                <button
                  onClick={() => onSKURemove(sku)}
                  className="text-blue-600 hover:text-blue-800 transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedSKUs.length === 0 && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-sm text-gray-600">
            Nenhum SKU selecionado. Use a busca acima para adicionar SKUs.
          </p>
        </div>
      )}
    </div>
  );
}
