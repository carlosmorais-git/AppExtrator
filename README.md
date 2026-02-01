# Extrator de Texto Manuscrito

Aplicação desktop para extração automática de textos manuscritos de imagens usando GPT-4 Vision.

## Funcionalidades

- 🔑 Campo seguro para API Key (exibe apenas os 10 primeiros caracteres)
- 📁 Seletor de pasta para escolher imagens
- 📊 Barra de progresso e log em tempo real
- 💾 Exporta resultados em JSON

## Instalação

```bash
# Instalar dependências do frontend
npm install

# Instalar dependências do backend
cd backend
pip install -r requirements.txt
```

## Como rodar

```bash
# Terminal 1 - Backend
npm run start:backend

# Terminal 2 - Frontend + Electron
npm run dev
```

## Build para produção

```bash
npm run build
```

## Requisitos

- Node.js 18+
- Python 3.10+
- Chave de API da OpenAI com acesso ao GPT-4 Vision

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Desktop:** Electron
- **Backend:** Python (FastAPI)
