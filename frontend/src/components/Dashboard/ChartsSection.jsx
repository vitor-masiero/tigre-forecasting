import React from "react";
import SalesChart from "./SalesChart";
import QuickActions from "./QuickActions";
import UpdateCard from "../Metrics/UpdateCard";

export default function ChartsSection() {
  return (
    <>
      <UpdateCard />
      <div className="grid grid-cols-3 gap-6 mb-6">
        <SalesChart />
        <QuickActions />
      </div>
    </>
  );
}
