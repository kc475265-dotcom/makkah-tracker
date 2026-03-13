const { app, BrowserWindow, Menu, shell, dialog } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    title: 'Makkah 1376 — Construction Tracker',
    icon: path.join(__dirname, 'assets', 'icon.png'),
    backgroundColor: '#070d18',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
    },
    show: false,
  });

  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('closed', () => { mainWindow = null; });
}

const menuTemplate = [
  {
    label: 'File',
    submenu: [
      { label: 'Save (Ctrl+S)', accelerator: 'CmdOrCtrl+S', click: () => mainWindow?.webContents.executeJavaScript('saveAll()') },
      { label: 'Export Excel', accelerator: 'CmdOrCtrl+E', click: () => mainWindow?.webContents.executeJavaScript('exportMasterExcel("all")') },
      { type: 'separator' },
      { role: 'quit', label: 'Exit' }
    ]
  },
  {
    label: 'View',
    submenu: [
      { label: 'Dashboard',    accelerator: 'CmdOrCtrl+1', click: () => mainWindow?.webContents.executeJavaScript("document.querySelectorAll('.tab')[0].click()") },
      { label: 'Blocks',       accelerator: 'CmdOrCtrl+2', click: () => mainWindow?.webContents.executeJavaScript("document.querySelectorAll('.tab')[1].click()") },
      { label: 'Master Sheet', accelerator: 'CmdOrCtrl+3', click: () => mainWindow?.webContents.executeJavaScript("document.querySelectorAll('.tab')[2].click()") },
      { label: 'Daily Report', accelerator: 'CmdOrCtrl+4', click: () => mainWindow?.webContents.executeJavaScript("document.querySelectorAll('.tab')[3].click()") },
      { type: 'separator' },
      { role: 'togglefullscreen' },
      { role: 'reload' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { role: 'resetZoom' },
    ]
  },
  {
    label: 'Help',
    submenu: [
      { label: 'About', click: () => dialog.showMessageBox(mainWindow, { type: 'info', title: 'About', message: 'Makkah 1376 Tracker v4.0', detail: 'Block-wise precast element tracking\n32,000+ elements | 33 Blocks' }) }
    ]
  }
];

app.whenReady().then(() => {
  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
