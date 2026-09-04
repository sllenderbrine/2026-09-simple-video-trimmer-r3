import { app, BrowserWindow, ipcMain, Menu, dialog, shell, clipboard, nativeImage, ClipboardItem } from "electron";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import path from "path";
import { editAndApply, editNewVideo, getDirectoryFileList } from "./ElectronUtility.js";
import { loadSettings, saveSettings } from "./UserSettings.js";
import { ErrorMessageResult } from "../shared/Utility/PromiseUtility.js";
import { EncoderPresetSetting } from "../shared/VideoTrim/UserSettingsUtility.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = app.getAppPath();

let mainWindow: BrowserWindow;

if(app.isPackaged) {
    // Disables dev shortcuts
    Menu.setApplicationMenu(null);
}

function backslashesToForward(str: string) {
    return str.replace(/\\/g, "/");
}

function endWithForwardSlash(str: string) {
    if(str.substring(str.length - 1) != "/")
        return str + "/";
    return str;
}

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 1140,
        height: 800,
        minWidth: 450,
        minHeight: 250,
        frame: false,
        autoHideMenuBar: true,
        icon: path.join(__dirname, "../../resources/icons/app.ico"),
        webPreferences: {
            preload: path.join(__dirname, "preload.cjs"),
            contextIsolation: true,
            nodeIntegration: false
        }
    });
    return mainWindow;
}

async function init() {
    await app.whenReady();

    const win = createMainWindow();

    win.loadFile(path.join(root, "resources", "html", "index.html"));
}

// Window API
ipcMain.on("window-close", (event) => {
    BrowserWindow.fromWebContents(event.sender)?.close();
});

ipcMain.on("window-minimize", (event) => {
    BrowserWindow.fromWebContents(event.sender)?.minimize();
});

ipcMain.on("window-maximize", (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if(!win) return;
    if(win.isMaximized()) win.restore();
    else win.maximize();
});

ipcMain.on("window-move", (event, x: number, y: number) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if(!win) return;
    let [x1, y1] = win.getPosition() as [number, number];
    win.setPosition(x1 + x, y1 + y);
});

// File API
ipcMain.handle(
    "get-directory-file-list",
    async (_, directory: string) => getDirectoryFileList(directory),
);

ipcMain.handle("prompt-choose-directory", async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        title: "Choose Folder",
        properties: ["openDirectory"]
    });

    if (result.canceled || !result.filePaths[0]) {
        return null;
    }

    return endWithForwardSlash(backslashesToForward(result.filePaths[0]));
});

// Video editing API
ipcMain.handle(
    "video-edit-and-apply",
    (
        event,
        originalVideoPath: string,
        trimStart: number,
        trimEnd: number,
        cropLeft: number,
        cropRight: number,
        cropTop: number,
        cropBottom: number,
        encoderPreset: EncoderPresetSetting,
        renameValueNoExt?: string,
    ) =>
        editAndApply(
            originalVideoPath,
            trimStart,
            trimEnd,
            cropLeft,
            cropRight,
            cropTop,
            cropBottom,
            encoderPreset,
            renameValueNoExt,
            progress => {
                event.sender.send("video-edit-progress", {
                    progress,
                });
            },
        )
);
ipcMain.handle(
    "video-edit",
    (
        event,
        originalVideoPath: string,
        trimStart: number,
        trimEnd: number,
        cropLeft: number,
        cropRight: number,
        cropTop: number,
        cropBottom: number,
        encoderPreset: EncoderPresetSetting,
        nameNoExt: string,
    ) =>
        editNewVideo(
            originalVideoPath,
            trimStart,
            trimEnd,
            cropLeft,
            cropRight,
            cropTop,
            cropBottom,
            encoderPreset,
            nameNoExt,
            progress => {
                event.sender.send("video-edit-progress", {
                    progress,
                });
            },
        )
);
ipcMain.handle(
    "video-prompt-save-location",
    async (_, originalName: string) => {
        const result = await dialog.showSaveDialog({
            title: "Save Edited Video",
            defaultPath: originalName + ".mp4",
            filters: [
                {
                    name: "MP4 Video",
                    extensions: ["mp4"],
                },
            ],
        });

        if (result.canceled) {
            return {
                success: false,
                error: { message: "dialog was cancelled", },
            };
        }

        if (!result.filePath) {
            return {
                success: false,
                error: { message: "file path is undefined", },
            };
        }

        return {
            success: true,
            value: { name: path.basename(result.filePath, path.extname(result.filePath)), },
        };
    }
)

// Redirect API
ipcMain.on("open-github-repo", (event) => {
    shell.openExternal("https://github.com/sllenderbrine/2026-07-simple-video-trimmer-r2-public1");
});

ipcMain.on("open-github-repo-releases", (event) => {
    shell.openExternal("https://github.com/sllenderbrine/2026-07-simple-video-trimmer-r2-public1/releases");
});

// Settings API
ipcMain.handle("load-settings", async () => {
    return await loadSettings();
});

ipcMain.handle("save-settings", async (_, settings) => {
    return await saveSettings(settings);
});

// Screenshot API
async function saveAndCopyScreenshot(pngDataUrl: string): Promise<ErrorMessageResult<{
    path: string;
}>> {
    if(!pngDataUrl.startsWith("data:image/png;base64,"))
        return {
            success: false,
            error: { message: "Invalid screenshot data", },
        };

    const image = nativeImage.createFromDataURL(pngDataUrl);

    if(image.isEmpty())
        return {
            success: false,
            error: { message: "Failed to decode screenshot", },
        };

    const screenshotsDirectory = path.join(
        app.getPath("pictures"),
        "Screenshots",
    );

    await fs.mkdir(screenshotsDirectory, { recursive: true });

    const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-");

    const filePath = path.join(
        screenshotsDirectory,
        `simple-video-trimmer-${timestamp}.png`,
    );

    await fs.writeFile(filePath, image.toPNG());

    const png = image.toPNG();

    await clipboard.write([
        new ClipboardItem({
            "image/png": new Blob([ png as BlobPart ], { type: "image/png", }),
        }),
    ]);

    return {
        success: true,
        value: { path: filePath, },
    };
}
ipcMain.handle(
    "save-and-copy-screenshot",
    async (_, pngDataUrl: string) => {
        return saveAndCopyScreenshot(pngDataUrl);
    },
);

// initialize
init();
