import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function SalesChart({ data, loading }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!data?.preview || !chartRef.current) return;

    const ctx = chartRef.current.getContext("2d");

    // Destruir gráfico anterior se existir
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const labels = data.preview.map((item) => {
      const date = new Date(item.ds);
      const month = date.toLocaleString('pt-BR', { month: 'short' });
      const year = date.getFullYear().toString().slice(2);
      return `${month}/${year}`;
    });
    const previsaoData = data.preview.map((item) => item.yhat);

    // Calcular linha de tendência
    const firstValue = data.metrics?.trend?.first_value || previsaoData[0];
    const lastValue = data.metrics?.trend?.last_value || previsaoData[previsaoData.length - 1];
    const n = labels.length;
    const trendData = [];
    for (let i = 0; i < n; i++) {
      const value = firstValue + (lastValue - firstValue) * (i / (n - 1));
      trendData.push(value);
    }

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Previsão",
            data: previsaoData,
            borderColor: "rgb(79, 70, 229)",
            backgroundColor: "rgba(79, 70, 229, 0.1)",
            tension: 0.4,
            fill: true,
            borderWidth: 2,
          },
          {
            label: "Tendência",
            data: trendData,
            borderColor: "rgb(239, 68, 68)",
            borderDash: [6, 6],
            pointRadius: 0,
            borderWidth: 2,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            labels: {
              usePointStyle: true,
              padding: 15,
            },
          },
          tooltip: {
            mode: "index",
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
          },
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
          },
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  if (loading) {
    return (
      <div className="col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
        <div className="bg-gray-100 rounded-lg" style={{ height: "280px" }}></div>
      </div>
    );
  }

  return (
    <div className="col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Previsão de Vendas
          </h3>
          <p className="text-sm text-gray-500">
            Valores previstos com linha de tendência
          </p>
        </div>
      </div>
      <div style={{ height: "280px" }}>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}
