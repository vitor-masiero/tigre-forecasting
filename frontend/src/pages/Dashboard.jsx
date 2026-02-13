import React, { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import MetricsCards from "../components/Metrics/MetricsCards";
import ChartsSection from "../components/Charts/ChartsSection";
import BottomSection from "../components/Bottom/BottomSection";
import api from "../utils/Api";
import { MOCK_DASHBOARD_DATA } from "../utils/mockData";

export default function Dashboard() {
  const [data, setData] = useState(MOCK_DASHBOARD_DATA); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.post('/predict', {
          aggregation_type: "all",
          model: "XGBoost",
          periods: 12
        }, {
          headers: { "Content-Type": "application/json" }
        });

        if (response.data) {
          setData(response.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar dados reais, mantendo mocks:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex-1 bg-slate-50/50 overflow-y-auto">
      <div className="max-w-[1600px] mx-auto">
        <Header
          title="Visão Geral"
          subtitle="Acompanhamento em tempo real da saúde das suas previsões"
          showButtons={true}
        />
        
        <div className="px-8 pb-12 space-y-8 mt-4">
          <MetricsCards data={data} loading={loading} />
          
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <div className="w-1.5 h-6 bg-brand-600 rounded-full" />
              Análise de Tendências
            </h2>
            <ChartsSection data={data} loading={loading} />
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
              Execuções Recentes
            </h2>
            <BottomSection data={data} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}
