import { Key, Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";

export function ApiKeyField({
  value,
  onChange,
  onBlur,
  showApiKey,
  onToggleShow,
  validating,
  apiValida,
}) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
        <Key className="w-4 h-4 text-primary-500" />
        API Key OpenAI
      </label>
      <div className="relative">
        <input
          type={showApiKey ? "text" : "password"}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder="sk-..."
          className="input-field pr-24"
        />
        <button
          onClick={onToggleShow}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
        >
          {showApiKey ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>

      {validating && (
        <p className="text-xs text-yellow-400 mt-2">Validando...</p>
      )}
      {apiValida !== null && !validating && (
        <div
          className={`flex items-center gap-2 mt-2 text-sm ${apiValida ? "text-green-400" : "text-red-400"}`}
        >
          {apiValida ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <XCircle className="w-4 h-4" />
          )}
          {apiValida ? "API Key válida" : "API Key inválida"}
        </div>
      )}
    </div>
  );
}
