import React from "react";
import { ApiKeyField } from "../ContentModal/ApiKeyField";
import { FolderField } from "../ContentModal/FolderField";
import { QuantityField } from "../ContentModal/QuantityField";
import { PromptField } from "../ContentModal/PromptField";

export const RenderTabContent = ({
  activeTab,
  localConfig,
  updateConfig,
  validarApiKey,
  validarPasta,
  showApiKey,
  setShowApiKey,
  apiValida,
  validating,
  handleSelectFolder,
  pastaInfo,
}) => {
  switch (activeTab) {
    case "chave":
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">
            Configuração da API
          </h3>
          <ApiKeyField
            value={localConfig.apiKey}
            onChange={(e) => updateConfig("apiKey", e.target.value)}
            onBlur={validarApiKey}
            showApiKey={showApiKey}
            onToggleShow={() => setShowApiKey(!showApiKey)}
            validating={validating}
            apiValida={apiValida}
          />
        </div>
      );

    case "caminho":
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">
            Pasta de Imagens
          </h3>
          <FolderField
            value={localConfig.pasta}
            onChange={(e) => updateConfig("pasta", e.target.value)}
            onBlur={() => localConfig.pasta && validarPasta(localConfig.pasta)}
            onSelectFolder={handleSelectFolder}
            pastaInfo={pastaInfo}
          />
        </div>
      );

    case "regras":
      return (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Regras de Processamento
          </h3>
          <QuantityField value={localConfig} onChange={updateConfig} />
        </div>
      );

    case "prompts":
      return (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Configuração de Prompts
          </h3>
          <PromptField
            label="System Prompt"
            value={localConfig.systemPrompt}
            onChange={(e) => updateConfig("systemPrompt", e.target.value)}
            placeholder="Você é um assistente especializado em extrair textos manuscritos..."
            description="Define o comportamento do modelo"
            minHeight="120px"
          />

          <PromptField
            label="User Prompt"
            value={localConfig.userPrompt}
            onChange={(e) => updateConfig("userPrompt", e.target.value)}
            placeholder="Extraia tudo que for texto manuscrito desta imagem..."
            description="Instrução enviada junto com a imagem"
            minHeight="180px"
            iconColor="text-primary-500"
          />
        </div>
      );

    default:
      return null;
  }
};
