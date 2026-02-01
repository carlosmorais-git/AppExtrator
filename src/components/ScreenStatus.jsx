import { Loader2, Sparkles, Wifi } from "lucide-react";
import React from "react";
// Tela será exibida quando iniciar o app e caso o back fique offline tambem
// Primeiro saudacao e depois carregamento do backend (em fila)

const ScreenSaudation = ({ tempoMax }) => {
  // Fazer barra de progresso com o valor de tempoMax
  const [tempo, setTempo] = React.useState(0);

  // Incrementa o tempo a cada 100ms até atingir o tempoMax
  React.useEffect(() => {
    const interval = setInterval(() => {
      setTempo((prevTempo) => {
        if (prevTempo < tempoMax) {
          return prevTempo + 100;
        } else {
          clearInterval(interval);
          return prevTempo;
        }
      });
    }, 100); // Atualiza a cada 100ms que é 1s / 10

    return () => clearInterval(interval);
  }, [tempoMax]);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-filter backdrop-blur-[3px] flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-dark-100 rounded-2xl border border-gray-700 p-8 max-w-md w-full mx-4 animate-scaleIn">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-semibold text-white mb-2">
            Bem-vindo de volta!
          </h1>
          <p className="text-gray-400 mb-6">Iniciando o aplicativo...</p>

          <div className="w-full bg-dark-200 rounded-full h-2 mt-3">
            <div
              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(tempo / tempoMax) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ScreenLoading = () => {
  return (
    <div className="fixed inset-0  bg-black/70 backdrop-filter backdrop-blur-[3px] flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-dark-100 rounded-2xl border border-gray-700 p-8 max-w-md w-full mx-4 animate-scaleIn">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-semibold text-white mb-2">
            Conectando ao backend
          </h1>
          <p className="text-gray-400 mb-6">
            Aguarde enquanto estabelecemos a conexão...
          </p>
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
        </div>
      </div>
    </div>
  );
};

// Componente principal que gerencia a fila de telas
export const ScreenStatus = ({ backendOnline }) => {
  const [showSaudation, setShowSaudation] = React.useState(true);
  const tempoMaxSaudation = 4000; // 4 segundos

  // Exibe saudação por 4 segundos na montagem inicial
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowSaudation(false);
    }, tempoMaxSaudation);

    return () => clearTimeout(timer);
  }, [tempoMaxSaudation]);

  // Fila: primeiro saudação, depois loading (se backend offline)
  if (showSaudation) {
    return <ScreenSaudation tempoMax={tempoMaxSaudation} />;
  }

  if (!backendOnline) {
    return <ScreenLoading />;
  }

  return null;
};
