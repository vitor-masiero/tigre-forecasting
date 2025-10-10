import React from "react";

export default function ActionButton({
  label,
  icon: Icon,
  onClick,
  variant = "primary",
  size = "md",
  fullWidth = false,
}) {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700",
    outline: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const widthClass = fullWidth ? "w-full" : "w-auto";

  return (
    <button
      onClick={onClick}
      className={`${widthClass} ${variants[variant]} ${sizes[size]} rounded-lg flex items-center gap-2 transition font-medium`}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {label}
    </button>
  );
}
