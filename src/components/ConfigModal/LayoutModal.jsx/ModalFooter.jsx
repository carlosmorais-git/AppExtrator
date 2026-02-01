import { Save } from "lucide-react";

export function ModalFooter({ onClose, onSave, showNotificacao }) {
  return (
    <div className="flex items-center justify-end gap-3 p-6 rounded-b-2xl border-t border-gray-700 sticky bottom-0 bg-dark-100 z-10">
      <button onClick={onClose} className="btn-secondary">
        Cancelar
      </button>
      <button
        onClick={() => {
          onSave();
          showNotificacao({
            visible: true,
            tipo: "sucesso",
            titulo: "Configurações Atualizadas",
            mensagem: "As configurações foram atualizadas com sucesso.",
          });
        }}
        className="btn-primary"
      >
        <Save className="w-5 h-5" />
        Salvar Configurações
      </button>
    </div>
  );
}
