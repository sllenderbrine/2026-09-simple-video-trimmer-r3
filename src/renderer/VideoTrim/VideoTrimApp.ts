import { ConnectionOwner } from "../../shared/EventSignals/ConnectionOwner.js";
import { ObservedValue } from "../../shared/EventSignals/ObservedValue.js";
import { addRecentFolder } from "../../shared/VideoTrim/UserSettingsUtility.js";
import { ContextMenu } from "../Ui/ContextMenu.js";
import { NotificationIconType, NotificationSystem } from "../Ui/NotificationSystem.js";
import { WindowKeypresses } from "../Ui/WindowGlobal/WindowKeypresses.js";
import { EditApplier, VideoEditOptions } from "./EditApplier.js";
import { SettingsMenu } from "./SettingsMenu.js";
import { StartupMenu } from "./StartupMenu.js";
import { VdvSortMethod, VideoDirectoryViewer } from "./VideoDirectoryViewer.js";
import { VideoTrimEditor, VteCropPreset } from "./VideoTrimEditor.js";
import { VideoTrimSettings } from "./VideoTrimSettings.js";
import { VideoTrimWindowBar } from "./VideoTrimWindowBar.js";
import { VtebbDurationType } from "./VteBottomBar/VtebbDuration.js";

export class VideoTrimApp {
    contentEl: HTMLDivElement;
    excludedFileNames: Set<string> = new Set()
    vdirViewer: VideoDirectoryViewer;
    trimEditor: VideoTrimEditor;
    startupMenu: StartupMenu;
    windowBar: VideoTrimWindowBar;
    notificationSystem: NotificationSystem;
    settingsMenu: SettingsMenu | null = null;
    editApplier: EditApplier;
    editorOpened: boolean = false;
    loaded = new ObservedValue(false);
    settings: VideoTrimSettings;
    connectionOwner: ConnectionOwner = new ConnectionOwner();
    constructor() {
        this.contentEl = document.createElement("div");
        this.contentEl.classList.add("video-trim-app-content");

        this.settings = new VideoTrimSettings(this);

        this.windowBar = new VideoTrimWindowBar(this);
        
        this.notificationSystem = new NotificationSystem(this.windowBar);
        document.body.appendChild(this.notificationSystem.detailsContainerEl);
        document.body.appendChild(this.notificationSystem.activeContainerEl);

        this.notificationSystem.runAppActionEvent.connect((action, data) => {
            this.runAppAction(action, data);
        }, { owners: [ this.connectionOwner, ], });

        this.editApplier = new EditApplier(this);

        const vdv = new VideoDirectoryViewer(this);
        this.vdirViewer = vdv;
        this.contentEl.appendChild(vdv.containerEl);

        const vte = new VideoTrimEditor(this);
        this.trimEditor = vte;
        this.contentEl.appendChild(vte.containerEl);
        vte.setVisible(false);

        this.startupMenu = new StartupMenu(this);
        this.contentEl.appendChild(this.startupMenu.containerEl);

        const loadingNotif = this.notificationSystem.sendActiveNotification({
            title: "Loading",
            description: "Loading your settings...",
            iconType: NotificationIconType.LOADING,
            canClose: true,
            descriptionWordBreak: true,
        });

        this.settings.loaded.handle(v => {
            this.updateLoadedState();
            loadingNotif.setIconType(NotificationIconType.CHECK);
            loadingNotif.setTitle("Settings Loaded");
            loadingNotif.setDescription("");
            loadingNotif.setTimeout(3);
            if(this.settingsMenu != null)
                this.runAppAction("open-settings");
        }, { owners: [ this.connectionOwner, ], });

        vdv.videoOpenEvent.connect(vdvv => {
            this.editorOpened = true;
            vte.canvas.fitToContainerLock = true;
            vdv.setVisible(false);
            vte.setVisible(true);
            vte.loadVideo(vdvv);
        }, { owners: [ this.connectionOwner, ], });

        this.updateLoadedState();

        WindowKeypresses.keyDownEvent.connect(e => {
            const key = e.key.toLowerCase();
            if(key == "m" && e.ctrlKey) {
                e.preventDefault();
            } else if(key == "w" && e.ctrlKey) {
                e.preventDefault();
            } else if(key == "r" && e.shiftKey && e.ctrlKey) {
                this.runAppAction("hard-refresh");
                e.preventDefault();
            } else if(key == "r" && e.ctrlKey) {
                this.runAppAction("refresh");
                e.preventDefault();
            }
        }, { owners: [ this.connectionOwner ] });
    }

    updateLoadedState() {
        if(this.loaded.get())
            return;
        if(this.settings.loaded.get()) {
            document.body.appendChild(this.contentEl);
            this.loaded.set(true);
        }
    }

    async promptOpenDirectory() {
        const dir = await window.fileApi.promptChooseDirectory();
        if(dir != null) {
            return this.openVideoDirectory(dir);
        }
        return null;
    }

    async openVideoDirectory(path: string) {
        let res = await window.fileApi.getDirectoryFileList(path);
        if(res.success) {
            this.vdirViewer.loadVideos(path, res.value);
            this.startupMenu.containerEl.style.display = "none";
            return path;
        } else {
            const notif = this.notificationSystem.sendActiveNotification({
                title: "Error",
                iconType: NotificationIconType.ERROR,
                description: "Failed to get directory",
                detailedTitle: "Error",
                detailedDescription: `Error opening directory: ${res.error.message}`,
            });
        }
        return null;
    }

    isMenuOpened() {
        return this.settingsMenu != null;
    }

    runAppAction(action: string, options?: any) {
        switch(action) {
            case "open-folder":
                this.promptOpenDirectory().then(dir => {
                    if(dir) {
                        addRecentFolder(this.settings.settings, dir);
                        this.settings.save();
                        this.startupMenu.updateRecents();
                        this.startupMenu.updateStartLinks();
                    }
                });
                break;
            case "open-recent":
                if(options != null && typeof options.path === "string") {
                    this.openVideoDirectory(options.path);
                    addRecentFolder(this.settings.settings, options.path);
                    this.settings.save();
                    this.startupMenu.updateRecents();
                    this.startupMenu.updateStartLinks();
                }
                break;
            case "save-editor":
                if(!this.editorOpened)
                    break;
                let editOptions: VideoEditOptions = {
                    path: this.trimEditor.videoPath,
                    renameTo: this.trimEditor.bottomBar.toolsLeft.getTitle(),
                    cropLeft: this.trimEditor.cropX.x,
                    cropRight: this.trimEditor.cropX.y,
                    cropTop: this.trimEditor.cropY.x,
                    cropBottom: this.trimEditor.cropY.y,
                    trimStart: this.trimEditor.canvas.video.getMinSeek() ?? 0,
                    trimEnd: this.trimEditor.canvas.video.getMaxSeek() ?? this.trimEditor.canvas.video.videoEl.duration,
                };
                this.editApplier.queueEdit(editOptions);
                this.runAppAction("close-editor");
                break;
            case "save-as-editor":
                if(!this.editorOpened)
                    break;

                window.videoEditApi.promptSaveLocation(this.trimEditor.bottomBar.toolsLeft.getTitle()).then(res => {
                    if(res.success) {
                        let editOptions2: VideoEditOptions = {
                            path: this.trimEditor.videoPath,
                            renameTo: res.value.name,
                            cropLeft: this.trimEditor.cropX.x,
                            cropRight: this.trimEditor.cropX.y,
                            cropTop: this.trimEditor.cropY.x,
                            cropBottom: this.trimEditor.cropY.y,
                            trimStart: this.trimEditor.canvas.video.getMinSeek() ?? 0,
                            trimEnd: this.trimEditor.canvas.video.getMaxSeek() ?? this.trimEditor.canvas.video.videoEl.duration,
                            saveAsNew: true,
                        };
                        this.editApplier.queueEdit(editOptions2);
                        this.runAppAction("close-editor");
                    } else {
                        this.notificationSystem.sendActiveNotification({
                            title: "Error Saving",
                            iconType: NotificationIconType.ERROR,
                            description: res.error.message,
                            detailedTitle: "Edits Failed",
                            detailedDescription: `Edits failed before starting: ${res.error.message}`,
                        })
                    }
                });
                break;
            case "save-as-new-editor":
                if(!this.editorOpened)
                    break;
                let editOptions2: VideoEditOptions = {
                    path: this.trimEditor.videoPath,
                    renameTo: this.trimEditor.bottomBar.toolsLeft.getTitle(),
                    cropLeft: this.trimEditor.cropX.x,
                    cropRight: this.trimEditor.cropX.y,
                    cropTop: this.trimEditor.cropY.x,
                    cropBottom: this.trimEditor.cropY.y,
                    trimStart: this.trimEditor.canvas.video.getMinSeek() ?? 0,
                    trimEnd: this.trimEditor.canvas.video.getMaxSeek() ?? this.trimEditor.canvas.video.videoEl.duration,
                    saveAsNew: true,
                };
                this.editApplier.queueEdit(editOptions2);
                this.runAppAction("close-editor");
                break;
            case "toggle-settings":
                if(this.settingsMenu != null)
                    this.runAppAction("close-settings");
                else
                    this.runAppAction("open-settings");
                break;
            case "open-settings":
                this.runAppAction("close-settings");
                this.settingsMenu = new SettingsMenu(this);
                break;
            case "close-settings":
                if(this.settingsMenu != null) {
                    this.settingsMenu.remove();
                    this.settingsMenu = null;
                }
                break;
            case "toggle-notification-details":
                this.notificationSystem.toggleDetailsVisible();
                break;
            case "editor-toggle-mute":
                if(!this.editorOpened)
                    break;
                this.trimEditor.bottomBar.toolsRight.toggleMuted();
                break;
            case "filter-by":
                this.vdirViewer.filter = options.value;
                this.vdirViewer.updateVideoVisibilities();
                this.vdirViewer.rebuildLoaderVideoArrays();
                break;
            case "view-all-notification-details":
                this.notificationSystem.viewDetails();
                break;
            case "dismiss-all-notifications":
                this.notificationSystem.dismissAll();
                break;
            case "clear-recent":
                this.settings.settings.recentFolders = [];
                this.settings.save();
                this.startupMenu.updateRecents();
                this.startupMenu.updateStartLinks();
                break;
            case "close-folder":
                this.vdirViewer.unloadVideos();
                this.startupMenu.containerEl.style.display = "flex";
                break;
            case "refresh":
                this.vdirViewer.refresh();
                break;
            case "hard-refresh":
                this.vdirViewer.hardRefresh();
                break;
            case "sort-date-recent":
                this.vdirViewer.sortMethod = VdvSortMethod.DATE_RECENT;
                this.vdirViewer.updateVideoSort();
                break;
            case "sort-date-old":
                this.vdirViewer.sortMethod = VdvSortMethod.DATE_OLD;
                this.vdirViewer.updateVideoSort();
                break;
            case "sort-name-a-z":
                this.vdirViewer.sortMethod = VdvSortMethod.NAME_A_Z;
                this.vdirViewer.updateVideoSort();
                break;
            case "sort-name-z-a":
                this.vdirViewer.sortMethod = VdvSortMethod.NAME_Z_A;
                this.vdirViewer.updateVideoSort();
                break;
            case "sort-duration-long":
                this.vdirViewer.sortMethod = VdvSortMethod.DURATION_LONG;
                this.vdirViewer.updateVideoSort();
                break;
            case "sort-duration-short":
                this.vdirViewer.sortMethod = VdvSortMethod.DURATION_SHORT;
                this.vdirViewer.updateVideoSort();
                break;
            case "sort-size-big":
                this.vdirViewer.sortMethod = VdvSortMethod.SIZE_BIG;
                this.vdirViewer.updateVideoSort();
                break;
            case "sort-size-small":
                this.vdirViewer.sortMethod = VdvSortMethod.SIZE_SMALL;
                this.vdirViewer.updateVideoSort();
                break;
            case "sort-random":
                this.vdirViewer.sortMethod = VdvSortMethod.OTHER_RANDOM;
                this.vdirViewer.updateVideoSort();
                break;
            case "toggle-free-move":
                if(this.editorOpened) {
                    let locked = !this.trimEditor.canvas.fitToContainerLock;
                    this.trimEditor.canvas.fitToContainerLock = locked;
                    if(locked) {
                        this.trimEditor.canvas.zoomToCenterFitContainer();
                        this.trimEditor.canvas.render();
                    }
                }
                break;
            case "close-editor":
                if(this.editorOpened) {
                    this.editorOpened = false;
                    this.vdirViewer.setVisible(true);
                    this.trimEditor.setVisible(false);
                    this.trimEditor.canvas.video.unloadVideo();
                }
                break;
            case "toggle-loop":
                if(this.editorOpened) {
                    this.trimEditor.canvas.video.setLooped(!this.trimEditor.canvas.video.isLooped());
                }
                break;
            case "toggle-pin-timeline":
                if(this.editorOpened) {
                    this.trimEditor.bottomBar.setPinned(!this.trimEditor.bottomBar.isPinned());
                }
                break;
            case "toggle-duration-display-type":
                if(!this.editorOpened)
                    break;
                if(this.trimEditor.bottomBar.duration.durationType == VtebbDurationType.PRECISE)
                    this.trimEditor.bottomBar.duration.durationType = VtebbDurationType.DEFAULT;
                else
                    this.trimEditor.bottomBar.duration.durationType = VtebbDurationType.PRECISE;
                break;
            case "editor-snapshot":
                if(!this.editorOpened)
                    break;
                this.trimEditor.canvas.saveScreenshot().then(result => {
                    if(result.success) {
                        this.notificationSystem.sendActiveNotification({
                            title: "Screenshot Saved",
                            description: "Screenshot saved to:" + result.value.path,
                            iconType: NotificationIconType.CHECK,
                            timeout: 3,
                            detailedTitle: "Video Screenshot Saved",
                            detailedDescription: `Extracted frame from ${this.trimEditor.videoPath} at ${this.trimEditor.canvas.video.videoEl.currentTime}s. Saved to location: ${result.value.path}`,
                            canClose: true,
                        });
                    } else {
                        console.error("Failed to save screenshot: " + result.error.message);
                        const notif = this.notificationSystem.sendActiveNotification({
                            title: "Error",
                            description: "",
                            iconType: NotificationIconType.ERROR,
                            detailedTitle: "Video Screenshot Error",
                            detailedDescription: `Failed to extract frame from ${this.trimEditor.videoPath} at ${this.trimEditor.canvas.video.videoEl.currentTime}s: ${result.error.message}`,
                            canClose: true,
                        });
                        notif.descriptionEl.innerHTML = "<span>Failed to save screenshot</span>" + notif.descriptionEl.innerHTML;
                        notif.descriptionEl.querySelector("span")!.style.wordBreak = "break-word";
                    }
                });
                break;
            case "editor-set-crop-preset":
                if(!this.editorOpened)
                    break;
                if(options != null) {
                    this.trimEditor.setCropPreset(options.preset);
                }
                break;
            case "undo-editor":
                if(!this.editorOpened)
                    break;
                this.trimEditor.undo();
                break;
            case "redo-editor":
                if(!this.editorOpened)
                    break;
                this.trimEditor.redo();
                break;
            case "editor-trim-start":
                this.trimEditor.canvas.video.setMinSeek(this.trimEditor.canvas.video.getTargetTime());
                this.trimEditor.bottomBar.duration.updateTrim();
                break;
            case "editor-trim-end":
                this.trimEditor.canvas.video.setMaxSeek(this.trimEditor.canvas.video.getTargetTime());
                this.trimEditor.bottomBar.duration.updateTrim();
                break;
            case "editor-trim-reset":
                this.trimEditor.canvas.video.setMinSeek(0);
                this.trimEditor.canvas.video.setMaxSeek(this.trimEditor.canvas.video.videoEl.duration);
                this.trimEditor.bottomBar.duration.updateTrim();
                break;
            case "editor-crop-toggle-nlr":
                switch(this.trimEditor.cropPreset) {
                    case VteCropPreset.NONE:
                        this.trimEditor.setCropPreset(VteCropPreset.LEFT_HALF);
                        break;
                    case VteCropPreset.LEFT_HALF:
                        this.trimEditor.setCropPreset(VteCropPreset.RIGHT_HALF);
                        break;
                    default:
                        this.trimEditor.setCropPreset(VteCropPreset.NONE);
                        break;
                }
                break;
            case "exit":
                if(options != null && options.ctxbtn != null) {
                    let rect = options.ctxbtn.buttonEl.getBoundingClientRect();
                    const menu = new ContextMenu(null, rect.left, rect.top);
                    menu.addLayout([
                        {
                            title: "Confirm?",
                            disabled: true,
                        },
                        {
                            title: "Cancel",
                            dangerSeparator: true,
                        },
                        {
                            title: "Exit",
                            danger: true,
                            icon: "cross",
                            data: { action: "exit-confirm", },
                        }
                    ]);
                    menu.buttons[0]!.prefixIconEl!.style.width = "8px";
                    menu.clickOffEvent.connect(e => {
                        menu.remove();
                    }, { owners: [ this.connectionOwner, menu.connectionOwner, ], });
                    menu.buttonClickEvent.connect(e2 => {
                        if(e2.data != null && e2.data.action === "exit-confirm") {
                            window.windowApi.close();
                        }
                        menu.remove();
                    }, { owners: [ this.connectionOwner, menu.connectionOwner, ], });
                } else {
                    window.windowApi.close();
                }
                break;
            case "open-github-repo":
                window.redirectApi.openGithubRepo();
                break;
            case "coming-soon":
                this.notificationSystem.sendActiveNotification({
                    title: "Coming Soon",
                    iconType: NotificationIconType.INFO,
                    description: "This feature is coming soon",
                    descriptionWordBreak: true,
                    timeout: 3,
                })
                break;
        }
    }
}