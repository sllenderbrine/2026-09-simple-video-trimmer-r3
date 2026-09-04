import { Connection } from "../../../shared/EventSignals/Connection.js";
import { ConnectionOwner } from "../../../shared/EventSignals/ConnectionOwner.js";
import { HtmlConnection } from "../../../shared/EventSignals/HtmlConnection.js";
import { renderEvent } from "../../Ui/WindowGlobal/WindowEvents.js";
import type { VideoTrimEditor } from "../VideoTrimEditor.js";
import { VtebbDuration } from "./VtebbDuration.js";
import { VtebbToolsCenter } from "./VtebbToolsCenter.js";
import { VtebbToolsLeft } from "./VtebbToolsLeft.js";
import { VtebbToolsRight } from "./VtebbToolsRight.js";

export class VteBottomBar {
    containerEl: HTMLDivElement;
    duration: VtebbDuration;
    toolsContainerEl: HTMLDivElement;
    toolsLeft: VtebbToolsLeft;
    toolsCenter: VtebbToolsCenter;
    toolsRight: VtebbToolsRight;
    hovering: boolean = false;
    _pinned: boolean = false;
    animConnection: Connection<any> | null = null;
    hoverTimeout: number = 0;
    hiddenOffScreen: boolean = true;
    connectionOwner: ConnectionOwner = new ConnectionOwner();
    constructor(
        public editor: VideoTrimEditor,
    ) {
        this.containerEl = document.createElement("div");
        this.containerEl.classList.add("vte-bottom-bar-container");

        this.duration = new VtebbDuration(this);

        this.toolsContainerEl = document.createElement("div");
        this.containerEl.appendChild(this.toolsContainerEl);
        this.toolsContainerEl.classList.add("vtebb-tools-container");

        this.toolsLeft = new VtebbToolsLeft(this);
        this.toolsRight = new VtebbToolsRight(this);
        this.toolsCenter = new VtebbToolsCenter(this);

        new HtmlConnection(window, "mousemove", (e: MouseEvent) => {
            if(!this.editor.visible)
                return;
            this.focus();
            this.hovering = e.clientY >= window.innerHeight - 100;
        }, { owners: [ this.connectionOwner ] });

        this.toolsCenter.rewindEvent.connect(() => {
            this.editor.canvas.seekTo(this.editor.canvas.video.videoEl.currentTime - 3);
        }, { owners: [ this.connectionOwner, ], });
        this.toolsCenter.fastforwardEvent.connect(() => {
            this.editor.canvas.seekTo(this.editor.canvas.video.videoEl.currentTime + 3);
        }, { owners: [ this.connectionOwner, ], });
        this.toolsCenter.playEvent.connect(() => {
            if(this.editor.canvas.isUserPaused()) {
                this.editor.canvas.play();
                this.toolsCenter.setPlaying(true);
            } else {
                this.editor.canvas.pause();
                this.toolsCenter.setPlaying(false);
            }
        }, { owners: [ this.connectionOwner, ], });

        this.toolsLeft.textBoxEl.addEventListener("focus", () => {
            this.updateVisibleAnimate();
        });
        this.toolsLeft.textBoxEl.addEventListener("blur", () => {
            this.updateVisibleAnimate();
        });
    }

    focus() {
        if(!this.editor.visible)
            return;
        this.hoverTimeout = 2;
        if(this.animConnection != null)
            return;
        this.updateVisibleAnimate();
        this.animConnection = renderEvent.connect(dt => {
            if(!this.hovering)
                this.hoverTimeout -= dt;
            if(this.hoverTimeout <= 0) {
                this.updateVisibleAnimate();
                this.animConnection!.disconnect();
                this.animConnection = null;
            }
        }, { owners: [ this.connectionOwner, ], });
    }

    isPinned() {
        return this._pinned;
    }

    setPinned(v: boolean) {
        this._pinned = v;
        this.updateVisibleAnimate();
    }

    updateVisibleAnimate() {
        if(this._pinned || this.hoverTimeout > 0 || document.activeElement == this.toolsLeft.textBoxEl) {
            this.setVisibleAnimate(true);
            return;
        }
        this.setVisibleAnimate(false);
    }

    setVisibleAnimate(v: boolean) {
        if(v == !this.hiddenOffScreen)
            return;
        this.hiddenOffScreen = !v; 
        const rect = this.containerEl.getBoundingClientRect();
        let currY = window.innerHeight - (rect.top + rect.height);
        this.containerEl.style.bottom = v ? "0px" : "-100px";
        this.containerEl.animate([
            { bottom: `${currY}px`, },
            { bottom: this.containerEl.style.bottom, },
        ], { duration: 200, easing: "ease", });
    }
}