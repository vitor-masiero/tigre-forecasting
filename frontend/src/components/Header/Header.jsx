import React from "react";
import HeaderButtons from "./HeaderButtons";

export default function Header({ title, subtitle, showButtons = false }) {
  return (
    <div className="bg-transparent px-8 py-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight mb-2">
            {title}
          </h1>
          <p className="text-slate-500 font-medium">
            {subtitle}
          </p>
        </div>
        
        {showButtons && (
          <div className="flex items-center gap-3">
            <HeaderButtons />
          </div>
        )}
      </div>
    </div>
  );
}
