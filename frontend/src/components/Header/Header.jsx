import React from "react";
import HeaderButtons from "./HeaderButtons";

export default function Header() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard de Previsões</h1>
          <p className="text-blue-100">
            Análise e previsões de vendas inteligentes
          </p>
        </div>
      </div>
    </div>
  );
}
