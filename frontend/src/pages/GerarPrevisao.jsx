import React from "react";
import PageHeader from "../components/GerarPrevisao/PageHeader";
import ConfigurationCard from "../components/GerarPrevisao/ConfigurationCard";
import PreviewCard from "../components/GerarPrevisao/PreviewCard";

export default function GerarPrevisao() {
  return (
    <div className="flex-1 overflow-y-auto">
      <PageHeader />
      <div className="px-8 -mt-6 pb-8">
        <ConfigurationCard />
        <PreviewCard />
      </div>
    </div>
  );
}
