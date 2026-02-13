import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function InfluenceChart({ data, loading }) {
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
      is_holiday: "Feriado",
    };

    const match = nome.match(/([a-z_]+)_(\d+)/);
    if (match) {
      const base = traducoes[match[1]] || match[1];
      return `${base} (${match[2]}m)`;
    }

    return traducoes[nome] || nome;
  };

  const influences = useMemo(() => {
    if (!data || !data.metrics || !data.metrics.feature_importance) return [];

    return data.metrics.feature_importance
      .filter(f => f.importance_pct > 0)
      .slice(0, 5)
      .map((f, index) => ({
        name: traduzirFeature(f.feature),
        value: f.importance_pct,
        color: ["#0066ff", "#10b981", "#8b5cf6", "#f97316", "#ec4899"][index]
      }));
  }, [data]);

  if (loading || influences.length === 0) {
    return (
      <div className="bg-white rounded-[32px] p-8 border border-slate-200/60 shadow-soft animate-pulse">
        <div className="h-6 bg-slate-100 rounded w-48 mb-8"></div>
        <div className="flex items-center gap-8">
          <div className="w-40 h-40 bg-slate-50 rounded-full"></div>
          <div className="flex-1 space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-3 bg-slate-50 rounded w-full"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[32px] p-8 border border-slate-200/60 shadow-soft">
      <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mb-8">
        Pesos de Influência
      </h3>

      <div className="flex flex-col sm:flex-row items-center gap-8">
        <div className="w-44 h-44 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={influences}
                innerRadius={65}
                outerRadius={85}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {influences.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-950 px-3 py-2 rounded-xl shadow-xl border border-slate-800">
                        <p className="text-white text-[11px] font-bold">{payload[0].name}: {payload[0].value.toFixed(1)}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Top 5</span>
            <span className="text-xl font-black text-slate-900 tracking-tighter">Impacto</span>
          </div>
        </div>

        <div className="flex-1 space-y-4 w-full">
          {influences.map((item, index) => (
            <div key={index} className="flex flex-col gap-1.5 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{item.name}</span>
                </div>
                <span className="text-[11px] font-black text-slate-900">
                  {item.value.toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${item.value}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
