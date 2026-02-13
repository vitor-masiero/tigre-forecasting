import React from "react";
import SalesChart from "./SalesChart";
import InfluenceChart from "./InfluenceChart";

export default function ChartsSection({ data, loading }) {
  return (
    <>
      <div className="grid grid-cols-3 gap-6 mb-6">
        <SalesChart data={data} loading={loading} />
        <InfluenceChart data={data} loading={loading} />
      </div>
    </>
  );
}
