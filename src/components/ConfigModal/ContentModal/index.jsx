import { useState } from "react";
import { Key, FolderOpen, Settings, MessageSquare } from "lucide-react";
import { RenderTabContent } from "../LayoutModal.jsx/RenderTabContent";

const tabs = [
  { id: "chave", label: "Chave", icon: Key },
  { id: "caminho", label: "Caminho", icon: FolderOpen },
  { id: "regras", label: "Regras", icon: Settings },
  { id: "prompts", label: "Prompts", icon: MessageSquare },
];

const ContentModal = ({
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
  const [activeTab, setActiveTab] = useState("chave");

  return (
    <div className="flex h-[60vh]">
      {/* Menu Lateral */}
      <div className="w-48 bg-dark-200 border-r border-gray-700 p-3 space-y-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200
                ${
                  isActive
                    ? "bg-primary-600 text-white shadow-lg shadow-primary-600/20"
                    : "text-gray-400 hover:bg-dark-100 hover:text-white"
                }`}
            >
              <Icon
                size={18}
                className={isActive ? "text-white" : "text-gray-500"}
              />
              <span className="font-medium text-sm">
                {tab.label}
                {tab.id === "chave" && (apiValida ? "" : "⚠️")}
                {tab.id === "caminho" && (pastaInfo?.valida ? "" : "⚠️")}
              </span>
            </button>
          );
        })}
      </div>

      {/* Conteúdo */}
      <div className="flex-1 p-6 overflow-y-auto">
        <RenderTabContent
          activeTab={activeTab}
          localConfig={localConfig}
          updateConfig={updateConfig}
          validarApiKey={validarApiKey}
          validarPasta={validarPasta}
          showApiKey={showApiKey}
          setShowApiKey={setShowApiKey}
          apiValida={apiValida}
          validating={validating}
          handleSelectFolder={handleSelectFolder}
          pastaInfo={pastaInfo}
        />
      </div>
    </div>
  );
};

export default ContentModal;
