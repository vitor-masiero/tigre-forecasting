import React from "react";

export default function HistoryTableRow({
  filename,
  filesize,
  date,
  records,
  status,
  fileIcon,
}) {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "sucesso":
        return "bg-emerald-100 text-emerald-800";
      case "com erros":
        return "bg-orange-100 text-orange-800";
      case "processando":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getFileIcon = () => {
    if (fileIcon === "excel") {
      return (
        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
          <svg
            className="w-5 h-5 text-emerald-600"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
          </svg>
        </div>
      );
    }
    return (
      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
        <svg
          className="w-5 h-5 text-blue-600"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
        </svg>
      </div>
    );
  };

  return (
    <tr className="hover:bg-gray-50 transition">
      {/* Arquivo */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {getFileIcon()}
          <div>
            <div className="text-sm font-medium text-gray-900">{filename}</div>
            <div className="text-xs text-gray-500">{filesize}</div>
          </div>
        </div>
      </td>

      {/* Data */}
      <td className="px-6 py-4">
        <span className="text-sm text-gray-900">{date}</span>
      </td>

      {/* Registros */}
      <td className="px-6 py-4">
        <span className="text-sm text-gray-900">{records}</span>
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
