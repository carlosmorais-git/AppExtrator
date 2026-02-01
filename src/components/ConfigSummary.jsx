import { Key, FolderOpen, FileText, Bot, DollarSign } from "lucide-react";
import { DOLAR } from "../data/utils";
export function ConfigSummary({ config, progresso }) {
  return (
    <div className="mb-6 p-4 bg-dark-100 border border-gray-700 rounded-xl flex items-center justify-between ">
      <div className="flex items-center gap-6 p-2 text-sm overflow-x-auto overflow-hidden whitespace-nowrap">
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-green-500" />
          <span className="text-gray-400">API:</span>
          <span className="text-gray-300 font-mono">
            {config.apiKey.substring(0, 10)}***
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-blue-500" />
          <span className="text-gray-400">Pasta:</span>
          <span className="text-gray-300 truncate max-w-[200px]">
            {config.pasta}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-purple-500" />
          <span className="text-gray-400">Qtd:</span>
          <span className="text-gray-300">{config.quantidade}</span>
        </div>
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-blue-500" />
          <span className="text-gray-400">Modelo:</span>
          <span className="text-gray-300">{config.modelo}</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-yellow-400" />
          <span className="text-gray-400">Preço:</span>
          <span className="text-gray-300">
            R$ {(config.preco * DOLAR).toFixed(2)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-red-400" />
          <span className="text-gray-400">Gasto:</span>
          <span className="text-gray-300">
            R$ {(config.preco * progresso.current * DOLAR).toFixed(2)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-green-400" />
          <span className="text-gray-400">Estimado:</span>
          <span className="text-gray-300">
            R$ {(config.preco * progresso.total * DOLAR).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
