import { EncoderPresetSetting } from "../shared/VideoTrim/UserSettingsUtility.js";
import { editNewVideo } from "./ElectronUtility.js";

const { contextBridge, ipcRenderer } = (require("electron") as typeof Electron);

contextBridge.exposeInMainWorld("windowApi", {
    close: () => ipcRenderer.send("window-close"),
    minimize: () => ipcRenderer.send("window-minimize"),
    maximize: () => ipcRenderer.send("window-maximize"),
    move: (x: number, y: number) => ipcRenderer.send("window-move", x, y),
});

contextBridge.exposeInMainWorld("fileApi", {
    getDirectoryFileList: (dirPath: string) => ipcRenderer.invoke("get-directory-file-list", dirPath),
    promptChooseDirectory: () => ipcRenderer.invoke("prompt-choose-directory")
});

contextBridge.exposeInMainWorld("videoEditApi", {
    editAndApply: (
        originalVideoPath: string,
        trimStart: number,
        trimEnd: number,
        cropLeft: number,
        cropRight: number,
        cropTop: number,
        cropBottom: number,
        encoderPreset: EncoderPresetSetting,
        name?: string
    ) => ipcRenderer.invoke(
        "video-edit-and-apply",
        originalVideoPath,
        trimStart,
        trimEnd,
        cropLeft,
        cropRight,
        cropTop,
        cropBottom,
        encoderPreset,
        name
    ),
    editNewVideo: (
        originalVideoPath: string,
        trimStart: number,
        trimEnd: number,
        cropLeft: number,
        cropRight: number,
        cropTop: number,
        cropBottom: number,
        encoderPreset: EncoderPresetSetting,
        name: string
    ) => ipcRenderer.invoke(
        "video-edit",
        originalVideoPath,
        trimStart,
        trimEnd,
        cropLeft,
        cropRight,
        cropTop,
        cropBottom,
        encoderPreset,
        name
    ),
    promptSaveLocation: (
        originalName: string,
    ) => ipcRenderer.invoke("video-prompt-save-location", originalName),
    onProgress: (callback: (progress: number) => void) => {
        const listener = (
            _event: Electron.IpcRendererEvent,
            data: { progress: number },
        ) => {
            callback(data.progress);
        };

        ipcRenderer.on("video-edit-progress", listener);

        return () => {
            ipcRenderer.removeListener("video-edit-progress", listener);
        };
    },
});

contextBridge.exposeInMainWorld("redirectApi", {
    openGithubRepo: () => ipcRenderer.send("open-github-repo"),
    openGithubRepoReleases: () => ipcRenderer.send("open-github-repo-releases"),
});

contextBridge.exposeInMainWorld("settingsApi", {
    load: () => ipcRenderer.invoke("load-settings"),
    save: (settings: unknown) => ipcRenderer.invoke("save-settings", settings),
});

contextBridge.exposeInMainWorld("screenshotApi", {
    saveAndCopy: (pngDataUrl: string) =>
        ipcRenderer.invoke("save-and-copy-screenshot", pngDataUrl),
});