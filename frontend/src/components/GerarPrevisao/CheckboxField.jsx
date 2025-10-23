import React from "react";

export default function CheckboxField({ id, label, checked, onChange }) {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
      />
      <label
        htmlFor={id}
        className="ml-3 text-sm font-medium text-gray-700 cursor-pointer select-none"
      >
        {label}
      </label>
    </div>
  );
}
