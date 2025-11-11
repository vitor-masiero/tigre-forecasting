import React, { useEffect, useState } from "react";
import MetricCard from "./MetricCard";
import { TrendingUp, BarChart3, Zap } from "lucide-react";
import api from "../../utils/Api";

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

export default function MetricsCards() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await api.get('/xgboost/metrics/general');
        const data = response.data;

        setMetrics([
          {
            title: "Previsão 30 Dias",
            value: "R$ 2,4M",
            trend: "+12,5%",
            trendPositive: true,
            icon: TrendingUp,
            iconBg: "bg-emerald-500",
          },
          {
            title: "WMAPE Geral",
            value: `${data.wmape.average.toFixed(1)}%`,
            trend: "Excelente",
            trendPositive: true,
            icon: BarChart3,
            iconBg: "bg-blue-500",
          },
          {
            title: "Bias Geral",
            value: `${data.bias_percentage.average.toFixed(1)}%`,
            trend: "Monitorando",
            trendPositive: null,
            icon: Zap,
            iconBg: "bg-teal-500",
            trendIcon: "play",
          },
        ]);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar métricas:', error);
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
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
