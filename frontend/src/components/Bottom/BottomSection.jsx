import React from "react";
import RecentForecasts from "./RecentForecasts";

export default function BottomSection({ data, loading }) {
  return (
    <div className="grid grid-cols-1 gap-6">
      <RecentForecasts data={data} loading={loading} />
    </div>
  );
}
