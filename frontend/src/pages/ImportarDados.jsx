import React from "react";
import PageHeader from "../components/ImportarDados/PageHeader";
import UploadCard from "../components/ImportarDados/UploadCard";
import ScriptsCard from "../components/ImportarDados/ScriptsCard";
import ImportHistoryTable from "../components/ImportarDados/ImportHistoryTable";
import DataValidationCard from "../components/ImportarDados/DataValidationCard";

export default function ImportarDados() {
  return (
    <div className="flex-1 overflow-y-auto">
      <PageHeader />
      <div className="px-8 -mt-6 pb-8">
        <div className="grid grid-cols-3 gap-6 mb-6">
          <UploadCard />
          <ScriptsCard />
        </div>
        <ImportHistoryTable />
        <DataValidationCard />
      </div>
    </div>
  );
}
