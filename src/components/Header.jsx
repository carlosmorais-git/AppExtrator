import { Settings } from "lucide-react";
import { ActionButton } from "./ActionButton.jsx";

export function Header({
  backendOnline,
  onOpenSettings,
  loading,
  isConfigured,
  progresso,
  iniciarExtracao,
}) {
  return (
    <header className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Extrator de Texto Manuscrito
            </h1>
            <p className="text-gray-400 text-sm">Powered by GPT-4 Vision</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${backendOnline ? "bg-green-500" : "bg-red-500"} animate-pulse`}
            ></div>
            <span className="text-sm text-gray-400">
              {backendOnline ? "Online" : "Offline"}
            </span>
          </div>
          <button onClick={onOpenSettings} className="btn-secondary">
            <Settings className="w-5 h-5" />
            Configurações
          </button>
          {/* Botão de Ação Principal */}
          <ActionButton
            loading={loading}
            disabled={loading || !backendOnline || !isConfigured}
            progresso={progresso}
            onClick={iniciarExtracao}
          />
        </div>
      </div>
    </header>
  );
}
