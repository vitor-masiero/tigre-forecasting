import React, { useState } from "react";
import FilterField from "./FilterField";

export default function FiltersCard() {
  const [filters, setFilters] = useState({
    periodo: "ultimos-30",
    modelo: "todos",
    status: "todos",
    busca: "",
  });

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Filtros</h2>
      <p className="text-sm text-gray-500 mb-6">
        Refine sua busca por período, modelo ou SKU
      </p>

      <div className="grid grid-cols-4 gap-4">
        <FilterField
          label="Período"
          value={filters.periodo}
          onChange={(value) => handleFilterChange("periodo", value)}
          options={[
            { value: "ultimos-7", label: "Últimos 7 dias" },
            { value: "ultimos-30", label: "Últimos 30 dias" },
            { value: "ultimos-90", label: "Últimos 90 dias" },
            { value: "ultimo-ano", label: "Último ano" },
            { value: "todos", label: "Todos" },
          ]}
        />

        <FilterField
          label="Modelo"
          value={filters.modelo}
          onChange={(value) => handleFilterChange("modelo", value)}
          options={[
            { value: "todos", label: "Todos" },
            { value: "prophet", label: "Prophet" },
            { value: "arima", label: "ARIMA" },
            { value: "lstm", label: "LSTM" },
            { value: "ensemble", label: "Ensemble" },
            { value: "multiple", label: "Multiple" },
          ]}
        />

        <FilterField
          label="Status"
          value={filters.status}
          onChange={(value) => handleFilterChange("status", value)}
          options={[
            { value: "todos", label: "Todos" },
            { value: "concluido", label: "Concluído" },
            { value: "executando", label: "Executando" },
            { value: "revisao", label: "Em Revisão" },
            { value: "erro", label: "Erro" },
          ]}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buscar
          </label>
          <input
            type="text"
            placeholder="Nome da previsão ou SKU..."
            value={filters.busca}
            onChange={(e) => handleFilterChange("busca", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>
      </div>
    </div>
  );
}
