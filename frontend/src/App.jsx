import React, { useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./pages/Dashboard";
import GerarPrevisao from "./pages/GerarPrevisao";
import Historico from "./pages/Historico";
import Automacoes from "./pages/Automacoes";
import FontesDados from "./pages/FontesDados";

export default function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const renderPage = () => {
    console.log("Página atual:", currentPage); // Para debug

    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "gerar-previsao":
        return <GerarPrevisao />;
      case "historico":
        return <Historico />;
      case "automacoes":
        return <Automacoes />;
      case "fontes-dados":
        return <FontesDados />;
      default:
        return <FontesDados />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="flex-1 flex flex-col">{renderPage()}</div>
    </div>
  );
}
