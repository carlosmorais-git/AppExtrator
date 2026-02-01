// Hook personalizado para acessar o contexto de configuração
import { useContext } from "react";
import { ConfigContext } from "../contexts/ConfigContext";

export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig deve ser usado dentro de ConfigProvider");
  }
  return context;
}
