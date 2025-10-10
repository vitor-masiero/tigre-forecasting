import React from "react";
import ForecastItem from "./ForecastItem";

export default function RecentForecasts() {
  const forecasts = [
    {
      title: "Previsão Q1 2024",
      details: "36 SKUs • Executado",
      time: "3h atrás",
      status: "success",
    },
    {
      title: "Automação Mensal",
      details: "72 SKUs • Executando",
      time: "1d atrás",
      status: "warning",
    },
    {
      title: "Análise Sazonal",
      details: "Finalizado Ontem",
      time: "2d atrás",
      status: "success",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Previsões Recentes
        </h3>
        <a href="#" className="text-blue-600 text-sm hover:underline">
          Ver Todas
        </a>
      </div>
      <div className="space-y-4">
        {forecasts.map((forecast, index) => (
          <ForecastItem
            key={index}
            {...forecast}
            isLast={index === forecasts.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
