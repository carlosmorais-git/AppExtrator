import { Settings, X } from "lucide-react";

export function ModalHeader({ onClose }) {
  return (
    <div className="flex items-center justify-between p-6 rounded-t-2xl border-b border-gray-700 sticky top-0 bg-dark-100">
      <div className="flex items-center gap-3">
        <div className="bg-primary-600 p-2 rounded-lg">
          <Settings className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl font-bold text-white">Configurações</h2>
      </div>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-white transition-colors"
      >
        <X className="w-6 h-6" />
      </button>
    </div>
  );
}
