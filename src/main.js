const { app, BrowserWindow, Menu, dialog, shell, ipcMain } = require('electron');
const path = require('path');
const Store = require('electron-store');
const { autoUpdater } = require('electron-updater');

const store = new Store();
let mainWindow;

if (process.env.NODE_ENV === 'development') {
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, '..', 'node_modules', '.bin', 'electron'),
        hardResetMethod: 'exit'
    });
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 800,
        minHeight: 600,
        icon: path.join(__dirname, '../assets/icons/icon.png'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, 'preload.js')
        },
        show: false
    });

    mainWindow.loadFile(path.join(__dirname, 'renderer.html'));
    mainWindow.once('ready-to-show', () => mainWindow.show());
    mainWindow.on('closed', () => { mainWindow = null; });
    
    const menu = Menu.buildFromTemplate([ { label: 'File', submenu: [{ label: 'Quit', accelerator: 'CmdOrCtrl+Q', click: () => app.quit() }] }, { label: 'Edit', submenu: [ { role: 'undo' }, { role: 'redo' }, { type: 'separator' }, { role: 'cut' }, { role: 'copy' }, { role: 'paste' } ] }, { label: 'View', submenu: [ { role: 'reload' }, { role: 'toggleDevTools' }, { type: 'separator' }, { role: 'togglefullscreen' } ] }]);
    Menu.setApplicationMenu(menu);
}

// IPC Handlers
ipcMain.handle('store-get', (event, key) => store.get(key));
ipcMain.handle('store-set', (event, key, value) => store.set(key, value));
ipcMain.handle('store-delete', (event, key) => store.delete(key));
ipcMain.handle('store-clear', () => store.clear());
ipcMain.on('open-path', (event, path) => shell.openPath(path));
ipcMain.handle('dialog:open-folder', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, { properties: ['openDirectory'] });
    if (!canceled) return filePaths[0];
});

// App Events
app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
