import React from "react";
import SalesChart from "./SalesChart";
import UpdateCard from "../Metrics/UpdateCard";
import InfluenceChart from "./QuickActions";

export default function ChartsSection() {
  return (
    <>
      <UpdateCard />
      <div className="grid grid-cols-3 gap-6 mb-6">
        <SalesChart />
        <InfluenceChart />
      </div>
    </>
  );
}
