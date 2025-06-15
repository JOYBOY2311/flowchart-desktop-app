const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
    // Storage operations
    store: {
        get: (key) => ipcRenderer.invoke('store-get', key),
        set: (key, value) => ipcRenderer.invoke('store-set', key, value),
        delete: (key) => ipcRenderer.invoke('store-delete', key),
        clear: () => ipcRenderer.invoke('store-clear')
    },

    // Menu event listeners
    onMenuNewProject: (callback) => ipcRenderer.on('menu-new-project', callback),
    onMenuExportData: (callback) => ipcRenderer.on('menu-export-data', callback),
    onMenuImportData: (callback) => ipcRenderer.on('menu-import-data', callback),

    // File system operations (for import/export)
    writeFile: (filePath, data) => ipcRenderer.invoke('write-file', filePath, data),
    readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),

    // Platform information
    platform: process.platform
});

// Remove listeners when navigating away
window.addEventListener('beforeunload', () => {
    ipcRenderer.removeAllListeners('menu-new-project');
    ipcRenderer.removeAllListeners('menu-export-data');
    ipcRenderer.removeAllListeners('menu-import-data');
});
