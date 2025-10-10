import React from "react";
import PageHeader from "../components/FontesDados/PageHeader";
import FontesMetricsCards from "../components/FontesDados/FontesMetricsCards";
import ConfiguredSourcesTable from "../components/FontesDados/ConfiguredSourcesTable";
import SourceTypesCard from "../components/FontesDados/SourceTypesCard";
import MonitoringCard from "../components/FontesDados/MonitoringCard";

export default function FontesDados() {
  console.log("FontesDados página renderizada");

  return (
    <div className="flex-1 overflow-y-auto">
      <PageHeader />
      <div className="px-8 -mt-6 pb-8">
        <FontesMetricsCards />
        <ConfiguredSourcesTable />
        <div className="grid grid-cols-2 gap-6">
          <SourceTypesCard />
          <MonitoringCard />
        </div>
      </div>
    </div>
  );
}
