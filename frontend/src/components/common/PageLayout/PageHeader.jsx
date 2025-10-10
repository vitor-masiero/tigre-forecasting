import React from "react";

export default function PageHeader({ title, subtitle, buttons = [] }) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-blue-100">{subtitle}</p>
        </div>
        {buttons.length > 0 && (
          <div className="flex gap-3">
            {buttons.map((button, index) => (
              <button
                key={index}
                onClick={button.onClick}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
              >
                {button.icon && <span className="w-5 h-5">{button.icon}</span>}
                {button.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
