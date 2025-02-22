import { contextBridge, ipcRenderer } from "electron";

export const backend = {
  openFile: () => ipcRenderer.invoke('dialog:openFile'), // Define the openFile function
  readFile: (filePath: string) =>
      ipcRenderer.invoke('file:readFile', filePath)
};

contextBridge.exposeInMainWorld("backend", backend);
