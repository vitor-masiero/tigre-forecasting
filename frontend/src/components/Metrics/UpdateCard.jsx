import React from "react";
import { Clock, RefreshCw } from "lucide-react";

export default function UpdateCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
      <div className="flex justify-between items-start mb-4">
        <div className="text-sm font-medium text-gray-500 uppercase">
          Última Atualização
        </div>
        <div className="bg-orange-500 p-2 rounded-lg">
          <Clock className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="text-4xl font-bold text-gray-900 mb-2">2h</div>
      <div className="flex items-center gap-1 text-gray-600">
        <RefreshCw className="w-4 h-4" />
        <span className="text-sm font-medium">Sincronizado</span>
      </div>
    </div>
  );
}
