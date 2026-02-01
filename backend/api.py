# Gerar o executavel
# pyinstaller --onefile api.py 

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import cv2
import base64
import requests
import os
import time
import json
from typing import Optional, List
import asyncio
from concurrent.futures import ThreadPoolExecutor
import uvicorn
import io
import csv

# Models
class ExtractionRequest(BaseModel):
    api_key: str
    pasta: str
    quantidade: int = 12
    system_prompt: Optional[str] = "Você é um assistente especializado em extrair textos manuscritos de imagens."
    user_prompt: Optional[str] = """Extraia só texto manuscrito desta imagem. 
Faça um formato de dicionario coloca a chave que o representa e o valor que é o texto manuscrito. 
Caso não encontre, retorne 'NÃO ENCONTRADO'.
Atenção: Ignora textos impresso. Sem caracteres especiais ou acentos."""
    modelo: Optional[str] = "gpt-4o-mini"
    qualidade: Optional[str] = "high"

class ExtractionResult(BaseModel):
    imagem: str
    texto_extraido: str
    tempo: float
    sucesso: bool

class ProgressUpdate(BaseModel):
    atual: int
    total: int
    imagem: str
    status: str

class DownloadRequest(BaseModel):
    resultados: List[dict]


class ExtratorAPI:
    """Classe principal que gerencia a API de extração de texto"""
    
    def __init__(self):
        self.app = FastAPI(title="Extrator de Texto Manuscrito API")
        self.executor = ThreadPoolExecutor(max_workers=4)
        
        # Estado do progresso da extração
        self.extraction_progress = {
            "running": False,
            "current": 0,
            "total": 0,
            "results": [],
            "current_image": ""
        }
        
        # Valores padrão
        self.defaults = {
            "system_prompt": "Você é um assistente especializado em extrair textos manuscritos de imagens.",
            "user_prompt": """Extraia só texto manuscrito desta imagem. 
Faça um formato de dicionario coloca a chave que o representa e o valor que é o texto manuscrito. 
Caso não encontre, retorne 'NÃO ENCONTRADO'.
Atenção: Ignora textos impresso. Sem caracteres especiais ou acentos.""",
            "modelo": "gpt-4o-mini",
            "qualidade": "high",
            "quantidade": 12
        }
        
        self._setup_middleware()
        self._setup_routes()
    
    def _setup_middleware(self):
        """Configura CORS"""
        self.app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
    
    def _setup_routes(self):
        """Registra todas as rotas"""
        self.app.get("/")(self.root)
        self.app.get("/health")(self.health_check)
        self.app.get("/defaults")(self.get_defaults)
        self.app.get("/progresso")(self.get_progresso)
        self.app.post("/validar-pasta")(self.validar_pasta)
        self.app.post("/validar-api-key")(self.validar_api_key)
        self.app.post("/extrair")(self.extrair_textos)
        self.app.post("/cancelar")(self.cancelar_extracao)
        self.app.post("/download/json")(self.download_json)
        self.app.post("/download/csv")(self.download_csv)
        self.app.post("/download/excel")(self.download_excel)
    
    # ============ MÉTODOS AUXILIARES ============
    
    def extrair_texto_gpt4(
        self, 
        imagem_path: str, 
        api_key: str, 
        system_prompt: Optional[str] = None, 
        user_prompt: Optional[str] = None, 
        modelo: Optional[str] = "gpt-4o-mini", 
        qualidade: Optional[str] = "high"
    ) -> str:
        """Extrai texto manuscrito usando GPT-4 Vision"""
        
        img = cv2.imread(imagem_path)
        if img is None:
            return "ERRO: Imagem não carregada"
        
        _, buffer = cv2.imencode('.jpg', img)
        img_base64 = base64.b64encode(buffer).decode('utf-8')

        mensagens = []

        if system_prompt:
            mensagens.append({
                "role": "system",
                "content": system_prompt
            })
        
        mensagens.append({
            "role": "user",
            "content": [
                {"type": "text", "text": user_prompt},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{img_base64}",
                        "detail": qualidade
                    }
                }
            ]
        })
        
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": modelo,
            "messages": mensagens,
            "max_tokens": 200
        }
        
        try:
            response = requests.post(
                "https://api.openai.com/v1/chat/completions",
                headers=headers,
                json=payload,
                timeout=30
            )
            
            data = response.json()
            
            if "error" in data:
                return f"ERRO_API: {data['error']['message']}"
                
            resposta = data["choices"][0]["message"]["content"].strip()
            inicio = resposta.find("{") 
            fim = resposta.rfind("}") + 1

            if inicio and fim:
                return json.loads(resposta[inicio:fim])
            
            return resposta
            
        except Exception as e:
            return f"ERRO_API: {str(e)}"
    
    # ============ ROTAS ============
    
    async def root(self):
        """Rota raiz"""
        return {"message": "API Extrator de Texto Manuscrito", "status": "online"}
    
    async def health_check(self):
        """Verifica saúde da API"""
        return {"status": "healthy"}
    
    async def get_defaults(self):
        """Retorna valores padrão para prompts e configurações"""
        return self.defaults
    
    async def get_progresso(self):
        """Retorna o progresso atual da extração"""
        return self.extraction_progress
    
    async def validar_pasta(self, data: dict):
        """Valida se a pasta existe e retorna quantidade de imagens"""
        pasta = data.get("pasta", "")
        
        if not pasta or not os.path.exists(pasta):
            raise HTTPException(status_code=400, detail="Pasta não encontrada")
        
        extensoes = ['.jpg', '.jpeg', '.png']
        imagens = [f for f in os.listdir(pasta) 
                   if os.path.splitext(f)[1].lower() in extensoes]
        
        return {
            "valida": True,
            "quantidade_imagens": len(imagens),
            "imagens": imagens[:10]
        }
    
    async def validar_api_key(self, data: dict):
        """Valida se a API key é válida"""
        api_key = data.get("api_key", "")
        
        if not api_key:
            raise HTTPException(status_code=400, detail="API Key não fornecida")
        
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        try:
            response = requests.get(
                "https://api.openai.com/v1/models",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                return {"valida": True, "message": "API Key válida"}
            else:
                return {"valida": False, "message": "API Key inválida"}
                
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    async def extrair_textos(self, request: ExtractionRequest):
        """Inicia extração de textos das imagens"""
        if self.extraction_progress["running"]:
            raise HTTPException(status_code=400, detail="Extração já em andamento")
        
        pasta = request.pasta
        api_key = request.api_key
        quantidade = request.quantidade
        system_prompt = request.system_prompt
        user_prompt = request.user_prompt
        modelo = request.modelo
        qualidade = request.qualidade
        
        if not os.path.exists(pasta):
            raise HTTPException(status_code=400, detail="Pasta não encontrada")
        
        extensoes = ['.jpg', '.jpeg', '.png']
        imagens = [f for f in os.listdir(pasta) 
                   if os.path.splitext(f)[1].lower() in extensoes][:quantidade]
        
        if not imagens:
            raise HTTPException(status_code=400, detail="Nenhuma imagem encontrada")
        
        self.extraction_progress = {
            "running": True,
            "current": 0,
            "total": len(imagens),
            "results": [],
            "current_image": ""
        }
        
        resultados = []
        
        for i, img_nome in enumerate(imagens):
            
            # Verifica se a extração foi cancelada pelo usuário
            if not self.extraction_progress["running"]:
                break

            caminho = os.path.join(pasta, img_nome)
            
            self.extraction_progress["current"] = i + 1
            self.extraction_progress["current_image"] = img_nome
            
            inicio = time.time()
            texto_extraido = self.extrair_texto_gpt4(
                caminho, api_key, 
                system_prompt=system_prompt, 
                user_prompt=user_prompt, 
                modelo=modelo, 
                qualidade=qualidade
            )
            tempo = time.time() - inicio

            sucesso = "ERRO_API:" not in str(texto_extraido)
            
            resultado = {
                "imagem": img_nome,
                "texto_extraido": texto_extraido,
                "tempo": round(tempo, 2),
                "sucesso": sucesso
            }
            
            resultados.append(resultado)
            self.extraction_progress["results"].append(resultado)
            
            await asyncio.sleep(0.5)
        
        json_path = os.path.join(pasta, "resultados_extracao.json")
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(resultados, f, ensure_ascii=False, indent=2)
        
        self.extraction_progress["running"] = False
        
        total = len(resultados)
        sucesso_count = sum(1 for r in resultados if r["sucesso"])
        print(sucesso_count, total)
        
        return {
            "concluido": True,
            "total": total,
            "sucesso": sucesso_count,
            "erros": total - sucesso_count,
            "resultados": resultados,
            "arquivo_json": json_path
        }
    
    async def cancelar_extracao(self):
        """Cancela a extração em andamento"""
        if not self.extraction_progress["running"]:
            raise HTTPException(status_code=400, detail="Nenhuma extração em andamento")
        
        self.extraction_progress["running"] = False
        return {"cancelado": True, "message": "Extração cancelada"}
    
    # ============ ENDPOINTS DE DOWNLOAD ============
    
    async def download_json(self, request: DownloadRequest):
        """Gera arquivo JSON para download"""
        json_str = json.dumps(request.resultados, ensure_ascii=False, indent=2)
        
        return StreamingResponse(
            io.BytesIO(json_str.encode('utf-8')),
            media_type="application/json",
            headers={
                "Content-Disposition": f"attachment; filename=resultados_{time.strftime('%Y-%m-%d')}.json"
            }
        )
    
    async def download_csv(self, request: DownloadRequest):
        """Gera arquivo CSV para download"""
        output = io.StringIO()
        writer = csv.writer(output, delimiter=';', quoting=csv.QUOTE_ALL)
        
        writer.writerow(["Imagem", "Sucesso", "Tempo (s)", "Texto Extraído"])
        
        for r in request.resultados:
            texto = r.get("texto_extraido", "")
            if isinstance(texto, dict):
                texto = json.dumps(texto, ensure_ascii=False)
            writer.writerow([
                r.get("imagem", ""),
                "Sim" if r.get("sucesso") else "Não",
                r.get("tempo", ""),
                texto
            ])
        
        csv_bytes = output.getvalue().encode('utf-8-sig')
        
        return StreamingResponse(
            io.BytesIO(csv_bytes),
            media_type="text/csv; charset=utf-8",
            headers={
                "Content-Disposition": f"attachment; filename=resultados_{time.strftime('%Y-%m-%d')}.csv"
            }
        )
    
    async def download_excel(self, request: DownloadRequest):
        """Gera arquivo Excel (TSV) para download"""
        output = io.StringIO()
        
        output.write("Imagem\tSucesso\tTempo (s)\tTexto Extraído\n")
        
        for r in request.resultados:
            texto = r.get("texto_extraido", "")
            if isinstance(texto, dict):
                texto = json.dumps(texto, ensure_ascii=False)
            texto_limpo = str(texto).replace('\t', ' ').replace('\n', ' ').replace('\r', '')
            
            output.write(f"{r.get('imagem', '')}\t")
            output.write(f"{'Sim' if r.get('sucesso') else 'Não'}\t")
            output.write(f"{r.get('tempo', '')}\t")
            output.write(f"{texto_limpo}\n")
        
        excel_bytes = output.getvalue().encode('utf-8-sig')
        
        return StreamingResponse(
            io.BytesIO(excel_bytes),
            media_type="application/vnd.ms-excel",
            headers={
                "Content-Disposition": f"attachment; filename=resultados_{time.strftime('%Y-%m-%d')}.xls"
            }
        )


# Cria instância da API
extrator = ExtratorAPI()
app = extrator.app


if __name__ == "__main__":   
    uvicorn.run(app, host="127.0.0.1", port=8000)
