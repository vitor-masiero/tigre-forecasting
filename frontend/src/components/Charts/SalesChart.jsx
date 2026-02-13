import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl shadow-2xl">
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">{label}</p>
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <p className="text-white text-sm font-bold">
                {entry.name}: <span className="text-slate-300 font-medium">R$ {new Intl.NumberFormat('pt-BR').format(entry.value)}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function SalesChart({ data, loading }) {
  if (loading) {
    return (
      <div className="col-span-2 bg-white rounded-[32px] p-8 border border-slate-200/60 shadow-soft animate-pulse">
        <div className="h-6 bg-slate-100 rounded w-48 mb-8"></div>
        <div className="bg-slate-50 rounded-2xl h-[300px]"></div>
      </div>
    );
  }

  const chartData = data?.preview?.map(item => {
    const date = new Date(item.ds);
    const label = date.toLocaleString('pt-BR', { month: 'short', year: '2-digit' });
    
    // Simulação de tendência baseada nos dados (pode ser ajustado se houver campo real)
    const trendBase = data.metrics?.trend?.first_value || data.preview[0].yhat;
    const trendEnd = data.metrics?.trend?.last_value || data.preview[data.preview.length - 1].yhat;
    const index = data.preview.indexOf(item);
    const trend = trendBase + (trendEnd - trendBase) * (index / (data.preview.length - 1));

    return {
      name: label,
      previsto: item.yhat,
      tendencia: trend
    };
  }) || [];

  return (
    <div className="col-span-2 bg-white rounded-[32px] p-8 border border-slate-200/60 shadow-soft">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Volume de Vendas
          </h3>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Projeção detalhada para os próximos meses
          </p>
        </div>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-brand-600 shadow-[0_0_8px_rgba(0,102,255,0.4)]" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Previsto</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400 opacity-40" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tendência</span>
          </div>
        </div>
      </div>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrevisto" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0066ff" stopOpacity={0.12}/>
                <stop offset="95%" stopColor="#0066ff" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
              dy={15}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
              tickFormatter={(val) => `R$ ${new Intl.NumberFormat('pt-BR', { notation: 'compact' }).format(val)}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }} />
            <Area 
              name="Previsto"
              type="monotone" 
              dataKey="previsto" 
              stroke="#0066ff" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorPrevisto)" 
              animationDuration={1500}
            />
            <Line 
              name="Tendência"
              type="monotone" 
              dataKey="tendencia" 
              stroke="#ef4444" 
              strokeWidth={2}
              strokeDasharray="6 6"
              dot={false}
              opacity={0.4}
              animationDuration={2000}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
