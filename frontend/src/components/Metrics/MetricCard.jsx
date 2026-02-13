import React from "react";

export default function MetricCard({
  title,
  value,
  icon: Icon,
  iconBg,
}) {
  return (
    <div className="group bg-white rounded-3xl p-7 border border-slate-200/60 shadow-soft hover:shadow-lg hover:border-brand-200/50 transition-all duration-300 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-slate-50 rounded-full group-hover:bg-brand-50 transition-colors duration-300" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div className="p-3 rounded-2xl bg-slate-50 group-hover:bg-white group-hover:shadow-md transition-all duration-300">
            <Icon className="w-6 h-6 text-slate-400 group-hover:text-brand-600 transition-colors" />
          </div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            {title}
          </div>
        </div>
        
        <div className="flex flex-col">
          <div className="text-3xl font-extrabold text-slate-950 tracking-tight group-hover:text-brand-700 transition-colors">
            {value}
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Dados em tempo real</span>
          </div>
        </div>
      </div>
    </div>
  );
}
