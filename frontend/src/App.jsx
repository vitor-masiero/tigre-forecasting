import React, { useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./pages/Dashboard";
import GerarPrevisao from "./pages/GerarPrevisao";
import Historico from "./pages/Historico";
import Automacoes from "./pages/Automacoes";

export default function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "gerar-previsao":
        return <GerarPrevisao />;
      case "historico":
        return <Historico />;
      case "automacoes":
        return <Automacoes />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {renderPage()}
    </div>
  );
}
