import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../constants/api";

export function useBackendStatus() {
  const [backendOnline, setBackendOnline] = useState(false);

  //   Na montagem, verifica o status do backend
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await axios.get(`${API_URL}/health`);
        setBackendOnline(response.data.status === "healthy");
      } catch {
        setBackendOnline(false);
      }
    };

    checkBackend();
    const interval = setInterval(checkBackend, 5000); // Verifica a cada 5 segundos
    return () => clearInterval(interval);
  }, []);

  return backendOnline;
}
