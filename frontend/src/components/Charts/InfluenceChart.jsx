import React, { useEffect, useState } from "react";

export default function InfluenceChart({ data, loading }) {
  const [influences, setInfluences] = useState([]);

  const traduzirFeature = (nome) => {
    const traducoes = {
      growth_rate: "Taxa de Crescimento",
      rolling_mean: "Média Móvel",
      rolling_std: "Desvio Padrão Móvel",
      trend: "Tendência",
      lag: "Defasagem",
      selic: "Taxa Selic",
      incc: "Índice INCC",
      month: "Mês",
      month_sin: "Seno do Mês",
      month_cos: "Cosseno do Mês",
      day_of_year: "Dia do Ano",
      quarter: "Trimestre",
      year: "Ano",
      week_of_year: "Semana do Ano",
      quarter_sin: "Seno do Trimestre",
      quarter_cos: "Cosseno do Trimestre",
      is_holiday: "Feriado",
    };

    const match = nome.match(/([a-z_]+)_(\d+)/);
    if (match) {
      const base = traducoes[match[1]] || match[1];
      return `${base} de ${match[2]}m`;
    }

    return traducoes[nome] || nome;
  };

  useEffect(() => {
    if (data && data.metrics && data.metrics.feature_importance) {
      const top5 = data.metrics.feature_importance
        .filter(f => f.importance_pct > 0)
        .slice(0, 5)
        .map((f, index) => ({
          name: traduzirFeature(f.feature),
          value: f.importance_pct,
          color: ["bg-blue-500", "bg-emerald-500", "bg-purple-500", "bg-orange-500", "bg-pink-500"][index]
        }));

      setInfluences(top5);
    }
  }, [data]);

  const getColor = (colorClass) => {
    const map = {
      "bg-blue-500": "#3B82F6",
      "bg-emerald-500": "#10B981",
      "bg-purple-500": "#8B5CF6",
      "bg-orange-500": "#F97316",
      "bg-pink-500": "#EC4899",
    };
    return map[colorClass] || "#000";
  };

  if (loading || influences.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
        <div className="flex items-center gap-6">
          <div className="w-48 h-48 bg-gray-200 rounded-full"></div>
          <div className="flex-1 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const total = influences.reduce((acc, item) => acc + item.value, 0);
  let currentAngle = 0;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Fatores Mais Influentes
      </h3>

      <div className="flex items-center gap-6">
        {/* Gráfico circular */}
        <div className="relative w-48 h-48">
          <svg viewBox="0 0 200 200" className="transform -rotate-90">
            {influences.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const angle = (percentage / 100) * 360;
              const largeArcFlag = angle > 180 ? 1 : 0;

              const startX = 100 + 80 * Math.cos((currentAngle * Math.PI) / 180);
              const startY = 100 + 80 * Math.sin((currentAngle * Math.PI) / 180);
              const endX =
                100 + 80 * Math.cos(((currentAngle + angle) * Math.PI) / 180);
              const endY =
                100 + 80 * Math.sin(((currentAngle + angle) * Math.PI) / 180);

              const path = `M 100 100 L ${startX} ${startY} A 80 80 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
              currentAngle += angle;

              return (
                <path
                  key={index}
                  d={path}
                  fill={getColor(item.color)}
                  opacity="0.9"
                />
              );
            })}
            {/* Círculo central branco */}
            <circle cx="100" cy="100" r="45" fill="white" />
          </svg>

          {/* Texto central */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{total.toFixed(0)}%</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
          </div>
        </div>

        {/* Legenda */}
        <div className="flex-1 space-y-2">
          {influences.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded ${item.color}`}
                ></div>
                <span className="text-sm text-gray-700">{item.name}</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {item.value.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
