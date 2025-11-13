import React from "react";
import { BarChart3 } from "lucide-react";

export default function Logo() {
  return (
    <div className="p-6 border-b border-gray-200">
      <div className="flex items-center gap-2">
        <BarChart3 className="w-6 h-6 text-blue-600" />
        <span className="text-xl font-semibold text-gray-800">Tigre Vision Pro</span>
      </div>
    </div>
  );
}
