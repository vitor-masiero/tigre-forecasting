import React from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import MetricsCards from "./components/Metrics/MetricsCards";
import ChartsSection from "./components/Charts/ChartsSection";
import BottomSection from "./components/Bottom/BottomSection";
export default function App() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <Header />
        <div className="px-8 -mt-6 pb-8">
          <MetricsCards />
          <ChartsSection />
          <BottomSection />
        </div>
      </div>
    </div>
  );
}
