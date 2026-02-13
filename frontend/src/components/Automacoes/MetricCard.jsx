import React from "react";
import { Zap, Calendar, CheckCircle2, Clock } from 'lucide-react';

export default function MetricCard({
  title,
  value,
  trend,
  trendPositive,
  icon,
}) {
  const getIcon = () => {
    switch (icon) {
      case "automation": return <Zap className="w-6 h-6 text-brand-600" />;
      case "calendar": return <Calendar className="w-6 h-6 text-emerald-600" />;
      case "check": return <CheckCircle2 className="w-6 h-6 text-blue-600" />;
      default: return <Clock className="w-6 h-6 text-slate-400" />;
    }
  };

  const getBg = () => {
    switch (icon) {
      case "automation": return "bg-brand-50";
      case "calendar": return "bg-emerald-50";
      case "check": return "bg-blue-50";
      default: return "bg-slate-50";
    }
  };

  return (
    <div className="group bg-white rounded-3xl p-7 border border-slate-200/60 shadow-soft hover:shadow-lg transition-all duration-300 relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className={`p-3 rounded-2xl ${getBg()} group-hover:scale-110 transition-transform duration-300`}>
            {getIcon()}
          </div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
            {title}
          </div>
        </div>
        
        <div className="flex flex-col">
          <div className="text-3xl font-black text-slate-900 tracking-tight group-hover:text-brand-700 transition-colors">
            {value}
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
              trendPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
            }`}>
              {trend}
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter italic">vs mês anterior</span>
          </div>
        </div>
      </div>
      
      {/* Subtle Background Element */}
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-[0.03] group-hover:opacity-[0.08] transition-opacity ${getBg().replace('50', '500')}`} />
    </div>
  );
}
