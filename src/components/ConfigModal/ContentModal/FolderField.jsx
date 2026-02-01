import { FolderOpen, CheckCircle2 } from "lucide-react";

export function FolderField({
  value,
  onChange,
  onBlur,
  onSelectFolder,
  pastaInfo,
}) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
        <FolderOpen className="w-4 h-4 text-primary-600" />
        Pasta de Imagens
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder="C:\caminho\para\imagens"
          className="input-field flex-1"
        />
        <button onClick={onSelectFolder} className="btn-secondary">
          <FolderOpen className="w-5 h-5 text-primary-600" />
        </button>
      </div>

      <p
        className={`text-sm mt-2 flex items-center gap-2 ${pastaInfo ? "text-green-400 " : "text-red-400 "}`}
      >
        <CheckCircle2 className="w-4 h-4" />
        {pastaInfo
          ? pastaInfo.quantidade_imagens > 0
            ? pastaInfo.quantidade_imagens + " imagens encontradas"
            : "Nenhuma pasta válida selecionada"
          : "Pasta não verificada"}
      </p>
    </div>
  );
}
