import React from "react";
import Header from "../components/Header/Header";
import MetricsCards from "../components/Metrics/MetricsCards";
import ChartsSection from "../components/Charts/ChartsSection";
import BottomSection from "../components/Bottom/BottomSection";

export default function Dashboard() {
  return (
    <div className="flex-1 overflow-y-auto">
      <Header
        title="Dashboard de Previsões"
        subtitle="Análise e previsões de vendas inteligentes"
        showButtons={true}
      />
      <div className="px-8 -mt-6 pb-8">
        <MetricsCards />
        <ChartsSection />
        <BottomSection />
      </div>
    </div>
  );
}
