import React from "react";
import PageHeader from "../components/Automacoes/PageHeader";
import MetricsCards from "../components/Automacoes/MetricsCards";
import NextExecution from "../components/Automacoes/NextExecution";
import ConfigurationsTable from "../components/Automacoes/ConfigurationsTable";
import QuickConfiguration from "../components/Automacoes/QuickConfiguration";

export default function Automacoes() {
  return (
    <div className="flex-1 overflow-y-auto">
      <PageHeader />
      <div className="px-8 -mt-6 pb-8">
        <MetricsCards />
        <div className="grid grid-cols-3 gap-6 mb-6">
          <NextExecution />
        </div>
        <ConfigurationsTable />
        <QuickConfiguration />
      </div>
    </div>
  );
}
