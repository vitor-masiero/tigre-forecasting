import React from "react";

export default function TableRow({
  date,
  time,
  name,
  details,
  model,
  skus,
  wmape,
  status,
}) {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "concluído":
        return "bg-emerald-100 text-emerald-800";
      case "revisão":
        return "bg-orange-100 text-orange-800";
      case "executando":
        return "bg-blue-100 text-blue-800";
      case "erro":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getWmapeColor = (wmape) => {
    const value = parseFloat(wmape);
    if (value < 10) return "text-emerald-600";
    if (value < 15) return "text-blue-600";
    return "text-orange-600";
  };

  return (
    <tr className="hover:bg-gray-50 transition">
      {/* Data */}
      <td className="px-6 py-4">
        <div className="text-sm font-medium text-gray-900">{date}</div>
        <div className="text-xs text-gray-500">{time}</div>
      </td>

      {/* Nome */}
      <td className="px-6 py-4">
        <div className="text-sm font-medium text-gray-900">{name}</div>
        <div className="text-xs text-gray-500">{details}</div>
      </td>

      {/* Modelo */}
      <td className="px-6 py-4">
        <span className="text-sm text-gray-900">{model}</span>
      </td>

      {/* SKUs */}
      <td className="px-6 py-4">
        <span className="text-sm text-gray-900">{skus}</span>
      </td>

      {/* WMAPE */}
      <td className="px-6 py-4">
        <span className={`text-sm font-semibold ${getWmapeColor(wmape)}`}>
          {wmape}
        </span>
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
        <button className="text-blue-600 hover:text-blue-800 transition">
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
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </button>
      </td>
    </tr>
  );
}
