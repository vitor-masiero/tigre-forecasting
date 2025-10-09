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

export default function Sidebar() {
  const mainMenuItems = [
    { icon: BarChart3, label: "Dashboard Principal", active: true },
    { icon: "edit", label: "Gerar Previsão", active: false },
    { icon: "refresh", label: "Automações", active: false },
    { icon: Clock, label: "Histórico", active: false },
  ];

  const dataMenuItems = [
    { icon: Database, label: "Fontes de Dados", active: false },
    { icon: Upload, label: "Importar", active: false },
    { icon: FileText, label: "Relatórios", active: false },
  ];

  const configMenuItems = [
    { icon: Settings, label: "Configurações", active: false },
    { icon: Users, label: "Equipe", active: false },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <Logo />
      <div className="flex-1 overflow-y-auto">
        <MenuSection title="Principal" items={mainMenuItems} />
        <MenuSection title="Dados" items={dataMenuItems} />
        <MenuSection title="Configurações" items={configMenuItems} />
      </div>
    </div>
  );
}
