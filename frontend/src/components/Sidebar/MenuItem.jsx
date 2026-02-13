import React from "react";

export default function MenuItem({ icon: Icon, label, active, onClick, theme = "light" }) {
  const isDark = theme === "dark";
  
  const baseClasses =
    "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer group";
  
  const activeClasses = isDark
    ? active 
      ? "text-white bg-brand-600 shadow-lg shadow-brand-900/40" 
      : "text-slate-400 hover:text-white hover:bg-slate-900"
    : active
      ? "text-brand-700 bg-brand-50"
      : "text-gray-600 hover:bg-gray-50";

  const renderIcon = () => {
    if (typeof Icon === "string") {
      // Keep legacy support but we should move to Lucide components
      return null; 
    }
    return <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`} />;
  };

  return (
    <div onClick={onClick} className={`${baseClasses} ${activeClasses}`}>
      {renderIcon()}
      <span className={`text-sm ${active ? "font-semibold" : "font-medium"}`}>{label}</span>
      {active && isDark && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
      )}
    </div>
  );
}
