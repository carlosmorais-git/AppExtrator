export const MODELOS_IA = {
  "gpt-4o-mini": 0.005,
  "gpt-4o": 0.01,
  "gpt-4-turbo": 0.04,
};

export const DEFAULT_CONFIG = {
  systemPrompt:
    "Você é um assistente especializado em extrair textos manuscritos de imagens.",
  userPrompt: "Extraia só texto manuscrito desta imagem.",
  modelo: "gpt-4o-mini",
  qualidade: "auto",
  quantidade: 5,
  preco: MODELOS_IA["gpt-4o-mini"],
};

export const DOLAR = 5.6;
