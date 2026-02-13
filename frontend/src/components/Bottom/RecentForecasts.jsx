import React, { useEffect, useState } from "react";
import ForecastItem from "./ForecastItem";
import api from "../../utils/Api";
import { MOCK_DASHBOARD_DATA } from "../../utils/mockData";

export default function RecentForecasts({ data, loading }) {
  const [forecasts, setForecasts] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/previsoes');
        const predictions = response.data;

        // Pegar apenas os últimos 3
        const recent = predictions.slice(0, 4).map(prediction => {
          const date = new Date(prediction.dt_processamento);
          const formattedDate = date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          });
          const formattedTime = date.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
          });

          return {
            title: prediction.id_previsao,
            details: prediction['SKU/Tipo'] === "aggregated" ? "Agregado" : prediction['SKU/Tipo'] || 'Previsão',
            time: `${formattedDate} ${formattedTime}`,
            status: 'success'
          };
        });

        setForecasts(recent);
        setLoadingHistory(false);
      } catch (error) {
        console.error('Erro ao carregar histórico, usando mocks:', error);
        
        // Fallback para dados mockados formatados
        const mockRecent = MOCK_DASHBOARD_DATA.previsoes_recentes.map(m => ({
          title: m.id,
          details: m.produto,
          time: m.data,
          status: m.status === 'Concluído' ? 'success' : 'pending'
        }));
        
        setForecasts(mockRecent);
        setLoadingHistory(false);
      }
    };

    fetchHistory();
  }, []);

  if (loadingHistory) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
        <div className="flex justify-between space-x-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2 w-48">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>

    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Previsões Recentes
        </h3>
      </div>
      <div className="flex justify-between space-x-4">
        {forecasts.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4 w-full">
            Nenhuma previsão recente encontrada
          </p>
        ) : (
          forecasts.map((forecast, index) => (
            <ForecastItem
              key={index}
              {...forecast}
              isLast={index === forecasts.length - 1}
            />
          ))
        )}
      </div>
    </div>
  );
}
