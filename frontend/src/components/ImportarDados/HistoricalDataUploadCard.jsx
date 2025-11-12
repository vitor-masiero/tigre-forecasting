import { useState } from "react";
import FileUploadZone from "./FileUploadZone";
import api from "../../utils/Api.js";

export default function HistoricalDataUploadCard() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success' | 'error' | null

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

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        setUploadStatus(null);
      }
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        setUploadStatus(null);
      }
    }
  };

  const validateFile = (file) => {
    const validExtensions = ['.csv', '.xls', '.xlsx'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      setUploadStatus('invalid');
      return false;
    }
    return true;
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setUploadStatus(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      await api.post('/upload/historical-data', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadStatus('success');
      setSelectedFile(null);
    } catch (error) {
      console.error('Erro no upload:', error);
      setUploadStatus('error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Importação de Série Histórica
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Arraste o arquivo ou clique para selecionar (CSV, XLS, XLSX)
      </p>

      <FileUploadZone
        dragActive={dragActive}
        handleDrag={handleDrag}
        handleDrop={handleDrop}
        handleFileSelect={handleFileSelect}
        selectedFile={selectedFile}
        uploading={uploading}
        uploadStatus={uploadStatus}
        onCancel={handleCancel}
        onUpload={handleUpload}
      />
    </div>
  );
}
