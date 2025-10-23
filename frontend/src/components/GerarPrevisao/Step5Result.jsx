import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Step5Result({ jsonPredict }) {
  const chartRef = useRef(null);

  const getWmapeColor = (wmape) => {
    if (!wmape) return null;
    if (wmape <= 30) return 'bg-emerald-100 text-emerald-800';
    if (wmape <= 50) return 'bg-yellow-100 text-yellow-800';
    if (wmape <= 70) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const retornaAgregacao = (agr) => {
    console.log(agr);
    switch(agr) {
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
  }

  useEffect(() => {
    if (!jsonPredict?.preview) return;

    const ctx = chartRef.current.getContext('2d');
    const labels = jsonPredict.preview.map(item =>
      format(new Date(item.ds), "d 'de' MMMM 'de' yyyy", { locale: ptBR })
    );
    const data = jsonPredict.preview.map(item => item.trend);

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Tendência',
          data,
          borderColor: 'rgb(79, 70, 229)',
          backgroundColor: 'rgba(79, 70, 229, 0.1)',
          tension: 0.1,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Previsão de Tendência'
          }
        },
        scales: {
          y: {
            beginAtZero: false
          }
        }
      }
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {jsonPredict.wmape && (
          <div className={`rounded-xl p-6 shadow-sm transition-all hover:shadow-md ${getWmapeColor(jsonPredict.wmape)}`}>
            <p className="text-sm font-medium mb-1">WMAPE</p>
            <p className="text-3xl font-bold">{jsonPredict.wmape.toFixed(2)}%</p>
          </div>
        )}

        {jsonPredict.model_used && (
          <div className="bg-blue-200/50 rounded-xl p-6 shadow-sm transition-all hover:shadow-md">
            <p className="text-sm text-blue-800 font-medium mb-1">Modelo</p>
            <p className="text-xl text-blue-900 font-semibold">{jsonPredict.model_used}</p>
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

        {jsonPredict.aggregation_info?.type === "all_products" && (
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

{jsonPredict.aggregation_info && (
  <div className="mb-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 shadow-sm">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalhes da Agregação</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {jsonPredict.aggregation_info.date_range && (
        <div>
          <p className="text-sm text-gray-600">Período</p>
          <p className="font-medium">
            {`${format(new Date(jsonPredict.aggregation_info.date_range.start), "dd/MM/yyyy")} - ${format(new Date(jsonPredict.aggregation_info.date_range.end), "dd/MM/yyyy")}`}
          </p>
        </div>
      )}
      {jsonPredict.aggregation_info.total_quantity && (
        <div>
          <p className="text-sm text-gray-600">Quantidade Total</p>
          <p className="font-medium">{jsonPredict.aggregation_info.total_quantity.toLocaleString()}</p>
        </div>
      )}

      <div className="col-span-2 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {jsonPredict.aggregation_info.familia && (
            <div className="border border-gray-200 rounded-lg p-6">
              <p className="text-sm text-gray-600 mb-1">Linha</p>
              <p className="font-medium text-indigo-700">{jsonPredict.aggregation_info.familia}</p>
            </div>
          )}
          {jsonPredict.aggregation_info.processo && (
            <div className="border border-gray-200 rounded-lg p-6">
              <p className="text-sm text-gray-600 mb-1">Processo</p>
              <p className="font-medium text-indigo-700">{jsonPredict.aggregation_info.processo}</p>
            </div>
          )}
          {jsonPredict.aggregation_info.abc_class && (
            <div className="border border-gray-200 rounded-lg p-6">
              <p className="text-sm text-gray-600 mb-1">Classe ABC</p>
              <p className="font-medium text-indigo-700">{jsonPredict.aggregation_info.abc_class}</p>
            </div>
          )}
        </div>

        {(jsonPredict.aggregation_info.familias ||
          jsonPredict.aggregation_info.processos ||
          jsonPredict.aggregation_info.skus) && (
          <div className="space-y-4">
            {jsonPredict.aggregation_info.familias && (
              <div className="border border-gray-200 rounded-lg p-6">
                <p className="text-sm text-gray-600 mb-2">Linhas Selecionadas</p>
                <div className="flex flex-wrap gap-2">
                  {jsonPredict.aggregation_info.familias.map((familia, index) => (
                    <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                      {familia}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {jsonPredict.aggregation_info.processos && (
              <div className="border border-gray-200 rounded-lg p-6">
                <p className="text-sm text-gray-600 mb-2">Processos Selecionados</p>
                <div className="flex flex-wrap gap-2">
                  {jsonPredict.aggregation_info.processos.map((processo, index) => (
                    <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      {processo}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {jsonPredict.aggregation_info.skus && (
              <div className="border border-gray-200 rounded-lg p-6">
                <p className="text-sm text-gray-600 mb-2">SKUs Selecionados</p>
                <div className="flex flex-wrap gap-2">
                  {jsonPredict.aggregation_info.skus.map((sku, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {sku}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
)}

      {jsonPredict.preview && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <canvas ref={chartRef} />
        </div>
      )}
    </div>
  );
}
