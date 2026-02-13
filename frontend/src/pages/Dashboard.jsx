import React, { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import MetricsCards from "../components/Metrics/MetricsCards";
import ChartsSection from "../components/Charts/ChartsSection";
import BottomSection from "../components/Bottom/BottomSection";
import api from "../utils/Api";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.post('/predict', {
          aggregation_type: "all",
          model: "XGBoost",
          periods: 12
        }, {
          headers: {
            "Content-Type": "application/json"
          }
        });

        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex-1 overflow-y-auto">
      <Header
        title="Dashboard de Previsões"
        subtitle="Análise e previsões de vendas inteligentes"
        showButtons={true}
      />
      <div className="px-8 -mt-6 pb-8">
        <MetricsCards data={data} loading={loading} />
        <ChartsSection data={data} loading={loading} />
        <BottomSection data={data} loading={loading} />
      </div>
    </div>
  );
}
