import React from "react";
import MetricCard from "./MetricCard";

export default function MetricsCards() {
  const metrics = [
    {
      title: "Automações Ativas",
      value: "8",
      trend: "Funcionando",
      trendPositive: null,
      icon: "automation",
      iconBg: "bg-emerald-500",
    },
    {
      title: "Execuções Hoje",
      value: "24",
      trend: "+15%",
      trendPositive: true,
      icon: "calendar",
      iconBg: "bg-blue-500",
    },
    {
      title: "Taxa de Sucesso",
      value: "97,3%",
      trend: "Excelente",
      trendPositive: true,
      icon: "check",
      iconBg: "bg-emerald-500",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-6 mb-6">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
}
