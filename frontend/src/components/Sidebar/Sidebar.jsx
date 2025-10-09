import React from "react";
import {
  BarChart3,
  Settings,
  Users,
  FileText,
  Database,
  Upload,
  Clock,
} from "lucide-react";
import Logo from "./Logo";
import MenuItem from "./MenuItem";
import MenuSection from "./MenuSection";

export default function Sidebar({ currentPage, setCurrentPage }) {
  const mainMenuItems = [
    { icon: BarChart3, label: "Dashboard Principal", page: "dashboard" },
    { icon: "edit", label: "Gerar Previsão", page: "gerar-previsao" },
    { icon: "refresh", label: "Automações", page: "automacoes" },
    { icon: Clock, label: "Histórico", page: "historico" },
  ];

  const dataMenuItems = [
    { icon: Database, label: "Fontes de Dados", page: "fontes" },
    { icon: Upload, label: "Importar", page: "importar" },
    { icon: FileText, label: "Relatórios", page: "relatorios" },
  ];

  const configMenuItems = [
    { icon: Settings, label: "Configurações", page: "configuracoes" },
    { icon: Users, label: "Equipe", page: "equipe" },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <Logo />
      <div className="flex-1 overflow-y-auto">
        <MenuSection
          title="Principal"
          items={mainMenuItems}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
        <MenuSection
          title="Dados"
          items={dataMenuItems}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
        <MenuSection
          title="Configurações"
          items={configMenuItems}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
}
