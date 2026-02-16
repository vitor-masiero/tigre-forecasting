import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Target, 
  Layers, 
  Cpu, 
  Filter, 
  Calendar,
  Zap,
  CheckCircle2,
  Info,
  Clock,
  ArrowUpRight,
  FileText,
  Printer
} from 'lucide-react';
import Logo from '../Sidebar/Logo';

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
                {entry.name}: <span className="text-slate-300 font-medium">{new Intl.NumberFormat('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                }).format(entry.value)}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const InfluenceTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950 px-3 py-2 rounded-xl shadow-xl border border-slate-800">
        <p className="text-white text-[11px] font-bold">
          {payload[0].name}: {payload[0].value.toFixed(1)}%
        </p>
      </div>
    );
  }
  return null;
};

export default function Step5Result({ jsonPredict }) {
  if (!jsonPredict) return null;

  const getWmapeColor = (wmape) => {
    if (!wmape) return 'text-slate-400 bg-slate-100';
    if (wmape <= 30) return 'text-emerald-700 bg-emerald-50 border-emerald-100';
    if (wmape <= 50) return 'text-amber-700 bg-amber-50 border-amber-100';
    if (wmape <= 70) return 'text-orange-700 bg-orange-50 border-orange-100';
    return 'text-red-700 bg-red-50 border-red-100';
  };

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

    const matchNumero = nome.match(/([a-z_]+)_(\d+)/);
    if (matchNumero) {
      const base = traducoes[matchNumero[1]] || matchNumero[1];
      return `${base} (${matchNumero[2]}m)`;
    }

    const matchValue = nome.match(/(.+)_value$/);
    if (matchValue) {
      const nomeVariavel = matchValue[1];
      return nomeVariavel.split('_').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
    }

    return traducoes[nome] || nome;
  };

  const chartData = useMemo(() => {
    if (!jsonPredict.preview) return [];
    
    const n = jsonPredict.preview.length;
    const firstTrend = jsonPredict.metrics?.trend?.first_value || 0;
    const lastTrend = jsonPredict.metrics?.trend?.last_value || 0;

    return jsonPredict.preview.map((item, i) => {
      const date = new Date(item.ds);
      const label = date.toLocaleString('pt-BR', { month: 'short', year: '2-digit' });
      const trend = firstTrend + (lastTrend - firstTrend) * (i / (n - 1));
      
      return {
        name: label,
        previsto: item.yhat,
        tendencia: trend
      };
    });
  }, [jsonPredict]);

  const influences = useMemo(() => {
    if (!jsonPredict.metrics?.feature_importance) return [];

    return jsonPredict.metrics.feature_importance
      .filter(f => f.importance_pct > 0)
      .sort((a, b) => b.importance_pct - a.importance_pct)
      .slice(0, 5)
      .map((f, index) => ({
        name: traduzirFeature(f.feature),
        value: f.importance_pct,
        color: ["#0066ff", "#10b981", "#8b5cf6", "#f97316", "#ec4899"][index]
      }));
  }, [jsonPredict]);

  const filtrosInfo = useMemo(() => {
    if (!jsonPredict?.aggregation_info) return null;
    const info = jsonPredict.aggregation_info;
    const filtros = [];

    if (info.processo?.length > 0) filtros.push({ label: 'Processos', value: info.processo.join(', ') });
    else if (info.processos_included?.length > 0) filtros.push({ label: 'Processos', value: info.processos_included.join(', ') });

    if (info.familia?.length > 0) filtros.push({ label: 'Linhas', value: info.familia.join(', ') });
    else if (info.familias_included?.length > 0) filtros.push({ label: 'Linhas', value: info.familias_included.join(', ') });

    if (info.abc_class?.length > 0) filtros.push({ label: 'Curva ABC', value: info.abc_class.join(', ') });

    if (info.date_range) {
      const fmt = (d) => new Date(d).toLocaleDateString('pt-BR', { month: '2-digit', year: '2-digit' });
      filtros.push({ label: 'Período', value: `${fmt(info.date_range.start)} - ${fmt(info.date_range.end)}` });
    }

    return filtros.length > 0 ? filtros : null;
  }, [jsonPredict]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 print:space-y-6">
      {/* Cabeçalho Exclusivo para Impressão */}
      <div className="hidden print:flex justify-between items-end border-b-2 border-slate-900 pb-6 mb-8">
        <div className="flex flex-col gap-4">
          <Logo variant="light" />
          <div>
            <h1 className="text-2xl font-black text-slate-950 uppercase tracking-tight">Relatório de Previsão de Demanda</h1>
            <p className="text-sm text-slate-500 font-bold">Emitido em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ID da Execução</p>
          <p className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">{jsonPredict.run_id}</p>
        </div>
      </div>

      {/* Header com Status e Tempo (Oculto na impressão, substituído pelo cabeçalho acima) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Previsão Concluída</h2>
            <p className="text-sm text-slate-500 font-medium">Os resultados estão prontos para análise</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {jsonPredict.time && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">
                {jsonPredict.time.toFixed(2)}s
              </span>
            </div>
          )}
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
            ID: {jsonPredict.run_id?.slice(0, 8)}...
          </span>
        </div>
      </div>

      {/* Grid de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4">
        {/* WMAPE */}
        <div className={`p-6 rounded-3xl border transition-all ${getWmapeColor(jsonPredict.metrics?.['WMAPE (%)'])} shadow-sm print:shadow-none print:border-slate-200 flex flex-col items-center text-center`}>
          <Target className="w-5 h-5 mb-3 opacity-40 print:text-slate-400" />
          <span className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Precisão (WMAPE)</span>
          <span className="text-2xl font-black tracking-tighter">
            {jsonPredict.metrics?.['WMAPE (%)']?.toFixed(1) || '0.0'}%
          </span>
        </div>

        {/* Modelo */}
        <div className="p-6 rounded-3xl border border-brand-100 bg-brand-50/30 text-brand-900 shadow-sm print:shadow-none print:border-slate-200 print:bg-white flex flex-col items-center text-center">
          <Cpu className="w-5 h-5 mb-3 text-brand-400 print:text-slate-400" />
          <span className="text-[10px] font-black uppercase tracking-widest opacity-70 text-brand-600 print:text-slate-500 mb-1">Algoritmo</span>
          <p className="text-lg font-black tracking-tight leading-none mb-1">{jsonPredict.model_used}</p>
          <span className="text-[10px] font-bold opacity-60 uppercase">
            {jsonPredict.auto_selected ? 'Automático' : 'Manual'}
          </span>
        </div>

        {/* SKUs / Agregação */}
        <div className="p-6 rounded-3xl border border-purple-100 bg-purple-50/30 text-purple-900 shadow-sm print:shadow-none print:border-slate-200 print:bg-white flex flex-col items-center text-center">
          <Layers className="w-5 h-5 mb-3 text-purple-400 print:text-slate-400" />
          <span className="text-[10px] font-black uppercase tracking-widest opacity-70 text-purple-600 print:text-slate-500 mb-1">Escopo</span>
          <p className="text-lg font-black tracking-tight leading-none mb-1 truncate w-full px-2">
            {jsonPredict.sku || (jsonPredict.aggregation_info?.type === "all" ? "Todos os SKUs" : `${jsonPredict.aggregation_info?.skus_count || 0} SKUs`)}
          </p>
          <span className="text-[10px] font-bold opacity-60 uppercase">
            {jsonPredict.aggregation_info?.type || 'Individual'}
          </span>
        </div>

        {/* Tendência */}
        <div className="p-6 rounded-3xl border border-slate-200 bg-white text-slate-900 shadow-sm print:shadow-none flex flex-col items-center text-center">
          <TrendingUp className="w-5 h-5 mb-3 text-slate-300 print:text-slate-400" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Direção</span>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-black tracking-tight leading-none">
              {((jsonPredict.metrics?.trend?.last_value / jsonPredict.metrics?.trend?.first_value - 1) * 100).toFixed(1)}%
            </span>
            <ArrowUpRight className={`w-4 h-4 ${jsonPredict.metrics?.trend?.last_value > jsonPredict.metrics?.trend?.first_value ? 'text-emerald-500' : 'text-red-500 rotate-90'}`} />
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Variação Projetada</span>
        </div>
      </div>

      {/* Área Principal - Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 print:grid-cols-1">
        {/* Gráfico de Linha - 3/4 da largura */}
        <div className="lg:col-span-3 bg-white rounded-[32px] p-8 border border-slate-200/60 shadow-soft print:shadow-none print:border-slate-100 print:rounded-none">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Projeção de Vendas</h3>
              <p className="text-sm text-slate-500 font-medium">Volumes previstos para os próximos meses</p>
            </div>
            <div className="flex gap-6 print:hidden">
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

          <div className="h-[380px] w-full print:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPrevistoResult" x1="0" y1="0" x2="0" y2="1">
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
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                  tickFormatter={(val) => new Intl.NumberFormat('pt-BR', { notation: 'compact' }).format(val)}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }} />
                <Area 
                  name="Previsto"
                  type="monotone" 
                  dataKey="previsto" 
                  stroke="#0066ff" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorPrevistoResult)" 
                />
                <Line 
                  name="Tendência"
                  type="monotone" 
                  dataKey="tendencia" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  strokeDasharray="6 6"
                  dot={false}
                  opacity={0.3}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Pizza - 1/4 da largura */}
        <div className="bg-white rounded-[32px] p-6 border border-slate-200/60 shadow-soft flex flex-col print:shadow-none print:border-slate-100 print:rounded-none print:mt-8">
          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight mb-8">Influenciadores</h3>
          
          <div className="flex-1 flex flex-col justify-center gap-10 print:gap-6">
            <div className="h-52 w-full relative print:h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={influences}
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {influences.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<InfluenceTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <Zap className="w-6 h-6 text-amber-400 mb-1" />
                <span className="text-[11px] font-black text-slate-900 tracking-tight uppercase">Drivers</span>
              </div>
            </div>

            <div className="space-y-4 px-1">
              {influences.map((item, index) => (
                <div key={index} className="flex flex-col gap-1.5 group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-900 transition-colors truncate">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-[11px] font-black text-slate-900 ml-2">{item.value.toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${item.value}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filtros e Informações Adicionais */}
      {filtrosInfo && (
        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200/60 print:bg-white print:border-slate-100 print:rounded-none">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-slate-400" />
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Parâmetros da Previsão</h4>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 print:grid-cols-4">
            {filtrosInfo.map((filtro, idx) => (
              <div key={idx} className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  {filtro.label}
                </span>
                <span className="text-sm font-bold text-slate-700 leading-tight">
                  {filtro.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rodapé de Ações Rápidas */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 print:hidden">
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-all flex items-center gap-2"
        >
          <Calendar className="w-4 h-4" />
          Nova Simulação
        </button>
        <button 
          onClick={handlePrint}
          className="px-6 py-2.5 rounded-2xl bg-brand-600 text-white text-sm font-bold shadow-soft hover:bg-brand-700 transition-all flex items-center gap-2"
        >
          <Printer className="w-4 h-4" />
          Exportar Relatório
        </button>
      </div>

      {/* Rodapé Exclusivo para Impressão */}
      <div className="hidden print:flex justify-between items-center border-t border-slate-200 pt-6 mt-8">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">© 2026 Tigre Forecasting - Confidencial</p>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Página 1 de 1</p>
      </div>
    </div>
  );
}
