import React, { useMemo } from "react";
import MetricCard from "./MetricCard";
import { TrendingUp, BarChart3, Zap } from "lucide-react";

function MetricSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
          <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>
        <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  );
}

export default function MetricsCards({ data, loading }) {
  const metrics = useMemo(() => {
    if (!data || !data.preview || !data.metrics) return null;

    try {
      let valorTotal = 0;
      data.preview.forEach((e) => {
        valorTotal += e.yhat || 0;
      });

      const wmape = data.metrics.global?.metrics_global?.['WMAPE (%)'] || 0;
      const bias = data.metrics.global?.metrics_global?.['Bias (%)'] || 0;

      return [
        {
          title: "VALOR TOTAL",
          value: String(valorTotal.toFixed(2)).replaceAll(".", ","),
          icon: TrendingUp,
          iconBg: "bg-emerald-500",
        },
        {
          title: "WMAPE Geral",
          value: `${String(wmape.toFixed(1)).replaceAll(".", ",")}%`,
          icon: BarChart3,
          iconBg: "bg-blue-500",
        },
        {
          title: "Bias Geral",
          value: `${String(bias.toFixed(1)).replaceAll(".", ",")}%`,
          icon: Zap,
          iconBg: "bg-teal-500",
        },
      ];
    } catch (error) {
      console.error("Erro ao processar métricas:", error);
      return null;
    }
  }, [data]);

  if (loading || !metrics) {
    return (
      <div className="grid grid-cols-3 gap-6 mb-6">
        <MetricSkeleton />
        <MetricSkeleton />
        <MetricSkeleton />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-6 mb-6">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
}

