import React, { useRef } from "react";

export default function FileUploadZone({
  dragActive,
  handleDrag,
  handleDrop,
  handleFileSelect,
  selectedFile,
  uploading,
  uploadStatus,
  onCancel,
  onUpload,
  featureName,
  setFeatureName,
  nameError,
  setNameError,
}) {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    if (!selectedFile && !uploadStatus) {
      fileInputRef.current?.click();
    }
  };

  // Estado inicial ou após cancelar
  if (!selectedFile && !uploadStatus) {
    return (
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`border-2 border-dashed rounded-xl p-12 text-center transition cursor-pointer ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-gray-50 hover:border-gray-400"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xls,.xlsx"
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center">
          <svg
            className="w-16 h-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Arraste seus arquivos aqui
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Suporte para CSV, Excel (.xlsx, .xls)
          </p>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition font-medium"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
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
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7m-6 -2h6m0 0a1 1 0 00-1-1H9a1 1 0 00-1 1m6 0v2m0-2H9v2"
              />
            </svg>
            Selecionar Arquivo
          </button>
        </div>
      </div>
    );
  }

  // Arquivo selecionado - mostrar botões de ação
  if (selectedFile && !uploadStatus) {
    const fileSizeInMB = selectedFile.size / 1024 / 1024;
    const fileSizeDisplay = fileSizeInMB < 1
      ? `${(selectedFile.size / 1024).toFixed(2)} KB`
      : `${fileSizeInMB.toFixed(2)} MB`;

    return (
      <div className="border-2 border-gray-300 rounded-xl p-8 bg-white">
        <div className="flex flex-col items-center justify-center">
          <svg
            className="w-16 h-16 text-blue-500 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {selectedFile.name}
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            {fileSizeDisplay}
          </p>

          {/* Exibir input apenas se featureName existe (External Variables) */}
          {setFeatureName !== undefined && (
            <div className="w-full max-w-md mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Variável Externa *
              </label>
              <input
                type="text"
                value={featureName}
                onChange={(e) => {
                  setFeatureName(e.target.value);
                  if (nameError && e.target.value.trim()) {
                    setNameError(false);
                  }
                }}
                placeholder="Ex: campanha, investimento, etc."
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                  nameError
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                disabled={uploading}
              />
              {nameError && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  O nome da variável é obrigatório
                </p>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={uploading}
              className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition font-medium"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Cancelar
            </button>
            <button
              onClick={onUpload}
              disabled={uploading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition font-medium"
            >
              {uploading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Enviando...
                </>
              ) : (
                <>
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
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  Enviar Arquivo
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Status de sucesso ou erro
  if (uploadStatus) {
    return (
      <div className="border-2 border-gray-300 rounded-xl p-12 bg-white">
        <div className="flex flex-col items-center justify-center">
          {uploadStatus === "success" ? (
            <>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-10 h-10 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Upload realizado com sucesso!
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Seu arquivo foi processado e importado corretamente.
              </p>
            </>
          ) : uploadStatus === "invalid" ? (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-10 h-10 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Formato de arquivo inválido
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Por favor, selecione apenas arquivos CSV, XLS ou XLSX.
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-10 h-10 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Erro ao fazer upload
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Ocorreu um erro ao processar seu arquivo. Tente novamente.
              </p>
            </>
          )}
          <button
            onClick={onCancel}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition font-medium"
          >
            Enviar Novo Arquivo
          </button>
        </div>
      </div>
    );
  }

  return null;
}
