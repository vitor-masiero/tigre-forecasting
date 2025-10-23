import React from "react";
import PageHeader from "../components/Historico/PageHeader";
import FiltersCard from "../components/Historico/FiltersCard";
import HistoryTable from "../components/Historico/HistoryTable";

export default function Historico() {
  return (
    <div className="flex-1 overflow-y-auto">
      <PageHeader />
      <div className="px-8 -mt-6 pb-8">
        <FiltersCard />
        <HistoryTable />
      </div>
    </div>
  );
}
