import { createContext, useState, useEffect } from "react";
import { API_URL } from "../constants/api";
import { MODELOS_IA, DEFAULT_CONFIG } from "../data/utils";
import axios from "axios";

export const ConfigContext = createContext(null);

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState(null);
  const [apiValida, setApiValida] = useState(null);
  const [pastaInfo, setPastaInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carregar config do localStorage ou defaults da API
  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setLoading(true);
    try {
      // Primeiro tenta carregar do localStorage
      const saved = localStorage.getItem("extrator-config");
      if (saved) {
        const parsed = JSON.parse(saved);
        setConfig({
          ...parsed,
          preco: MODELOS_IA[parsed.modelo] || 0,
        });
      } else {
        // Se não tiver no localStorage, busca defaults da API
        await loadDefaults();
      }

      // Carrega estados salvos
      const savedApiValida = localStorage.getItem("extrator-apiValida");
      if (savedApiValida) {
        setApiValida(JSON.parse(savedApiValida));
      }

      const savedPastaInfo = localStorage.getItem("extrator-pastaInfo");
      if (savedPastaInfo) {
        setPastaInfo(JSON.parse(savedPastaInfo));
      }
    } catch (error) {
      console.error("Erro ao carregar config:", error);
      await loadDefaults();
    } finally {
      setLoading(false);
    }
  };

  const loadDefaults = async () => {
    try {
      const response = await axios.get(`${API_URL}/defaults`);
      setConfig({
        ...response.data,
        preco: MODELOS_IA[response.data.modelo] || 0,
      });
    } catch (error) {
      console.error("Erro ao carregar defaults:", error);
      // Define um fallback local se a API falhar
      setConfig({
        ...DEFAULT_CONFIG,
      });
    }
  };

  const saveConfig = (newConfig) => {
    const configWithPrice = {
      ...newConfig,
      preco: MODELOS_IA[newConfig.modelo] || 0,
    };
    setConfig(configWithPrice);
    localStorage.setItem("extrator-config", JSON.stringify(configWithPrice));
    localStorage.setItem("extrator-apiValida", JSON.stringify(apiValida));
    localStorage.setItem("extrator-pastaInfo", JSON.stringify(pastaInfo));
  };

  const updateConfig = (field, value) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "modelo" && { preco: MODELOS_IA[value] || 0 }),
    }));
  };

  const resetToDefaults = async () => {
    localStorage.removeItem("extrator-config");
    await loadDefaults();
  };

  // Verifica se a configuração está completa
  const isConfigured = apiValida === true && pastaInfo !== null;

  const value = {
    // Estado
    config,
    apiValida,
    pastaInfo,
    loading,

    // Computados
    isConfigured,
    modelosDisponiveis: MODELOS_IA,

    // Actions
    setConfig,
    setApiValida,
    setPastaInfo,
    saveConfig,
    updateConfig,
    resetToDefaults,
    loadDefaults,
  };

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
}
