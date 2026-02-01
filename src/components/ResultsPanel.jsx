import {
  FileText,
  CheckCircle2,
  XCircle,
  Table,
  FileSpreadsheet,
  FileJson,
  FileDown,
} from "lucide-react";
import axios from "axios";
import { API_URL } from "../constants/api";

export function ResultsPanel({
  resultados,
  onDownload,
  cancelarExtracao,
  startExtraction,
}) {
  // Função para baixar arquivo via API
  const downloadFile = async (tipo) => {
    try {
      const response = await axios.post(
        `${API_URL}/download/${tipo}`,
        { resultados },
        { responseType: "blob" },
      );

      // Pegar nome do arquivo do header ou usar default
      const contentDisposition = response.headers["content-disposition"];
      let filename = `resultados_${new Date().toISOString().slice(0, 10)}`;

      if (tipo === "json") filename += ".json";
      else if (tipo === "csv") filename += ".csv";
      else if (tipo === "excel") filename += ".xls";

      if (contentDisposition) {
        const match = contentDisposition.match(/filename=(.+)/);
        if (match) filename = match[1];
      }

      // Criar link e baixar
      const url = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
      onDownload(tipo.toUpperCase());
    } catch (error) {
      console.error("Erro ao baixar arquivo:", error);
    }
  };

  return (
    <div className="card flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h2 className="text-lg font-semibold text-white">
          <Table className="w-5 h-5 inline-block mr-2 text-primary-500" />{" "}
          Resultados
        </h2>
        <div className="flex items-center gap-2">
          {startExtraction && (
            <button
              onClick={cancelarExtracao}
              className="btn-secondary border transition-all duration-300  border-red-800"
            >
              Interromper Extração
              <XCircle className="w-4 h-4 text-red-500  " />
            </button>
          )}
          {resultados.length > 0 && (
            <span className="text-sm text-gray-400">
              {resultados.filter((r) => r.sucesso).length} sucesso
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        {resultados.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Nenhum resultado ainda</p>
            <p className="text-sm">
              Os resultados aparecerão aqui conforme forem extraídos
            </p>
          </div>
        ) : (
          <div className="space-y-3 pr-2">
            {resultados.map((resultado, i) => (
              <div
                key={i}
                className={`p-4 rounded-lg border transition-all duration-300 ${
                  resultado.sucesso ? " border-green-800" : " border-red-800"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-white flex items-center gap-2">
                    {resultado.sucesso ? (
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400" />
                    )}
                    {resultado.imagem}
                  </span>
                  <span className="text-xs text-gray-400">
                    {resultado.tempo}s
                  </span>
                </div>
                <pre className="text-sm text-gray-300 whitespace-pre-wrap bg-dark-300 p-3 rounded mt-2 overflow-x-auto max-h-60">
                  {typeof resultado.texto_extraido === "object"
                    ? JSON.stringify(resultado.texto_extraido, null, 2)
                    : resultado.texto_extraido}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rodapé com botões de download */}
      <div className="border-t border-gray-700 pt-4 mt-4 flex items-center justify-center gap-3 flex-shrink-0">
        <button
          onClick={() => {
            downloadFile("excel");
          }}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={resultados.length === 0}
        >
          <FileSpreadsheet className="w-4 h-4" />
          Excel
        </button>
        <button
          onClick={() => {
            downloadFile("json");
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={resultados.length === 0}
        >
          <FileJson className="w-4 h-4" />
          JSON
        </button>
        <button
          onClick={() => {
            downloadFile("csv");
          }}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={resultados.length === 0}
        >
          <FileDown className="w-4 h-4" />
          CSV
        </button>
      </div>
    </div>
  );
}
