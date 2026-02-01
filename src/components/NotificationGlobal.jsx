import React, { useEffect, useState } from "react";
import { useNotification } from "../contexts/NotificationContext";
import { AlertTriangle, Check, CheckCheck, Info, Trash, X } from "lucide-react";

const NotificationGlobal = () => {
  const { notificacao, showNotificacao } = useNotification();
  const { visible, tipo, titulo, mensagem } = notificacao;
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (visible) {
      setIsAnimating(true);
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const estilos = {
    sucesso: {
      iconBg: "bg-emerald-500/20",
      iconColor: "text-emerald-400",
      borderColor: "border-emerald-500/30",
      barColor: "bg-emerald-500",
      icone: Check,
    },
    excluir: {
      iconBg: "bg-red-500/20",
      iconColor: "text-red-400",
      borderColor: "border-red-500/30",
      barColor: "bg-red-500",
      icone: Trash,
    },
    alerta: {
      iconBg: "bg-amber-500/20",
      iconColor: "text-amber-400",
      borderColor: "border-amber-500/30",
      barColor: "bg-amber-500",
      icone: AlertTriangle,
    },
    info: {
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-400",
      borderColor: "border-blue-500/30",
      barColor: "bg-blue-500",
      icone: Info,
    },
    extracao_completa: {
      iconBg: "bg-purple-500/20",
      iconColor: "text-purple-400",
      borderColor: "border-purple-500/30",
      barColor: "bg-purple-500",
      icone: CheckCheck,
    },
  };

  const config = estilos[tipo] || estilos["info"];
  const Icone = config.icone;

  if (!visible && !isAnimating) return null;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50">
      <div
        className={`
          bg-dark-200 border ${config.borderColor}
          min-w-[360px] max-w-md
          rounded-2xl shadow-2xl
          transform transition-all duration-300 ease-out
          ${
            visible
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 -translate-y-4 scale-95"
          }
        `}
      >
        <div className="p-4 flex items-center gap-4">
          {/* Ícone */}
          <div
            className={`${config.iconBg} w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0`}
          >
            <Icone className={`w-6 h-6 ${config.iconColor}`} />
          </div>

          {/* Conteúdo */}
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-base leading-tight">
              {titulo}
            </p>
            <p className="text-gray-400 text-sm mt-1 leading-tight">
              {mensagem}
            </p>
          </div>

          {/* Botão Fechar */}
          <button
            className="flex-shrink-0 p-2 rounded-xl bg-dark-100 text-gray-400
                       hover:bg-dark-50 hover:text-gray-300
                       transition-all duration-200 focus:outline-none focus:ring-2 
                       focus:ring-gray-500/50"
            onClick={() => showNotificacao({ visible: false })}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationGlobal;
