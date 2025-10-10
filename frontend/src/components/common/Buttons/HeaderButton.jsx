import React from "react";

export default function HeaderButton({ label, icon: Icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
    >
      {Icon && <Icon className="w-5 h-5" />}
      {label}
    </button>
  );
}
