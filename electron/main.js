const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const { spawn } = require("child_process");
const fs = require("fs");

let mainWindow;
let pythonProcess;

// Usar apenas app.isPackaged para determinar se é produção
const isDev = !app.isPackaged;

// Python só é necessário em DEV
function findPython() {
  const possiblePaths = [
    "python",
    "python3",
    path.join(__dirname, "../backend/venv/Scripts/python.exe"),
    "C:\\Users\\" +
      process.env.USERNAME +
      "\\AppData\\Local\\Programs\\Python\\Python312\\python.exe",
  ];

  for (const p of possiblePaths) {
    try {
      if (fs.existsSync(p) || p === "python" || p === "python3") {
        return p;
      }
    } catch {}
  }
  return "python";
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
    show: false,
    autoHideMenuBar: true,
    backgroundColor: "#1a1a2e",
    ...(process.platform === "win32" && {
      icon: path.join(__dirname, "..", "public", "icone.png"),
    }),
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  mainWindow.once("ready-to-show", () => mainWindow.show());

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// 🚀 Inicializa Backend
function startPythonBackend() {
  if (pythonProcess) return;

  const backendPath = isDev
    ? path.join(__dirname, "../backend")
    : path.join(process.resourcesPath, "backend");

  if (isDev) {
    // DEV → roda api.py pelo Python do sistema/venv
    const pythonPath = findPython();
    const scriptPath = path.join(backendPath, "api.py");

    pythonProcess = spawn(pythonPath, [scriptPath], {
      cwd: backendPath,
    });
  } else {
    // PROD → roda api.exe empacotado
    const exePath = path.join(backendPath, "api.exe");

    if (!fs.existsSync(exePath)) {
      dialog.showErrorBox("Erro", "Backend api.exe não encontrado.");
      return;
    }

    pythonProcess = spawn(exePath, [], {
      cwd: backendPath,
    });
  }

  // Logs do backend
  pythonProcess.stdout?.on("data", (data) => {
    console.log("[BACKEND]:", data.toString());
  });

  pythonProcess.stderr?.on("data", (data) => {
    console.error("[BACKEND ERROR]:", data.toString());
  });

  pythonProcess.on("close", (code) => {
    console.log("Backend finalizado. Código:", code);
    pythonProcess = null;
  });
}

// ===== IPC =====

ipcMain.handle("select-folder", async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"],
    title: "Selecione a pasta",
  });
  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle("get-app-version", () => app.getVersion());

// ===== Ciclo App =====

app.whenReady().then(() => {
  startPythonBackend();
  setTimeout(createWindow, 1500); // tempo simples de boot
});

app.on("window-all-closed", () => {
  if (pythonProcess) pythonProcess.kill();
  if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", () => {
  if (pythonProcess) pythonProcess.kill();
});
