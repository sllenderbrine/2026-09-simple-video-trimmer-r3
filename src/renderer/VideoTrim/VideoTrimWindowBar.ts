import { ConnectionOwner } from "../../shared/EventSignals/ConnectionOwner.js";
import { formatFileSize } from "../../shared/Utility/StringUtility.js";
import { GITHUB_VERSION_TAG } from "../../shared/VideoTrim/GithubVersionTag.js";
import { ContextMenu, ContextMenuLayout, ContextMenuTextAlign } from "../Ui/ContextMenu.js";
import { WindowBar, WindowBarSide } from "../Ui/WindowBar.js";
import { WindowKeypresses } from "../Ui/WindowGlobal/WindowKeypresses.js";
import { VdvFilter, VdvSortMethod } from "./VideoDirectoryViewer.js";
import type { VideoTrimApp } from "./VideoTrimApp.js";
import { VteCropPreset } from "./VideoTrimEditor.js";
import { VtebbDurationType } from "./VteBottomBar/VtebbDuration.js";

export const CHECK_ICON = "check";
export const UNCHECK_ICON = "dashed-box";

export class VideoTrimWindowBar extends WindowBar {
    connectionOwner: ConnectionOwner = new ConnectionOwner();
    constructor(
        public app: VideoTrimApp
    ) {
        super();

        WindowKeypresses.keyDownEvent.connect((e) => {
            const key = e.key.toLowerCase();
            if(key == "0" && e.ctrlKey) {
                this.app.runAppAction("toggle-free-move");
            }
        }, { owners: [ this.connectionOwner ] });
        
        this.addTextButton("File", () => {
            if(this.app.editorOpened) {
                return [
                    {
                        title: "Close Video",
                        icon: "back",
                        iconScale: 1.2,
                        keybind: "Ctrl + Shift + C",
                        data: { action: "close-editor", },
                        separator: true,
                    },
                    {
                        title: "Apply Edits",
                        icon: "save",
                        iconScale: 1.5,
                        keybind: "Ctrl + S",
                        disabled: !this.app.trimEditor.getHasUnsavedChanges(),
                        data: { action: "save-editor", },
                    },
                    {
                        title: "Save As...",
                        icon: "save-as",
                        iconScale: 1.5,
                        keybind: "Ctrl + Shift + S",
                        disabled: !this.app.trimEditor.getHasUnsavedChanges(),
                        data: { action: "save-as-editor", },
                    },
                    {
                        title: "Save As New",
                        icon: "save-new",
                        iconScale: 1.5,
                        keybind: "Ctrl + Shift + N",
                        disabled: !this.app.trimEditor.getHasUnsavedChanges(),
                        separator: true,
                        data: { action: "save-as-new-editor", },
                    },
                    {
                        title: "Settings...",
                        icon: "settings",
                        iconScale: 1.3,
                        dangerSeparator: true,
                        data: { action: "toggle-settings", },
                    },
                    {
                        title: "Exit",
                        icon: "cross",
                        data: { action: "exit", },
                        danger: true,
                    },
                ];
            } else {
                let recentsChildren: ContextMenuLayout[] = this.app.settings.loaded.get() ? this.app.settings.settings.recentFolders.map(v => {
                    return {
                        title: v,
                        data: { action: "open-recent", path: v, },
                        textAlign: ContextMenuTextAlign.RIGHT,
                    };
                }) : [ ];
                if(recentsChildren.length >= 1) {
                    recentsChildren[recentsChildren.length - 1]!.separator = true;
                    recentsChildren.push({
                        title: "Clear Recents",
                        icon: "trash",
                        iconScale: 1.3,
                        textAlign: ContextMenuTextAlign.RIGHT,
                        data: { action: "clear-recent", },
                    });
                } else {
                    recentsChildren.push({
                        title: "Nothing here...",
                        icon: "info-circle",
                        iconScale: 1.4,
                        disabled: true,
                    });
                }

                return [
                    {
                        title: "Open Folder...",
                        icon: "open-folder",
                        iconScale: 1.15,
                        keybind: "Ctrl + O",
                        data: { action: "open-folder", },
                    },
                    {
                        title: "Refresh",
                        icon: "refresh",
                        iconScale: 1.2,
                        keybind: "Ctrl + R",
                        disabled: !this.app.vdirViewer.loaded,
                        data: { action: "refresh", },
                        children: [
                            {
                                title: "Refresh",
                                icon: "refresh",
                                iconScale: 1.2,
                                keybind: "Ctrl + R",
                                disabled: !this.app.vdirViewer.loaded,
                                data: { action: "refresh", },
                            },
                            {
                                title: "Hard Refresh",
                                icon: "hard-refresh",
                                iconScale: 1.2,
                                keybind: "Ctrl + Shift + R",
                                disabled: !this.app.vdirViewer.loaded,
                                data: { action: "hard-refresh", },
                            },
                        ],
                    },
                    {
                        title: "Recents",
                        icon: "library",
                        iconScale: 1.3,
                        children: recentsChildren,
                    },
                    {
                        title: "Close Folder",
                        icon: "close-folder",
                        iconScale: 1.3,
                        data: { action: "close-folder", },
                        disabled: !this.app.vdirViewer.loaded,
                    },
                    {
                        title: "Settings...",
                        icon: "settings",
                        iconScale: 1.3,
                        dangerSeparator: true,
                        data: { action: "toggle-settings", },
                    },
                    {
                        title: "Exit",
                        icon: "cross",
                        data: { action: "exit", },
                        danger: true,
                    },
                ];
            }
        }, null, WindowBarSide.LEFT);
        this.addTextButton("Edit", () => {
            if(this.app.editorOpened) {
                return [
                    {
                        title: "Undo",
                        keybind: "Ctrl + Z",
                        icon: "undo",
                        iconScale: 1.2,
                        disabled: !this.app.trimEditor.canUndo(),
                        data: { action: "undo-editor", },
                    },
                    {
                        title: "Redo",
                        keybind: "Ctrl + Shift + Z",
                        icon: "redo",
                        iconScale: 1.2,
                        disabled: !this.app.trimEditor.canRedo(),
                        data: { action: "redo-editor", },
                        separator: true,
                    },
                    {
                        title: "Trim",
                        icon: "film",
                        iconScale: 1.2,
                        children: [
                            {
                                title: "Reset Trim",
                                keybind: "Ctrl + Shift + Q",
                                icon: "refresh",
                                data: { action: "editor-trim-reset", },
                            },
                            {
                                title: "Trim Start to Current Time",
                                keybind: "Ctrl + Q",
                                icon: "play-fill",
                                iconScale: 1,
                                data: { action: "editor-trim-start", },
                            },
                            {
                                title: "Trim End to Current Time",
                                keybind: "Ctrl + E",
                                icon: "skip-fill",
                                iconScale: 1,
                                data: { action: "editor-trim-end", },
                            },
                        ],
                    },
                    {
                        title: "Crop",
                        icon: "crop",
                        iconScale: 1.2,
                        children: [
                            {
                                title: "Toggle N/L/R",
                                icon: "crop",
                                iconScale: 1.2,
                                keybind: "Ctrl + G",
                                data: { action: "editor-crop-toggle-nlr", },
                            },
                            {
                                title: "None",
                                icon: this.app.trimEditor.cropPreset == VteCropPreset.NONE ? CHECK_ICON : UNCHECK_ICON,
                                data: { action: "editor-set-crop-preset", preset: VteCropPreset.NONE, },
                            },
                            {
                                title: "Left Half",
                                icon: this.app.trimEditor.cropPreset == VteCropPreset.LEFT_HALF ? CHECK_ICON : UNCHECK_ICON,
                                data: { action: "editor-set-crop-preset", preset: VteCropPreset.LEFT_HALF, },
                            },
                            {
                                title: "Right Half",
                                icon: this.app.trimEditor.cropPreset == VteCropPreset.RIGHT_HALF ? CHECK_ICON : UNCHECK_ICON,
                                data: { action: "editor-set-crop-preset", preset: VteCropPreset.RIGHT_HALF, },
                            },
                            {
                                title: "Top Half",
                                icon: this.app.trimEditor.cropPreset == VteCropPreset.TOP_HALF ? CHECK_ICON : UNCHECK_ICON,
                                data: { action: "editor-set-crop-preset", preset: VteCropPreset.TOP_HALF, },
                            },
                            {
                                title: "Bottom Half",
                                icon: this.app.trimEditor.cropPreset == VteCropPreset.BOTTOM_HALF ? CHECK_ICON : UNCHECK_ICON,
                                data: { action: "editor-set-crop-preset", preset: VteCropPreset.BOTTOM_HALF, },
                            },
                            {
                                title: "Custom...",
                                icon: this.app.trimEditor.cropPreset == VteCropPreset.CUSTOM ? CHECK_ICON : UNCHECK_ICON,
                                data: { action: "coming-soon"/*"editor-prompt-custom-crop"*/, },
                            },
                        ],
                    },
                ];
            } else {
                return [
                    {
                        title: "Nothing here...",
                        icon: "info-circle",
                        iconScale: 1.4,
                        disabled: true,
                    },
                ];
            }
        }, null, WindowBarSide.LEFT);
        this.addTextButton("View", () => {
            if(this.app.editorOpened) {
                return [
                    {
                        title: "Take Screenshot",
                        icon: "camera",
                        iconScale: 1.2,
                        separator: true,
                        data: { action: "editor-snapshot", },
                    },
                    {
                        title: "Video",
                        icon: undefined,
                        children: [
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
                        ],
                    },
                    {
                        title: "Audio",
                        icon: undefined,
                        children: [
                            {
                                title: "Toggle Mute",
                                keybind: "Ctrl + M",
                                icon: "volume0",
                                iconScale: 1.2,
                                data: { action: "editor-toggle-mute", },
                            },
                        ],
                    },
                    {
                        title: "Timeline",
                        icon: undefined,
                        children: [
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
                        ],
                    },
                ];
            } else {
                return [
                    {
                        title: "Sort By",
                        icon: "sort-down",
                        iconScale: 1.3,
                        children: [
                            {
                                title: "Date",
                                icon: (
                                    this.app.vdirViewer.sortMethod == VdvSortMethod.DATE_RECENT
                                    || this.app.vdirViewer.sortMethod == VdvSortMethod.DATE_OLD
                                ) ? CHECK_ICON : UNCHECK_ICON,
                                children: [
                                    {
                                        title: "Recent",
                                        icon: this.app.vdirViewer.sortMethod == VdvSortMethod.DATE_RECENT ? CHECK_ICON : UNCHECK_ICON,
                                        data: { action: "sort-date-recent", },
                                    },
                                    {
                                        title: "Old",
                                        icon: this.app.vdirViewer.sortMethod == VdvSortMethod.DATE_OLD ? CHECK_ICON : UNCHECK_ICON,
                                        data: { action: "sort-date-old", },
                                    },
                                ],
                            },
                            {
                                title: "Name",
                                icon: (
                                    this.app.vdirViewer.sortMethod == VdvSortMethod.NAME_A_Z
                                    || this.app.vdirViewer.sortMethod == VdvSortMethod.NAME_Z_A
                                ) ? CHECK_ICON : UNCHECK_ICON,
                                children: [
                                    {
                                        title: "A-Z",
                                        icon: this.app.vdirViewer.sortMethod == VdvSortMethod.NAME_A_Z ? CHECK_ICON : UNCHECK_ICON,
                                        data: { action: "sort-name-a-z", },
                                    },
                                    {
                                        title: "Z-A",
                                        icon: this.app.vdirViewer.sortMethod == VdvSortMethod.NAME_Z_A ? CHECK_ICON : UNCHECK_ICON,
                                        data: { action: "sort-name-z-a", },
                                    },
                                ],
                            },
                            {
                                title: "Duration",
                                icon: (
                                    this.app.vdirViewer.sortMethod == VdvSortMethod.DURATION_LONG
                                    || this.app.vdirViewer.sortMethod == VdvSortMethod.DURATION_SHORT
                                ) ? CHECK_ICON : UNCHECK_ICON,
                                children: [
                                    {
                                        title: "Long",
                                        icon: this.app.vdirViewer.sortMethod == VdvSortMethod.DURATION_LONG ? CHECK_ICON : UNCHECK_ICON,
                                        data: { action: "sort-duration-long", },
                                    },
                                    {
                                        title: "Short",
                                        icon: this.app.vdirViewer.sortMethod == VdvSortMethod.DURATION_SHORT ? CHECK_ICON : UNCHECK_ICON,
                                        data: { action: "sort-duration-short", },
                                    },
                                ],
                            },
                            {
                                title: "Size",
                                icon: (
                                    this.app.vdirViewer.sortMethod == VdvSortMethod.SIZE_BIG
                                    || this.app.vdirViewer.sortMethod == VdvSortMethod.SIZE_SMALL
                                ) ? CHECK_ICON : UNCHECK_ICON,
                                children: [
                                    {
                                        title: "Big",
                                        icon: this.app.vdirViewer.sortMethod == VdvSortMethod.SIZE_BIG ? CHECK_ICON : UNCHECK_ICON,
                                        data: { action: "sort-size-big", },
                                    },
                                    {
                                        title: "Small",
                                        icon: this.app.vdirViewer.sortMethod == VdvSortMethod.SIZE_SMALL ? CHECK_ICON : UNCHECK_ICON,
                                        data: { action: "sort-size-small", },
                                    },
                                ],
                            },
                            {
                                title: "Other",
                                icon: (
                                    this.app.vdirViewer.sortMethod == VdvSortMethod.OTHER_RANDOM
                                ) ? CHECK_ICON : UNCHECK_ICON,
                                children: [
                                    {
                                        title: "Random",
                                        icon: this.app.vdirViewer.sortMethod == VdvSortMethod.OTHER_RANDOM ? CHECK_ICON : UNCHECK_ICON,
                                        data: { action: "sort-random", },
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        title: "Filter By",
                        icon: "filter",
                        iconScale: 1.2,
                        children: [
                            {
                                title: "None",
                                icon: this.app.vdirViewer.filter == VdvFilter.NONE ? CHECK_ICON : UNCHECK_ICON,
                                data: { action: "filter-by", value: VdvFilter.NONE, },
                            },
                            {
                                title: "Unnamed Videos",
                                icon: this.app.vdirViewer.filter == VdvFilter.UNNAMED ? CHECK_ICON : UNCHECK_ICON,
                                data: { action: "filter-by", value: VdvFilter.UNNAMED, },
                            },
                        ],
                    },
                    {
                        title: "Info",
                        icon: "info-circle",
                        iconScale: 1.4,
                        children: this.app.startupMenu.containerEl.style.display == "none" ? [
                            {
                                title: `${this.app.vdirViewer.videoCount} Videos`,
                                keybind: formatFileSize(this.app.vdirViewer.videosTotalSize),
                                icon: "video",
                                iconScale: 1.3,
                                disabled: true,
                            },
                            {
                                title: `${this.app.vdirViewer.unnamedVideoCount} Unnamed Videos`,
                                keybind: formatFileSize(this.app.vdirViewer.unnamedVideosTotalSize),
                                icon: "tag",
                                iconScale: 1.4,
                                disabled: true,
                            },
                        ] : [
                            {
                                title: "Nothing here...",
                                icon: "info-circle",
                                iconScale: 1.4,
                                disabled: true,
                            },
                        ],
                    },
                ];
            }
        }, null, WindowBarSide.LEFT);
        this.addTextButton("Help", () => {
            if(this.app.editorOpened) {
                return [
                    {
                        title: "↪ Github",
                        icon: "GitHub_Invertocat_White",
                        iconScale: 1,
                        data: { action: "open-github-repo" },
                    },
                ];
            } else {
                return [
                    {
                        title: "↪ Github",
                        icon: "GitHub_Invertocat_White",
                        iconScale: 1,
                        data: { action: "open-github-repo" },
                    },
                ];
            }
        }, null, WindowBarSide.LEFT);

        let versionTitle = document.createElement("div");
        this.leftContentEl.appendChild(versionTitle);
        versionTitle.textContent = GITHUB_VERSION_TAG;
        versionTitle.style = "width:fit-content;height:100%;padding: 0px 8px;align-content: center;color:rgba(255,255,255,0.5);"

        let updateTag = document.createElement("button");
        this.leftContentEl.appendChild(updateTag);
        updateTag.textContent = "Update Available";
        updateTag.classList.add("wbar-update-tag");
        updateTag.onclick = () => {
            window.redirectApi.openGithubRepoReleases();
        }
        let updateTagDescription = document.createElement("div");
        updateTag.appendChild(updateTagDescription);
        updateTagDescription.classList.add("wbar-update-tag-description");
        updateTagDescription.textContent = "unknown";
        updateTag.style.display = "none";
        fetch("https://api.github.com/repos/sllenderbrine/2026-07-simple-video-trimmer-r2-public1/releases/latest").then(async res => {
            if(!res.ok)
                throw new Error(res.status.toString());
            const release = await res.json();
            if(release.tag_name !== GITHUB_VERSION_TAG) {
                updateTagDescription.textContent = release.tag_name;
                updateTag.style.display = "flex";
            }
            this.app.notificationSystem.sendNotificationDetails("Latest Version Found", "Found the latest version on Github: " + release.tag_name);
        }).catch((reason) => {
            this.app.notificationSystem.sendNotificationDetails("Latest Version Not Found", "Could not find latest version on Github. " + reason);
            console.log(reason);
        });

        this.menuButtonClickEvent.connect((ctxbtn, wbtn) => {
            if(ctxbtn.data != null && ctxbtn.data.action != null) {
                this.app.runAppAction(ctxbtn.data.action, { ...ctxbtn.data, ctxbtn, wbtn });
                let parent = ctxbtn.contextMenu;
                while(parent.parent && parent.parent != parent)
                    parent = parent.parent;
                parent.remove();
            }
        }, { owners: [ this.connectionOwner ] });

        this.closeFunc = (btn) => {
            if(this.app.editorOpened || this.app.editApplier.hasActiveEdits()) {
                let rect = btn.getBoundingClientRect();
                const menu = new ContextMenu(null, rect.left - 60, rect.top + rect.height);
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
                this.app.runAppAction("exit");
            }
        }
    }
}