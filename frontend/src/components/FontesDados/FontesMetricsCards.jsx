import React from "react";
import FontesMetricCard from "./FontesMetricCard";

export default function FontesMetricsCards() {
  const metrics = [
    {
      title: "Fontes Ativas",
      value: "6",
      trend: "Conectadas",
      trendPositive: null,
      icon: "database",
      iconBg: "bg-emerald-500",
    },
    {
      title: "Última Sincronização",
      value: "15min",
      trend: "Sucesso",
      trendPositive: true,
      icon: "sync",
      iconBg: "bg-blue-500",
    },
    {
      title: "Volume de Dados",
      value: "2.4GB",
      trend: "Armazenado",
      trendPositive: null,
      icon: "storage",
      iconBg: "bg-emerald-500",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-6 mb-6">
      {metrics.map((metric, index) => (
        <FontesMetricCard key={index} {...metric} />
      ))}
    </div>
  );
}
