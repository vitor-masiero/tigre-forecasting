import React from "react";
import SourceIcon from "./SourceIcon";

export default function TableRow({
  name,
  description,
  icon,
  type,
  lastSync,
  records,
  status,
}) {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "ativo":
        return "bg-emerald-100 text-emerald-800";
      case "pendente":
        return "bg-orange-100 text-orange-800";
      case "erro":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <tr className="hover:bg-gray-50 transition">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <SourceIcon icon={icon} />
          <div>
            <div className="text-sm font-medium text-gray-900">{name}</div>
            <div className="text-xs text-gray-500">{description}</div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4">
        <span className="text-sm text-gray-900">{type}</span>
      </td>

      <td className="px-6 py-4">
        <span className="text-sm text-gray-900">{lastSync}</span>
      </td>

      <td className="px-6 py-4">
        <span className="text-sm text-gray-900">{records}</span>
      </td>

      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
            status
          )}`}
        >
          {status}
        </span>
      </td>

      <td className="px-6 py-4">
        <button className="text-blue-600 hover:text-blue-800 transition p-1">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      </td>
    </tr>
  );
}
