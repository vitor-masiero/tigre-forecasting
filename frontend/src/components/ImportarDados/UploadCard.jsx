import React, { useState } from "react";
import FileUploadZone from "./FileUploadZone";

export default function UploadCard() {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    console.log("Arquivos soltos:", e.dataTransfer.files);
  };

  return (
    <div className="col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Upload de Arquivo
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Arraste arquivos ou clique para selecionar
      </p>

      <FileUploadZone
        dragActive={dragActive}
        handleDrag={handleDrag}
        handleDrop={handleDrop}
      />
    </div>
  );
}
