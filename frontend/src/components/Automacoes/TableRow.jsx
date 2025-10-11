import React from "react";

export default function TableRow({
  name,
  details,
  frequency,
  lastExecution,
  nextExecution,
  status,
}) {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "ativo":
        return "bg-emerald-100 text-emerald-800";
      case "erro":
        return "bg-red-100 text-red-800";
      case "pausado":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getActionIcon = (status) => {
    if (status.toLowerCase() === "erro") {
      return (
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
            d="M12 9v2m0 4v2m0-12a9 9 0 110 18 9 9 0 010-18z"
          />
        </svg>
      );
    }
    return (
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
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
    );
  };

  return (
    <tr className="hover:bg-gray-50 transition">
      {/* Nome */}
      <td className="px-6 py-4">
        <div className="text-sm font-medium text-gray-900">{name}</div>
        <div className="text-xs text-gray-500">{details}</div>
      </td>

      {/* Frequência */}
      <td className="px-6 py-4">
        <span className="text-sm text-gray-900">{frequency}</span>
      </td>

      {/* Última Execução */}
      <td className="px-6 py-4">
        <span className="text-sm text-gray-900">{lastExecution}</span>
      </td>

      {/* Próxima */}
      <td className="px-6 py-4">
        <span className="text-sm text-gray-900">{nextExecution}</span>
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
            status
          )}`}
        >
          {status}
        </span>
      </td>

      {/* Ações */}
      <td className="px-6 py-4">
        <button className="text-blue-600 hover:text-blue-800 transition p-1">
          {getActionIcon(status)}
        </button>
      </td>
    </tr>
  );
}
