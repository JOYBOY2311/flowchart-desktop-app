const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    store: {
        get: (key) => ipcRenderer.invoke('store-get', key),
        set: (key, value) => ipcRenderer.invoke('store-set', key, value),
        delete: (key) => ipcRenderer.invoke('store-delete', key),
        clear: () => ipcRenderer.invoke('store-clear')
    },
    onMenuNewProject: (callback) => ipcRenderer.on('menu-new-project', callback),
    openPath: (path) => ipcRenderer.send('open-path', path),
    openFolderDialog: () => ipcRenderer.invoke('dialog:open-folder'),
    platform: process.platform
});

window.addEventListener('beforeunload', () => {
    ipcRenderer.removeAllListeners('menu-new-project');
});
