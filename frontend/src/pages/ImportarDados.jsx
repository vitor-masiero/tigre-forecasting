import PageHeader from "../components/ImportarDados/PageHeader";
import DataValidationCard from "../components/ImportarDados/DataValidationCard";
import ExternalVariablesUploadCard from "../components/ImportarDados/ExternalVariablesUploadCard";
import HistoricalDataUploadCard from "../components/ImportarDados/HistoricalDataUploadCard";

export default function ImportarDados() {
  return (
    <div className="flex-1 overflow-y-auto">
      <PageHeader />
      <div className="px-8 -mt-6 pb-8">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <ExternalVariablesUploadCard />
          <HistoricalDataUploadCard />
        </div>
      </div>
    </div>
  );
}
