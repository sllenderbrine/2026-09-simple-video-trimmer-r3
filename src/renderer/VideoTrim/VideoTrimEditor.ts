import { ConnectionOwner } from "../../shared/EventSignals/ConnectionOwner.js";
import { HtmlConnection } from "../../shared/EventSignals/HtmlConnection.js";
import { Vec2 } from "../../shared/Vectors/Vec2.js";
import { ContextMenu } from "../Ui/ContextMenu.js";
import { NotificationIconType } from "../Ui/NotificationSystem.js";
import { VideoPlayerCanvas } from "../Ui/VideoPlayerCanvas.js";
import { renderEvent } from "../Ui/WindowGlobal/WindowEvents.js";
import { WindowKeypresses } from "../Ui/WindowGlobal/WindowKeypresses.js";
import { VdvVideo } from "./VideoDirectoryViewer.js";
import type { VideoTrimApp } from "./VideoTrimApp.js";
import { CHECK_ICON, UNCHECK_ICON } from "./VideoTrimWindowBar.js";
import { VtebbDurationType } from "./VteBottomBar/VtebbDuration.js";
import { VteBottomBar } from "./VteBottomBar/VteBottomBar.js";

const SHIFT_SPEED = 50;
const PRECISE_SHIFT_SPEED = 250;
const ZOOM_SPEED = 1.1;
const PRECISE_ZOOM_SPEED = 1.01;

export enum VteCropPreset {
    NONE = 0,
    LEFT_HALF = 1,
    RIGHT_HALF = 2,
    TOP_HALF = 3,
    BOTTOM_HALF = 4,
    CUSTOM = 5,
}

export type HistoryAction = { type: string, data: any, };

export class VideoTrimEditor {
    containerEl: HTMLDivElement;
    canvas: VideoPlayerCanvas;
    bottomBar: VteBottomBar;
    visible: boolean = true;
    videoPath: string = "";
    cropPreset = VteCropPreset.NONE;
    cropX: Vec2 = Vec2.zero();
    cropY: Vec2 = Vec2.zero();
    undoActions: HistoryAction[] = [];
    redoActions: HistoryAction[] = [];
    connectionOwner: ConnectionOwner = new ConnectionOwner();
    constructor(
        public app: VideoTrimApp
    ) {
        this.containerEl = document.createElement("div");
        this.containerEl.classList.add("video-trim-editor-container");

        this.canvas = new VideoPlayerCanvas();
        this.containerEl.appendChild(this.canvas.renderedCanvas.containerEl);
        this.canvas.renderedCanvas.containerEl.classList.add("video-player-canvas-container");
        this.canvas.renderedCanvas.canvasEl.classList.add("vpc-canvas");

        let videoErrorTime = performance.now();
        let videoErrorOverflow = 0;
        this.canvas.video.errorEvent.connect((message) => {
            if(performance.now() - videoErrorTime < 1000) {
                videoErrorOverflow++;
                if(videoErrorOverflow > 3)
                    return;
            } else {
                videoErrorOverflow = 0;
            }
            videoErrorTime = performance.now();
            this.app.notificationSystem.sendActiveNotification({
                title: "Error",
                iconType: NotificationIconType.ERROR,
                description: "Error loading video: " + message,
                timeout: 10,
            });
        }, { owners: [ this.connectionOwner ] });
        
        let playPauseAnimId = 0;
        let rewindAnimId = 0;
        let fastforwardAnimId = 0;
        WindowKeypresses.keyDownEvent.connect(e => {
            if(!this.visible)
                return;
            if(document.activeElement == this.bottomBar.toolsLeft.textBoxEl)
                return;
            if(this.app.isMenuOpened())
                return;
            const key = e.key.toLowerCase();
            if(key == " " || key == "k") {
                if(this.canvas.isUserPaused()) {
                    this.canvas.play();
                    this.bottomBar.toolsCenter.setPlaying(true);
                    playPauseAnimId = this.bottomBar.toolsCenter.playButtonEl.animClickDown();
                } else {
                    this.canvas.pause();
                    this.bottomBar.toolsCenter.setPlaying(false);
                    playPauseAnimId = this.bottomBar.toolsCenter.playButtonEl.animClickDown();
                }
                this.bottomBar.focus();
            } else if(key == "arrowleft") {
                this.canvas.seekTo(this.canvas.video.videoEl.currentTime - 3);
                this.bottomBar.focus();
                rewindAnimId = this.bottomBar.toolsCenter.backwardButtonEl.animClickDown();
            } else if(key == "arrowright") {
                this.canvas.seekTo(this.canvas.video.videoEl.currentTime + 3);
                this.bottomBar.focus();
                fastforwardAnimId = this.bottomBar.toolsCenter.forwardButtonEl.animClickDown();
            } else if(key == ",") {
                this.canvas.seekTo(this.canvas.video.videoEl.currentTime - 1 / 60);
                this.bottomBar.focus();
            } else if(key == ".") {
                this.canvas.seekTo(this.canvas.video.videoEl.currentTime + 1 / 60);
                this.bottomBar.focus();
            } else if(key == "z" && e.ctrlKey && e.shiftKey) {
                this.redo();
            } else if(key == "z" && e.ctrlKey) {
                this.undo();
            } else if(key == "q" && e.ctrlKey && e.shiftKey) {
                this.app.runAppAction("editor-trim-reset");
            } else if(key == "q" && e.ctrlKey) {
                this.app.runAppAction("editor-trim-start");
            } else if(key == "e" && e.ctrlKey) {
                this.app.runAppAction("editor-trim-end");
            } else if(key == "g" && e.ctrlKey) {
                this.app.runAppAction("editor-crop-toggle-nlr");
            } else if(key == "s" && e.ctrlKey && e.shiftKey) {
                this.app.runAppAction("save-as-editor");
            } else if(key == "s" && e.ctrlKey) {
                this.app.runAppAction("save-editor");
            } else if(key == "m" && e.ctrlKey) {
                this.app.runAppAction("editor-toggle-mute");
            } else if(key == "n" && e.ctrlKey && e.shiftKey) {
                this.app.runAppAction("save-as-new-editor");
            } else if(key == "c" && e.ctrlKey && e.shiftKey) {
                this.app.runAppAction("close-editor");
            }
        }, { owners: [ this.connectionOwner ] });
        WindowKeypresses.keyUpEvent.connect(e => {
            if(!this.visible)
                return;
            const key = e.key.toLowerCase();
            if(key == " " || key == "k") {
                this.bottomBar.toolsCenter.playButtonEl.animClickUp(playPauseAnimId);
            } else if(key == "arrowleft") {
                this.bottomBar.toolsCenter.backwardButtonEl.animClickUp(rewindAnimId);
            } else if(key == "arrowright") {
                this.bottomBar.toolsCenter.forwardButtonEl.animClickUp(fastforwardAnimId);
            }
        }, { owners: [ this.connectionOwner ] });
        new HtmlConnection(window, "wheel", (e: WheelEvent) => {
            if(!this.visible)
                return;
            if(!this.bottomBar.hovering) {
                if(e.ctrlKey)
                    this.canvas.fitToContainerLock = false
                if(!this.canvas.fitToContainerLock) {
                    if(e.ctrlKey) {
                        this.canvas.zoomInTo(e.clientX, e.clientY, e.deltaY < 0 ? ZOOM_SPEED : 1 / ZOOM_SPEED);
                    } else if(e.shiftKey) {
                        this.canvas.shift(e.deltaY > 0 ? SHIFT_SPEED : -SHIFT_SPEED, 0);
                    } else {
                        this.canvas.shift(0, e.deltaY > 0 ? SHIFT_SPEED : -SHIFT_SPEED);
                    }
                }
            }
        }, { owners: [ this.connectionOwner ] });
        renderEvent.connect(dt => {
            if(!this.visible)
                return;
            if(!this.canvas.fitToContainerLock && !this.bottomBar.hovering) {
                let mx = (WindowKeypresses.isKeyDown("a") ? -1 : 0) + (WindowKeypresses.isKeyDown("d") ? 1 : 0);
                let my = (WindowKeypresses.isKeyDown("s") ? 1 : 0) + (WindowKeypresses.isKeyDown("w") ? -1 : 0);
                if(mx !== 0 || my !== 0) {
                    this.canvas.shift(mx * dt * PRECISE_SHIFT_SPEED, my * dt * PRECISE_SHIFT_SPEED);
                }
                let dz = (WindowKeypresses.isKeyDown("=") ? PRECISE_ZOOM_SPEED : 1) * (WindowKeypresses.isKeyDown("-") ? 1 / PRECISE_ZOOM_SPEED : 1);
                if(dz !== 1) {
                    this.canvas.zoomInToContainerCenter(dz);
                }
            }
        }, { owners: [ this.connectionOwner ] });

        this.bottomBar = new VteBottomBar(this);
        this.containerEl.appendChild(this.bottomBar.containerEl);

        this.bottomBar.toolsRight.volumeInputEvent.connect(vol => {
            this.canvas.video.setVolume(vol);
        }, { owners: [ this.connectionOwner, ], });

        let seekInputT = 0;
        this.bottomBar.duration.seekInputEvent.connect(t => {
            seekInputT = t;
            this.canvas.seekTo(t);
        }, { owners: [ this.connectionOwner, ], });
        this.bottomBar.duration.seekStartEvent.connect(() => {
            this.canvas.video.setInputtingSeek(true);
        }, { owners: [ this.connectionOwner, ], });
        this.bottomBar.duration.seekEndEvent.connect(() => {
            if(!this.canvas.isPausedIgnoreInput()) {
                const maxSeek = this.canvas.video.getMaxSeek();
                if(maxSeek != null && seekInputT >= maxSeek) {
                    if(this.canvas.video.isLooped()) {
                        this.canvas.seekTo(this.canvas.video.getMinSeek() ?? 0);
                    } else {
                        this.canvas.video._userPaused = true;
                    }
                } else if(seekInputT >= this.canvas.video.videoEl.duration) {
                    if(this.canvas.video.isLooped()) {
                        this.canvas.seekTo(this.canvas.video.getMinSeek() ?? 0);
                    } else {
                        this.canvas.video._userPaused = true;
                    }
                }
            }
            this.canvas.video.setInputtingSeek(false);
        }, { owners: [ this.connectionOwner, ], });
        
        new HtmlConnection(this.canvas.renderedCanvas.containerEl, "mousedown", (e: MouseEvent) => {
            if(e.button != 2)
                return;
            requestAnimationFrame(() => {
                let menu = new ContextMenu(null, e.clientX, e.clientY);
                menu.addLayout([
                    {
                        title: "Loop Video",
                        icon: this.app.trimEditor.canvas.video.isLooped() ? CHECK_ICON : UNCHECK_ICON,
                        data: { action: "toggle-loop", },
                    },
                    {
                        title: "Free Move",
                        keybind: "Ctrl + 0",
                        icon: this.app.trimEditor.canvas.fitToContainerLock ? UNCHECK_ICON : CHECK_ICON,
                        data: { action: "toggle-free-move", },
                    },
                ]);
                menu.clickOffEvent.connect((e) => {
                    menu.remove();
                }, { owners: [ this.connectionOwner, ], });
                menu.buttonClickEvent.connect((btn) => {
                    if(btn.data != null && typeof btn.data === "object" && btn.data.action != null) {
                        this.app.runAppAction(btn.data.action, btn.data);
                    }
                    menu.remove();
                }, { owners: [ this.connectionOwner, ], });
                e.preventDefault();
            });
        }, { owners: [ this.connectionOwner, ], });
        
        new HtmlConnection(this.bottomBar.containerEl, "mousedown", (e: MouseEvent) => {
            if(e.button != 2)
                return;
            if(!([
                this.bottomBar.containerEl,
                this.bottomBar.toolsContainerEl,
                this.bottomBar.duration.durationSliderContainerEl,
                this.bottomBar.toolsRight.volumeSliderContainerEl,
            ] as (EventTarget | null)[]).includes(e.target))
                return;
            requestAnimationFrame(() => {
                let menu = new ContextMenu(null, e.clientX, e.clientY - 80);
                menu.addLayout([
                        {
                            title: "Toggle Mute",
                            keybind: "Ctrl + M",
                            icon: "volume0",
                            iconScale: 1.2,
                            data: { action: "editor-toggle-mute", },
                            separator: true,
                        },
                        {
                            title: "Pin Timeline",
                            icon: this.app.trimEditor.bottomBar.isPinned() ? CHECK_ICON : UNCHECK_ICON,
                            data: { action: "toggle-pin-timeline", },
                        },
                        {
                            title: "Precise Duration Display",
                            icon: (this.app.trimEditor.bottomBar.duration.durationType == VtebbDurationType.PRECISE) ? CHECK_ICON : UNCHECK_ICON,
                            data: { action: "toggle-duration-display-type", },
                        },
                ]);
                menu.clickOffEvent.connect((e) => {
                    menu.remove();
                }, { owners: [ this.connectionOwner, ], });
                menu.buttonClickEvent.connect((btn) => {
                    if(btn.data != null && typeof btn.data === "object" && btn.data.action != null) {
                        this.app.runAppAction(btn.data.action, btn.data);
                    }
                    menu.remove();
                }, { owners: [ this.connectionOwner, ], });
                e.preventDefault();
            });
        }, { owners: [ this.connectionOwner, ], });
    }
    
    getHasUnsavedChanges() {
        if(!this.canvas.video.isLoaded())
            return false;
        const minSeek = this.canvas.video.getMinSeek();
        if(minSeek != null && minSeek != 0)
            return true;
        const maxSeek = this.canvas.video.getMaxSeek();
        if(maxSeek != null && maxSeek != this.canvas.video.videoEl.duration)
            return true;
        return false;
    }

    createCropHistoryAction(): HistoryAction {
        return { type: "crop", data: { preset: this.cropPreset, x: this.cropX, y: this.cropY, }, };
    }

    applyHistoryAction(action: HistoryAction | null | undefined, runType: "undo" | "redo" | "none") {
        if(action == null)
            return;
        let oppositeTypeList = runType == "undo" ? this.redoActions : (runType == "redo" ? this.undoActions : null);
        switch(action.type) {
            case "crop":
                if(oppositeTypeList != null)
                    oppositeTypeList.push(this.createCropHistoryAction());
                this.cropX = action.data.x;
                this.cropY = action.data.y;
                this.setCropPreset(action.data.preset, false);
                break;
        }
    }

    undo() {
        const action = this.undoActions.pop();
        this.applyHistoryAction(action, "undo");
    }

    canUndo() {
        return this.undoActions.length > 0;
    }

    redo() {
        const action = this.redoActions.pop();
        this.applyHistoryAction(action, "redo");
    }

    canRedo() {
        return this.redoActions.length > 0;
    }

    setCropPreset(preset: VteCropPreset, updateHistory: boolean = true) {
        if(updateHistory) {
            this.undoActions.push(this.createCropHistoryAction());
            this.redoActions = [];
        }
        this.cropPreset = preset;
        this.updateCrop();
    }

    setCustomCrop(x: Vec2, y: Vec2, updateHistory: boolean = true) {
        if(updateHistory) {
            this.undoActions.push(this.createCropHistoryAction());
            this.redoActions = [];
        }
        this.cropX = x.clone();
        this.cropY = y.clone();
        this.cropPreset = VteCropPreset.CUSTOM;
        this.updateCrop();
    }

    updateCrop() {
        this.canvas.cropX = new Vec2(0, 0);
        this.canvas.cropY = new Vec2(0, 0);
        switch(this.cropPreset) {
            case VteCropPreset.LEFT_HALF:
                this.canvas.cropX.y = Math.floor(this.canvas.video.videoEl.videoWidth / 2);
                break;
            case VteCropPreset.RIGHT_HALF:
                this.canvas.cropX.x = Math.floor(this.canvas.video.videoEl.videoWidth / 2);
                break;
            case VteCropPreset.TOP_HALF:
                this.canvas.cropY.y = Math.floor(this.canvas.video.videoEl.videoHeight / 2);
                break;
            case VteCropPreset.BOTTOM_HALF:
                this.canvas.cropY.x = Math.floor(this.canvas.video.videoEl.videoHeight / 2);
                break;
            case VteCropPreset.CUSTOM:
                this.canvas.cropX.copy(this.cropX);
                this.canvas.cropY.copy(this.cropY);
                break;
        }
        this.cropX = this.canvas.cropX.clone();
        this.cropY = this.canvas.cropY.clone();
        this.canvas.updateTextureCanvasSize();
        this.canvas.updateRenderedOffset();
        this.canvas.renderTexture();
        if(this.canvas.fitToContainerLock)
            this.canvas.zoomToCenterFitContainer();
        this.canvas.render();
    }

    reset() {
        this.canvas.video._userPaused = false;
        this.bottomBar.toolsCenter.setPlaying(true);
        this.setCropPreset(VteCropPreset.NONE);
        this.undoActions = [];
        this.redoActions = [];
        this.canvas.video._minSeek = null;
        this.canvas.video._maxSeek = null;
        this.bottomBar.duration.updateTrim();
    }

    loadVideo(vdvv: VdvVideo) {
        this.videoPath = vdvv.path;
        this.reset();
        this.canvas.loadVideo(vdvv.path).then(() => {
            this.bottomBar.duration.updateTrim();
        });
        let extensionSplit = vdvv.title.split(".");
        if(extensionSplit.length > 1)
            extensionSplit.splice(extensionSplit.length - 1, 1);
        let nameNoExt = extensionSplit.join(".");
        this.bottomBar.toolsLeft.setTitle(nameNoExt);
    }

    setVisible(v: boolean) {
        if(v) {
            this.containerEl.style.display = "block";
            this.visible = true;
            this.canvas.setVisible(true);
            this.canvas.zoomToCenterFitContainer();
        } else {
            this.containerEl.style.display = "none";
            this.visible = false;
            this.canvas.setVisible(false);
        }
    }
}