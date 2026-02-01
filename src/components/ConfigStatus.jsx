import { Settings } from "lucide-react";

export function ConfigStatus() {
  return (
    <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-700 rounded-xl flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Settings className="w-6 h-6 text-yellow-500" />
        <div>
          <p className="text-yellow-400 font-medium">Configuração necessária</p>
          <p className="text-yellow-500/70 text-sm">
            Configure a API Key e a pasta de imagens para começar
          </p>
        </div>
      </div>
    </div>
  );
}
