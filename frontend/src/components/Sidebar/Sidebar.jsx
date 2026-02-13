import React from "react";
import {
  Settings,
  Upload,
  Clock,
  Sparkles,
  Layers,
  LayoutDashboard
} from "lucide-react";
import Logo from "./Logo";
import MenuSection from "./MenuSection";

export default function Sidebar({ currentPage, setCurrentPage }) {
  const mainMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", page: "dashboard" },
    { icon: Sparkles, label: "Gerar Previsão", page: "gerar-previsao" },
    { icon: Clock, label: "Histórico", page: "historico" },
  ];

  const dataMenuItems = [
    { icon: Upload, label: "Importar", page: "importar-dados" },
  ];

  const configMenuItems = [
    { icon: Layers, label: "Automações", page: "automacoes" },
    { icon: Settings, label: "Configurações", page: "configuracoes" },
  ];

  return (
    <div className="w-72 bg-slate-950 text-slate-300 flex flex-col h-screen border-r border-slate-800 shadow-xl">
      <div className="p-6 mb-2">
        <Logo variant="dark" />
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 space-y-8 scrollbar-hide">
        <MenuSection
          title="Principal"
          items={mainMenuItems}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          theme="dark"
        />
        <MenuSection
          title="Dados & Ativos"
          items={dataMenuItems}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          theme="dark"
        />
        <MenuSection
          title="Sistema"
          items={configMenuItems}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          theme="dark"
        />
      </div>

      <div className="p-4 mt-auto border-t border-slate-800/50">
        <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl p-4 shadow-lg shadow-brand-900/20">
          <p className="text-white text-xs font-semibold mb-1">Versão Enterprise</p>
          <p className="text-brand-100 text-[10px] leading-relaxed">
            Sua organização está utilizando o módulo avançado de forecasting.
          </p>
        </div>
      </div>
    </div>
  );
}
