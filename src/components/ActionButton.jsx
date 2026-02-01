import { Loader2, Zap } from "lucide-react";

export function ActionButton({ loading, disabled, progresso, onClick }) {
  return (
    <div>
      <button
        onClick={onClick}
        disabled={disabled}
        className="btn-primary w-full justify-center text-lg"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processando... {progresso.current}/{progresso.total}
          </>
        ) : (
          <>
            <Zap className="w-5 h-5" />
            Iniciar Extração
          </>
        )}
      </button>

      {/* {loading && progresso.total > 0 && (
        <div className="w-full bg-dark-200 rounded-full h-2 mt-3">
          <div
            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${(progresso.current / progresso.total) * 100}%`,
            }}
          ></div>
        </div>
      )} */}
    </div>
  );
}
