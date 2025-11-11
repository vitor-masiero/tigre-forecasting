import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Step5Result({ jsonPredict }) {
  const chartRef = useRef(null);
  const pieChartRef = useRef(null);

  const getWmapeColor = (wmape) => {
    if (!wmape) return null;
    if (wmape <= 30) return 'bg-emerald-100 text-emerald-800';
    if (wmape <= 50) return 'bg-yellow-100 text-yellow-800';
    if (wmape <= 70) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const retornaAgregacao = (agr) => {
    switch (agr) {
      case "familia":
        return "Linha";
      case "processo":
        return "Processo";
      case "combined":
        return "Combinação";
      case "all_products":
        return "Todos";
      default:
        return "Combinação";
    }
  };

  // Função para traduzir nomes das features
  const traduzirFeature = (nome) => {
    const traducoes = {
      growth_rate: "Taxa de crescimento",
      rolling_mean: "Média móvel",
      rolling_std: "Desvio padrão móvel",
      trend: "Tendência",
      lag: "Defasagem",
      selic: "Taxa Selic",
      incc: "Índice INCC",
      month: "Mês",
      month_sin: "Seno do mês",
      month_cos: "Cosseno do mês",
      day_of_year: "Dia do ano",
      quarter: "Trimestre",
      year: "Ano",
      week_of_year: "Semana do ano",
      quarter_sin: "Seno do trimestre",
      quarter_cos: "Cosseno do trimestre",
      is_holiday: "Feriado",
    };

    const match = nome.match(/([a-z_]+)_(\d+)/);
    if (match) {
      const base = traducoes[match[1]] || match[1];
      return `${base} de ${match[2]} meses`;
    }

    return traducoes[nome] || nome;
  };

  // Gráfico de linhas principal (previsão + tendência)
  useEffect(() => {
    if (!jsonPredict?.preview) return;

    const ctx = chartRef.current.getContext('2d');
    const labels = jsonPredict.preview.map(item =>
      format(new Date(item.ds), "d 'de' MMMM 'de' yyyy", { locale: ptBR })
    );
    const data = jsonPredict.preview.map(item => item.yhat);

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Previsão',
            data,
            borderColor: 'rgb(79, 70, 229)',
            backgroundColor: 'rgba(79, 70, 229, 0.1)',
            tension: 0.1,
            fill: true
          },
          {
            label: 'Tendência',
            data: (() => {
              const firstValue = jsonPredict.metrics.trend.first_value;
              const lastValue = jsonPredict.metrics.trend.last_value;
              const n = labels.length;
              const trendData = [];
              for (let i = 0; i < n; i++) {
                const value = firstValue + (lastValue - firstValue) * (i / (n - 1));
                trendData.push(value);
              }
              return trendData;
            })(),
            borderColor: 'rgb(239, 68, 68)',
            borderDash: [6, 6],
            pointRadius: 0,
            borderWidth: 2,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Gráfico da Previsão com Tendência' }
        },
        scales: { y: { beginAtZero: false } }
      }
    });

    return () => chart.destroy();
  }, [jsonPredict]);

  // Gráfico de pizza das importâncias
  useEffect(() => {
    if (!jsonPredict?.metrics?.feature_importance) return;

    const features = jsonPredict.metrics.feature_importance
      .filter(f => f.importance_pct > 0);

    if (!features.length) return;

    const ctx = pieChartRef.current.getContext('2d');
    const labels = features.map(f => traduzirFeature(f.feature));
    const data = features.map(f => f.importance_pct);

    const backgroundColors = labels.map((_, i) =>
      `hsl(${(i * 40) % 360}, 70%, 60%)`
    );

    const chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            label: 'Importância (%)',
            data,
            backgroundColor: backgroundColors,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
          },
          title: {
            display: true,
            text: 'Importância das Variáveis (%)',
          },
        },
      },
    });

    return () => chart.destroy();
  }, [jsonPredict]);

  if (!jsonPredict) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        {jsonPredict.run_id && (
          <span className="text-sm text-gray-400/60">ID: {jsonPredict.run_id}</span>
        )}
        {jsonPredict.time && (
          <div className="bg-indigo-50 px-4 py-2 rounded-lg">
            <span className="text-indigo-700 font-medium">
              Tempo de execução: {jsonPredict.time.toFixed(3)}s
            </span>
          </div>
        )}
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {jsonPredict.metrics['WMAPE (%)'] && (
          <div
            className={`rounded-xl p-6 shadow-sm transition-all hover:shadow-md ${getWmapeColor(
              jsonPredict.metrics['WMAPE (%)']
            )}`}
          >
            <p className="text-sm font-medium mb-1">WMAPE</p>
            <p className="text-3xl font-bold">
              {jsonPredict.metrics['WMAPE (%)'].toFixed(2)}%
            </p>
          </div>
        )}

        {jsonPredict.model_used && (
          <div className="bg-blue-200/50 rounded-xl p-6 shadow-sm transition-all hover:shadow-md">
            <p className="text-sm text-blue-800 font-medium mb-1">Modelo</p>
            <p className="text-xl text-blue-900 font-semibold">
              {jsonPredict.model_used}
            </p>
            {jsonPredict.auto_selected !== undefined && (
              <p className="text-sm text-blue-700 mt-2">
                {jsonPredict.auto_selected ? 'Seleção Automática' : 'Seleção Manual'}
              </p>
            )}
          </div>
        )}

        {jsonPredict.aggregation_info?.skus_count && (
          <div className="bg-purple-200/50 rounded-xl p-6 shadow-sm transition-all hover:shadow-md">
            <p className="text-sm text-purple-800 font-medium mb-1">SKUs</p>
            <p className="text-xl text-purple-900 font-semibold">
              {jsonPredict.aggregation_info.skus_count.toLocaleString()}
            </p>
            {jsonPredict.aggregation_info.type && (
              <p className="text-sm text-purple-700 mt-2">
                Agregação: {retornaAgregacao(jsonPredict.aggregation_info.type)}
              </p>
            )}
          </div>
        )}
      </div>

      {/* GRÁFICO DE PREVISÃO */}
      {jsonPredict.preview && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <canvas ref={chartRef} />
        </div>
      )}

      {/* GRÁFICO DE IMPORTÂNCIA */}
      {jsonPredict.metrics?.feature_importance && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-10">
          <canvas ref={pieChartRef} />
        </div>
      )}
    </div>
  );
}
