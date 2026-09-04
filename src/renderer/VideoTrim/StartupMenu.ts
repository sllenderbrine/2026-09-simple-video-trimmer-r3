import { ConnectionOwner } from "../../shared/EventSignals/ConnectionOwner.js";
import { HtmlConnection } from "../../shared/EventSignals/HtmlConnection.js";
import { joinPaths } from "../../shared/Utility/FilePathUtility.js";
import { clipEllipses, clipStartEllipses } from "../../shared/Utility/StringUtility.js";
import type { VideoTrimApp } from "./VideoTrimApp.js";

const PATH_RESOURCES = "..";
const PATH_ICONS = joinPaths(PATH_RESOURCES, "icons");

export class StartupMenu {
    containerEl: HTMLDivElement;
    contentEl: HTMLDivElement;
    columnEl0: HTMLDivElement;
    columnEl1: HTMLDivElement;
    startContainerEl: HTMLDivElement;
    connectionOwner = new ConnectionOwner();
    constructor(
        public app: VideoTrimApp,
    ) {
        this.containerEl = document.createElement("div");
        this.containerEl.classList.add("startup-container");
        
        let background = document.createElement("img");
        this.containerEl.appendChild(background);
        background.style.position = "absolute";
        background.style.width = "100%";
        background.style.height = "100%";
        background.style.objectFit = "cover";
        background.style.left = "0px";
        background.style.top = "0px";
        background.style.zIndex = "-1";
        background.style.userSelect = "none";
        background.style.pointerEvents = "none";
        background.src = joinPaths(PATH_RESOURCES, "textures/startbg.png");
        
        let overlay = document.createElement("img");
        this.containerEl.appendChild(overlay);
        overlay.style.position = "absolute";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.objectFit = "fill";
        overlay.style.imageRendering = "pixelated";
        overlay.style.left = "0px";
        overlay.style.top = "0px";
        overlay.style.zIndex = "1";
        overlay.style.userSelect = "none";
        overlay.style.pointerEvents = "none";
        overlay.src = joinPaths(PATH_RESOURCES, "textures/startoverlay.png");

        this.contentEl = document.createElement("div");
        this.containerEl.appendChild(this.contentEl);
        this.contentEl.classList.add("spm-content");

        this.columnEl0 = document.createElement("div");
        this.contentEl.appendChild(this.columnEl0)
        this.columnEl0.classList.add("startup-content-column");

        this.columnEl0.innerHTML = `
            <div>
                <h1>Simple Video Trimmer</h1>
                <h3>Gameplay Clip Editor</h3>
            </div>
            <div>
                <h2>Recents</h2>
            </div>
        `;

        this.columnEl1 = document.createElement("div");
        this.contentEl.appendChild(this.columnEl1)
        this.columnEl1.classList.add("startup-content-column");

        this.columnEl1.innerHTML = `
            <div>
                <h2>Start</h2>
            </div>
        `;

        const startContainerEl = this.columnEl1.querySelector(".spm-start") as HTMLDivElement;
        this.startContainerEl = startContainerEl;
        
        this.app.settings.loaded.handle(() => {
            this.updateRecents();
            this.updateStartLinks();
        }, { owners: [ this.connectionOwner, ], });

        new HtmlConnection(window, "resize", () => {
            let s = Math.min(window.innerWidth, window.innerHeight * 2);
            if(s < 800) {
                this.contentEl.style.scale = "0.6";
            } else if(s < 1000) {
                this.contentEl.style.scale = "0.8";
            } else {
                this.contentEl.style.scale = "1";
            }
        }, { owners: [ this.connectionOwner, ], initArgs: [ ], });
    }

    addStartLink(title: string, icon: string, iconScale: number, onClick: () => void) {
        let container = document.createElement("div");
        this.columnEl1.appendChild(container);
        container.classList.add("spm-value");
        let iconContainer = document.createElement("div");
        container.appendChild(iconContainer);
        iconContainer.classList.add("spm-icon");
        iconContainer.style.scale = iconScale.toString();
        let titleLabel = document.createElement("div");
        container.appendChild(titleLabel);
        titleLabel.textContent = title;
        titleLabel.classList.add("spm-value-title");
        fetch(joinPaths(PATH_ICONS, icon + ".svg")).then(res => res.text()).then(text => {
            iconContainer.innerHTML = text;
        });
        container.onclick = onClick;
    }

    addRecentLink(path: string, onClick: () => void) {
        let container = document.createElement("div");
        this.columnEl0.appendChild(container);
        container.classList.add("spm-value");
        container.title = path;
        let titleLabel = document.createElement("div");
        container.appendChild(titleLabel);
        titleLabel.textContent = clipStartEllipses(path, 32);
        titleLabel.classList.add("spm-value-title");
        container.onclick = onClick;
    }

    addDisabledLink(parent: HTMLDivElement, title: string, icon: string, iconScale: number) {
        let container = document.createElement("div");
        parent.appendChild(container);
        container.classList.add("spm-value-disabled");
        let iconContainer = document.createElement("div");
        container.appendChild(iconContainer);
        iconContainer.classList.add("spm-icon");
        iconContainer.style.scale = iconScale.toString();
        let titleLabel = document.createElement("div");
        container.appendChild(titleLabel);
        titleLabel.textContent = title;
        titleLabel.classList.add("spm-value-title");
        fetch(joinPaths(PATH_ICONS, icon + ".svg")).then(res => res.text()).then(text => {
            iconContainer.innerHTML = text;
        });
    }

    clearRecents() {
        for(let el of [...this.columnEl0.querySelectorAll(".spm-value"), ...this.columnEl0.querySelectorAll(".spm-value-disabled")]) {
            el.remove();
        }
    }

    clearStartLinks() {
        for(let el of [...this.columnEl1.querySelectorAll(".spm-value"), ...this.columnEl1.querySelectorAll(".spm-value-disabled")]) {
            el.remove();
        }
    }
    
    updateRecents() {
        this.clearRecents();
        if(!this.app.settings.loaded.get() || this.app.settings.settings.recentFolders.length === 0) {
            this.addDisabledLink(this.columnEl0, "Nothing here...", "info-circle", 1.2);
            return;
        }
        for(let path of this.app.settings.settings.recentFolders) {
            this.addRecentLink(path, () => {
                this.app.runAppAction("open-recent", { path, });
            });
        }
    }

    updateStartLinks() {
        this.clearStartLinks();
        this.addStartLink("Open Folder", "open-folder", 1.05, () => {
            this.app.runAppAction("open-folder");
        });

        if(!this.app.settings.loaded.get() || this.app.settings.settings.recentFolders.length === 0) {
            this.addDisabledLink(this.columnEl1, "Open Most Recent", "refresh", 1.05);
        } else {
            this.addStartLink("Open Most Recent", "refresh", 1.05, () => {
                this.app.runAppAction("open-recent", { path: this.app.settings.settings.recentFolders[0], });
            });
        }

        this.addStartLink("Settings", "settings", 1.05, () => {
            this.app.runAppAction("toggle-settings");
        });
    }
}