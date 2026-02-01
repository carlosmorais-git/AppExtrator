import { createContext, useContext, useRef, useState } from "react";

const NotificationContext = createContext();

const NotificationContextProvider = ({ children }) => {
  const [notificacao, setNotificacao] = useState({
    visible: false,
    tipo: "info", // success | error | info | warning | extracao_completa
    titulo: "Informação",
    mensagem: "Esta é uma notificação.",
  });

  const timeoutRef = useRef(null);

  const showNotificacao = ({
    tipo = "info",
    titulo = "",
    mensagem = "",
    tempo = 4000, // Tempo na tela
  }) => {
    // Limpa timeout anterior se existir
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setNotificacao({
      visible: true,
      tipo,
      titulo,
      mensagem,
    });

    // Auto-close após o tempo especificado
    timeoutRef.current = setTimeout(() => {
      // Limpa o timeout se existir
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setNotificacao((prev) => ({ ...prev, visible: false }));
    }, tempo);
  };
  const value = {
    notificacao,
    showNotificacao,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContextProvider;

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider",
    );
  }
  return context;
};
