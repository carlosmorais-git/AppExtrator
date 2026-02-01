import { useState, useRef } from "react";
import axios from "axios";
import { API_URL } from "./constants/api";
import { useBackendStatus, useConfig } from "./hooks";
import {
  ConfigModal,
  Header,
  ConfigStatus,
  ConfigSummary,
  LogPanel,
  ResultsPanel,
  ConfirmModal,
  NotificationGlobal,
} from "./components";
import { useNotification } from "./contexts/NotificationContext.jsx";
import { Loader2 } from "lucide-react";
import { ScreenStatus } from "./components/ScreenStatus.jsx";

function App() {
  const {
    config,
    isConfigured,
    apiValida,
    pastaInfo,
    setApiValida,
    setConfig,
    saveConfig,
    setPastaInfo,
  } = useConfig();
  const backendOnline = useBackendStatus();
  const { showNotificacao } = useNotification();

  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progresso, setProgresso] = useState({ current: 0, total: 0 });
  const [resultados, setResultados] = useState([]);
  const [logs, setLogs] = useState([]);
  const [startExtraction, setStartExtraction] = useState(false);

  const lastImageRef = useRef("");

  // Adicionar log (evita duplicados)
  const addLog = (message, type = "info") => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => {
      const lastLog = prev[prev.length - 1];
      if (lastLog && lastLog.message === message) {
        return prev;
      }
      return [...prev, { message, type, timestamp }];
    });
  };

  // Iniciar extração
  const iniciarExtracao = async () => {
    if (!isConfigured) {
      addLog("⚠️ Configure a API Key e a pasta primeiro", "error");
      showNotificacao({
        visible: true,
        tipo: "excluir",
        titulo: "Erro",
        mensagem: "Configure a API Key e a pasta primeiro.",
      });
      setShowConfigModal(true);
      return;
    }
    setShowConfirmModal(true);
  };

  // Executar extração após confirmação
  const executarExtracao = async () => {
    setLoading(true);
    setResultados([]); // Limpa resultados anteriores
    setLogs([]); // Limpa logs anteriores
    lastImageRef.current = "";
    addLog("> Iniciando extração...", "info");
    setStartExtraction(true);
    showNotificacao({
      tipo: "info",
      titulo: "Extração Iniciada",
      mensagem: "Essa ação pode levar alguns minutos...",
    });

    try {
      const progressInterval = setInterval(async () => {
        try {
          const progressRes = await axios.get(`${API_URL}/progresso`);
          setProgresso({
            current: progressRes.data.current,
            total: progressRes.data.total,
          });

          const currentImage = progressRes.data.current_image;
          if (currentImage && currentImage !== lastImageRef.current) {
            lastImageRef.current = currentImage;
            addLog(`📸 Processando: ${currentImage}`, "info");
          }

          if (
            progressRes.data.results &&
            progressRes.data.results.length > resultados.length
          ) {
            setResultados([...progressRes.data.results]);
          }
        } catch {}
      }, 500);

      const response = await axios.post(`${API_URL}/extrair`, {
        api_key: config.apiKey,
        pasta: config.pasta,
        quantidade: config.quantidade,
        system_prompt: config.systemPrompt,
        user_prompt: config.userPrompt,
        modelo: config.modelo,
        qualidade: config.qualidade,
      });

      clearInterval(progressInterval);

      setResultados(response.data.resultados);

      if (response.data.resultados.length === 0) {
        addLog("⚠️ Nenhum resultado foi retornado.", "warning");
      } else if (response.data.erros) {
        addLog(
          `❌ Aconteceram erros durante a extração: ${response.data.erros}`,
          "error",
        );
      } else {
        addLog(
          `Extração finalizada ! ${response.data.sucesso}/${response.data.total} com sucesso`,
          "success",
        );
        addLog(
          `Resultados salvos em: ${response.data.arquivo_json}`,
          "success",
        );
      }
    } catch (error) {
      addLog(
        `❌ Erro na extração: ${error.response?.data?.detail || error.message}`,
        "error",
      );
    } finally {
      setLoading(false);
      setProgresso({ current: 0, total: 0 });
      setStartExtraction(false);
    }
  };

  // Cancelar extração (não implementado no backend ainda)
  const cancelarExtracao = async () => {
    try {
      const response = await axios.post(`${API_URL}/cancelar`);
      if (response.data.cancelado) {
        addLog("⚠️ Extração cancelada pelo usuário.", "warning");
        showNotificacao({
          tipo: "alerta",
          titulo: "Extração Cancelada",
          mensagem: "A extração de texto foi cancelada.",
        });
      }
    } catch (error) {
      addLog(
        `❌ Erro ao cancelar extração: ${error.response?.data?.detail || error.message}`,
        "error",
      );
      showNotificacao({
        tipo: "error",
        titulo: "Erro ao Cancelar",
        mensagem: `Erro ao cancelar a extração: ${error.response?.data?.detail || error.message}`,
      });
    }
    setStartExtraction(false);
  };

  const handleSaveConfig = (newConfig) => {
    saveConfig(newConfig);
    addLog("⚙️ Configurações salvas!", "success");
  };

  const handleDownload = (text) => {
    addLog(`⬇️ Preparando download ${text}`, "info");
  };

  const openConfigModal = () => setShowConfigModal(true);

  return (
    <div className="h-screen bg-dark-300 p-6 flex flex-col">
      {/* Modal de Confirmação */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={executarExtracao}
        titulo="Iniciar Extração"
        mensagem="Tem certeza que deseja iniciar a extração de texto das imagens? Este processo pode levar alguns minutos dependendo da quantidade de arquivos."
        textoBotaoConfirmar="Iniciar"
        textoBotaoCancelar="Cancelar"
        tipo="info"
      />

      {/* Modal de Configurações */}
      <ConfigModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        config={config}
        setConfig={setConfig}
        onSave={handleSaveConfig}
        apiValida={apiValida}
        setApiValida={setApiValida}
        pastaInfo={pastaInfo}
        setPastaInfo={setPastaInfo}
        showNotificacao={showNotificacao}
      />

      {/* Header */}
      <Header
        backendOnline={backendOnline}
        onOpenSettings={openConfigModal}
        loading={loading}
        isConfigured={isConfigured}
        progresso={progresso}
        iniciarExtracao={iniciarExtracao}
      />

      {/* Status das Configurações */}
      {!isConfigured && <ConfigStatus onConfigure={openConfigModal} />}

      {/* Resumo das Configurações */}
      {isConfigured && (
        <ConfigSummary
          config={config}
          progresso={progresso}
          onOpenSettings={openConfigModal}
        />
      )}

      {/* Grid de Logs e Resultados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        <LogPanel logs={logs} />
        <ResultsPanel
          resultados={resultados}
          onDownload={handleDownload}
          cancelarExtracao={cancelarExtracao}
          startExtraction={startExtraction}
        />
      </div>
      {/* Notificações Globais */}
      <NotificationGlobal />

      <ScreenStatus backendOnline={backendOnline} />
    </div>
  );
}

export default App;
