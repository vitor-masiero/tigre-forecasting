import React from "react";
import MetricCard from "../Metrics/MetricCard";
import { TrendingUp, BarChart3, Zap } from "lucide-react";

export default function MetricsCards() {
  const metrics = [
    {
      title: "Previsão 30 Dias",
      value: "R$ 2,4M",
      trend: "+12,5%",
      trendPositive: true,
      icon: TrendingUp,
      iconBg: "bg-emerald-500",
    },
    {
      title: "Precisão Modelo",
      value: "94,2%",
      trend: "Excelente",
      trendPositive: true,
      icon: BarChart3,
      iconBg: "bg-blue-500",
    },
    {
      title: "Automações Ativas",
      value: "8",
      trend: "Funcionando",
      trendPositive: null,
      icon: Zap,
      iconBg: "bg-teal-500",
      trendIcon: "play",
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
