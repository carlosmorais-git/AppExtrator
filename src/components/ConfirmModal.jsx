import React from "react";

import { LucideFileWarning, Rocket, Trash } from "lucide-react";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  titulo = "Confirmar Ação",
  mensagem = "Tem certeza que deseja continuar?",
  textoBotaoConfirmar = "Confirmar",
  textoBotaoCancelar = "Cancelar",
  tipo = "info", // info, alerta, excluir
}) => {
  if (!isOpen) return null;

  const estilos = {
    info: {
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-400",
      btnBg:
        "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700",
      icone: Rocket,
    },
    alerta: {
      iconBg: "bg-amber-500/20",
      iconColor: "text-amber-400",
      btnBg:
        "bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700",
      icone: LucideFileWarning,
    },
    excluir: {
      iconBg: "bg-red-500/20",
      iconColor: "text-red-400",
      btnBg:
        "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700",
      icone: Trash,
    },
  };

  const config = estilos[tipo] || estilos.info;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-filter backdrop-blur-[3px] animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-dark-200 rounded-2xl shadow-2xl border border-dark-100 w-full max-w-md mx-4 animate-scaleIn">
        {/* Header com ícone */}
        <div className="p-6 pb-4 text-center">
          <div
            className={`${config.iconBg} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}
          >
            <config.icone
              style={{ fontSize: "32px" }}
              className={config.iconColor}
            />
          </div>

          <h3 className="text-xl font-bold text-white mb-2">{titulo}</h3>
          <p className="text-gray-400 text-sm leading-relaxed">{mensagem}</p>
        </div>

        {/* Botões */}
        <div className="p-6 pt-2 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl bg-dark-100 text-gray-300 font-medium
                       hover:bg-dark-50 transition-all duration-200
                       focus:outline-none focus:ring-2 focus:ring-gray-500/50"
          >
            {textoBotaoCancelar}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 px-4 py-3 rounded-xl text-white font-medium
                       ${config.btnBg} transition-all duration-200
                       shadow-lg hover:shadow-xl transform hover:scale-[1.02]
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-200`}
          >
            {textoBotaoConfirmar}
          </button>
        </div>
      </div>

    </div>
  );
};

export default ConfirmModal;
