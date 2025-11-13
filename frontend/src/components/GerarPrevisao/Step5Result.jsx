import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function Step5Result({ jsonPredict }) {
  const chartRef = useRef(null);
  const pieChartRef = useRef(null);
  const chartInstance = useRef(null);
  const pieChartInstance = useRef(null);

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
      return `${base} de ${matchNumero[2]}m`;
    }

    const matchValue = nome.match(/(.+)_value$/);
    if (matchValue) {
      const nomeVariavel = matchValue[1];
      const palavras = nomeVariavel.split('_').map(palavra => {
        return palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase();
      });
      return palavras.join(' ');
    }

    return traducoes[nome] || nome;
  };

  // Função para formatar dados de filtros
  const getFiltrosInfo = () => {
    if (!jsonPredict?.aggregation_info) return null;

    const info = jsonPredict.aggregation_info;
    const filtros = [];

    // Processos
    if (info.processo && info.processo.length > 0) {
      filtros.push({
        label: 'Processos',
        value: info.processo.sort().join(', ')
      });
    } else if (info.processos_included && info.processos_included.length > 0) {
      filtros.push({
        label: 'Processos',
        value: info.processos_included.sort().join(', ')
      });
    }

    // Linhas (Famílias)
    if (info.familia && info.familia.length > 0) {
      filtros.push({
        label: 'Linhas',
        value: info.familia.sort().join(', ')
      });
    } else if (info.familias_included && info.familias_included.length > 0) {
      filtros.push({
        label: 'Linhas',
        value: info.familias_included.sort().join(', ')
      });
    } else if (info.familias && info.familias.length > 0) {
      filtros.push({
        label: 'Linhas',
        value: info.familias.sort().join(', ')
      });
    }

    // ABC
    if (info.abc_class && info.abc_class.length > 0) {
      filtros.push({
        label: 'ABC',
        value: info.abc_class.sort().join(', ')
      });
    }

    // Período (Date Range)
    if (info.date_range) {
      const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR');
      };
      filtros.push({
        label: 'Período',
        value: `${formatDate(info.date_range.start)} - ${formatDate(info.date_range.end)}`
      });
    }

    return filtros.length > 0 ? filtros : null;
  };

  useEffect(() => {
    if (!jsonPredict?.preview || !chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const labels = jsonPredict.preview.map(item => {
      const date = new Date(item.ds);
      const month = date.toLocaleString('pt-BR', { month: 'short' });
      const year = date.getFullYear().toString().slice(2);
      return `${month}/${year}`;
    });
    const data = jsonPredict.preview.map(item => item.yhat);

    const firstValue = jsonPredict.metrics.trend.first_value;
    const lastValue = jsonPredict.metrics.trend.last_value;
    const n = labels.length;
    const trendData = [];
    for (let i = 0; i < n; i++) {
      const value = firstValue + (lastValue - firstValue) * (i / (n - 1));
      trendData.push(value);
    }

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Previsão',
            data,
            borderColor: 'rgb(79, 70, 229)',
            backgroundColor: 'rgba(79, 70, 229, 0.1)',
            tension: 0.4,
            fill: true,
            borderWidth: 2
          },
          {
            label: 'Tendência',
            data: trendData,
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
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 15,
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += new Intl.NumberFormat('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }).format(context.parsed.y);
                }
                return label;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            ticks: {
              callback: function(value) {
                return new Intl.NumberFormat('pt-BR', {
                  notation: 'compact',
                  compactDisplay: 'short'
                }).format(value);
              }
            }
          },
          x: {
            grid: {
              display: false,
            },
          }
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [jsonPredict]);

  useEffect(() => {
    if (!jsonPredict?.metrics?.feature_importance || !pieChartRef.current) return;

    const features = jsonPredict.metrics.feature_importance
      .filter(f => f.importance_pct > 0);

    if (!features.length) return;

    const ctx = pieChartRef.current.getContext('2d');

    if (pieChartInstance.current) {
      pieChartInstance.current.destroy();
    }

    const labels = features.map(f => `${traduzirFeature(f.feature)} (${f.importance_pct.toFixed(1)}%)`);
    const data = features.map(f => f.importance_pct);

    const backgroundColors = features.map((_, i) => {
      const hue = (i * 360 / features.length) % 360;
      return `hsl(${hue}, 70%, 60%)`;
    });

    pieChartInstance.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            label: 'Importância (%)',
            data,
            backgroundColor: backgroundColors,
            borderWidth: 2,
            borderColor: '#fff'
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              padding: 15,
              font: {
                size: 12
              }
            }
          }
        },
      },
    });

    return () => {
      if (pieChartInstance.current) {
        pieChartInstance.current.destroy();
      }
    };
  }, [jsonPredict]);

  if (!jsonPredict) return null;

  const filtrosInfo = getFiltrosInfo();

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {jsonPredict.metrics?.['WMAPE (%)'] && (
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

        {jsonPredict.metrics?.['Bias (%)'] && (
          <div className="bg-cyan-100 text-cyan-800 rounded-xl p-6 shadow-sm transition-all hover:shadow-md">
            <p className="text-sm font-medium mb-1">Bias</p>
            <p className="text-3xl font-bold">
              {jsonPredict.metrics['Bias (%)'].toFixed(2)}%
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

        {jsonPredict.aggregation_info?.skus_count && jsonPredict.aggregation_info?.type !== "all" && (
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

        {jsonPredict.aggregation_info?.type === "all" && (
          <div className="bg-purple-200/50 rounded-xl p-6 shadow-sm transition-all hover:shadow-md">
            <p className="text-sm text-purple-800 font-medium mb-1">SKUs</p>
            <p className="text-xl text-purple-900 font-semibold">
              Todos
            </p>
          </div>
        )}

        {jsonPredict?.sku && (
          <div className="bg-purple-200/50 rounded-xl p-6 shadow-sm transition-all hover:shadow-md">
            <p className="text-sm text-purple-800 font-medium mb-1">SKU</p>
            <p className="text-xl text-purple-900 font-semibold">
              {jsonPredict.sku}
            </p>
            <p className="text-sm text-purple-700 mt-2">
              SKU Individual
            </p>
          </div>
        )}
      </div>

      {/* Informações de Filtros (Processos, Linhas, ABC, Período) */}
      {filtrosInfo && jsonPredict.aggregation_info?.type !== "all" && (
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm mb-6">
          <h2 className="font-bold text-lg text-gray-800 mb-4">Filtros Aplicados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtrosInfo.map((filtro, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-sm font-medium text-gray-600 mb-1">{filtro.label}</p>
                <p className="text-base font-semibold text-gray-800">{filtro.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GRÁFICO DE PREVISÃO */}
      {jsonPredict.preview && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-6">
          <h1 className="font-bold text-center text-2xl mb-6">Gráfico da Previsão com Tendência</h1>
          <div style={{ height: "350px" }}>
            <canvas ref={chartRef} />
          </div>
        </div>
      )}

      {/* GRÁFICO DE IMPORTÂNCIA */}
      {jsonPredict.metrics?.feature_importance && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h1 className="font-bold text-center text-2xl mb-8">Importância das Variáveis (%)</h1>
          <div style={{ height: "350px" }}>
            <canvas ref={pieChartRef} />
          </div>
        </div>
      )}
    </div>
  );
}
