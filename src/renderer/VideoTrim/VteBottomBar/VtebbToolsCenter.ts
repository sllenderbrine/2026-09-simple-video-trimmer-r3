import { ConnectionOwner } from "../../../shared/EventSignals/ConnectionOwner.js";
import { HtmlConnection } from "../../../shared/EventSignals/HtmlConnection.js";
import { Signal } from "../../../shared/EventSignals/Signal.js";
import { joinPaths } from "../../../shared/Utility/FilePathUtility.js";
import { VteBottomBar } from "./VteBottomBar.js";

const PATH_RESOURCES = "..";
const PATH_ICONS = joinPaths(PATH_RESOURCES, "icons");

export type VtebbTcButton = {
    btnEl: HTMLButtonElement;
    iconContainers: HTMLDivElement[];
    setIcon: (icon: string) => void;
    clickAnim: (t?: number) => void;
    animClickDown: () => number;
    animClickUp: (id?: number) => void;
}

export class VtebbToolsCenter {
    containerEl: HTMLDivElement;
    playButtonEl: VtebbTcButton;
    forwardButtonEl: VtebbTcButton;
    backwardButtonEl: VtebbTcButton;
    rewindEvent = new Signal<[]>();
    playEvent = new Signal<[]>();
    fastforwardEvent = new Signal<[]>();
    connectionOwner = new ConnectionOwner();
    constructor(public bottombar: VteBottomBar) {
        this.containerEl = document.createElement("div");
        bottombar.toolsContainerEl.appendChild(this.containerEl);
        this.containerEl.classList.add("vtebb-tools-center");

        this.backwardButtonEl = this.createButton(0.85, ["rewind-fill"], 0.85, () => {
            this.rewindEvent.fire();
        });

        this.playButtonEl = this.createButton(1, ["play-fill", "pause-fill"], 0.75, () => {
            this.playEvent.fire();
        });

        this.forwardButtonEl = this.createButton(0.85, ["fastforward-fill"], 0.85, () => {
            this.fastforwardEvent.fire();
        });

        this.bottombar.editor.canvas.video.endPauseEvent.connect(() => {
            this.setPlaying(false);
        }, { owners: [ this.connectionOwner, ], })
    }

    setPlaying(v: boolean) {
        this.playButtonEl.setIcon(v ? "pause-fill" : "play-fill");
    }

    createButton(scale: number, icons: string[], iconScale: number, onClick: () => void): VtebbTcButton {
        const btnEl = document.createElement("button");
        this.containerEl.appendChild(btnEl);
        btnEl.classList.add("vtebb-tc-button");
        btnEl.style.scale = scale.toString();
        const contentEl = document.createElement("div");
        btnEl.appendChild(contentEl);
        contentEl.classList.add("vtebb-tc-button-content");
        const iconEl = document.createElement("div");
        contentEl.appendChild(iconEl);
        iconEl.style.width = (iconScale * 100) + "%";
        iconEl.style.height = (iconScale * 100) + "%";

        let mouseDownConnections = new ConnectionOwner();
        let animIndex = 0;

        function animClickDown() {
            let animId = ++animIndex;
            btnEl.animate([
                { scale: getComputedStyle(btnEl).scale, },
                { scale: (scale * 0.9).toString(), },
            ], { duration: 50, easing: "linear", });
            btnEl.style.scale = (scale * 0.9).toString();
            return animId;
        }
        function animClickUp(id?: number) {
            if(id != null && id != animIndex)
                return;
            btnEl.animate([
                { scale: getComputedStyle(btnEl).scale, },
                { scale: scale.toString(), },
            ], { duration: 50, easing: "linear", });
            btnEl.style.scale = scale.toString();
        }
        function animClickDelay(t: number) {
            let animId = animClickDown();
            setTimeout(() => {
                animClickUp(animId);
            }, t * 1000);
        }

        new HtmlConnection(btnEl, "mousedown", () => {
            let animId = animClickDown();
            new HtmlConnection(window, "mouseup", () => {
                animClickUp(animId);
                mouseDownConnections.disconnectAll();
            }, { owners: [ mouseDownConnections, this.connectionOwner, ], });
        }, { owners: [ this.connectionOwner, ], });
        new HtmlConnection(btnEl, "click", () => {
            onClick();
            btnEl.blur();
        }, { owners: [ this.connectionOwner, ], });

        let iconContainers: HTMLDivElement[] = [];

        for(let i=0; i<icons.length; i++) {
            let container = document.createElement("div");
            iconEl.appendChild(container);
            fetch(joinPaths(PATH_ICONS, icons[i] + ".svg")).then(res => res.text()).then(text => {
                container.innerHTML = text;
            });
            iconContainers.push(container);
            container.style.display = (i == 0) ? "block" : "none";
        }

        return {
            btnEl,
            iconContainers,
            setIcon: (icon: string) => {
                for(let i=0; i<icons.length; i++) {
                    if(icons[i]! == icon) {
                        iconContainers[i]!.style.display = "block";
                    } else {
                        iconContainers[i]!.style.display = "none";
                    }
                }
            },
            clickAnim: (t: number = 0.1) => {
                animClickDelay(t);
            },
            animClickDown,
            animClickUp,
        };
    }
}