import { useEffect, useRef } from "react";
import { FileDown, FileText } from "lucide-react";
export function LogPanel({ logs }) {
  const logsEndRef = useRef(null);

  // Auto scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const downloadLogs = () => {
    const logText = logs
      .map((log) => `[${log.timestamp}] ${log.message}`)
      .join("\n");
    const blob = new Blob([logText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `logs_${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card flex flex-col h-full overflow-hidden">
      <h2 className="text-lg font-semibold text-white mb-4 flex-shrink-0">
        <FileText className="w-5 h-5 inline-block mr-2 text-primary-500" /> Logs
        de Extração
      </h2>
      <div className="bg-dark-200 rounded-lg p-4 flex-1 overflow-y-auto min-h-0 font-mono text-sm">
        {logs.length === 0 ? (
          <p className="text-gray-500">Aguardando início...</p>
        ) : (
          <>
            {logs.map((log, i) => (
              <div
                key={i}
                className={`py-1 ${
                  log.type === "error"
                    ? "text-red-400"
                    : log.type === "success"
                      ? "text-green-400"
                      : "text-gray-300"
                }`}
              >
                <span className="text-gray-500">[{log.timestamp}]</span>{" "}
                {log.message}
              </div>
            ))}
            <div ref={logsEndRef} />
          </>
        )}
      </div>
      <div className="border-t border-gray-700 pt-4 mt-4 flex items-center justify-center gap-3 flex-shrink-0">
        <button
          onClick={downloadLogs}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={logs.length === 0}
        >
          <FileDown className="w-4 h-4" />
          Txt
        </button>
      </div>
    </div>
  );
}
