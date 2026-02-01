import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../constants/api";
import { ModalHeader } from "./LayoutModal.jsx/ModalHeader";
import { ModalFooter } from "./LayoutModal.jsx/ModalFooter";
import ContentModal from "./ContentModal";

export function ConfigModal({
  isOpen,
  onClose,
  config,
  setConfig,
  onSave,
  apiValida,
  setApiValida,
  pastaInfo,
  setPastaInfo,
  showNotificacao,
}) {
  const [localConfig, setLocalConfig] = useState(config);
  const [showApiKey, setShowApiKey] = useState(false);
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    setLocalConfig(config);
  }, [config, isOpen]);

  const handleSelectFolder = async () => {
    if (window.electronAPI) {
      const folder = await window.electronAPI.selectFolder();
      if (folder) {
        setLocalConfig({ ...localConfig, pasta: folder });
        await validarPasta(folder);
      }
    }
  };

  const validarPasta = async (pastaPath) => {
    try {
      const response = await axios.post(`${API_URL}/validar-pasta`, {
        pasta: pastaPath,
      });
      setPastaInfo(response.data);
    } catch {
      setPastaInfo(null);
    }
  };

  const validarApiKey = async () => {
    if (!localConfig.apiKey) return;
    setValidating(true);
    try {
      const response = await axios.post(`${API_URL}/validar-api-key`, {
        api_key: localConfig.apiKey,
      });
      setApiValida(response.data.valida);
    } catch {
      setApiValida(false);
    }
    setValidating(false);
  };

  const handleSave = () => {
    setConfig(localConfig); // Atualiza a config no componente pai
    onSave(localConfig); // Chama o callback de salvar localmente
    onClose();
  };

  const updateConfig = (field, value) => {
    setLocalConfig({ ...localConfig, [field]: value });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-filter backdrop-blur-[3px] animate-fadeIn">
      <div className="bg-dark-100 rounded-2xl w-full max-w-5xl max-h-[100vh] border border-gray-700 animate-scaleIn">
        <ModalHeader onClose={onClose} />

        <ContentModal
          localConfig={localConfig}
          updateConfig={updateConfig}
          validarApiKey={validarApiKey}
          showApiKey={showApiKey}
          setShowApiKey={setShowApiKey}
          validating={validating}
          apiValida={apiValida}
          validarPasta={validarPasta}
          handleSelectFolder={handleSelectFolder}
          pastaInfo={pastaInfo}
        />

        <ModalFooter
          onClose={onClose}
          onSave={handleSave}
          showNotificacao={showNotificacao}
        />
      </div>
    </div>
  );
}
