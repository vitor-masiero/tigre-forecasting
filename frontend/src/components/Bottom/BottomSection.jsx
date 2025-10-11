import React from "react";
import ModelPrecision from "./ModelPrecision";
import InfluenceFactors from "./InfluenceFactors";
import RecentForecasts from "./RecentForecasts";

export default function BottomSection() {
  return (
    <div className="grid grid-cols-3 gap-6">
      <ModelPrecision />
      <InfluenceFactors />
      <RecentForecasts />
    </div>
  );
}
