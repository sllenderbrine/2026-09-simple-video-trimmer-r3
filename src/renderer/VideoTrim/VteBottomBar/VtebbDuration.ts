import { ConnectionOwner } from "../../../shared/EventSignals/ConnectionOwner.js";
import { HtmlConnection } from "../../../shared/EventSignals/HtmlConnection.js";
import { Signal } from "../../../shared/EventSignals/Signal.js";
import { clamp } from "../../../shared/Utility/MathUtility.js";
import { formatVideoDuration, formatVideoDurationPrecise } from "../../../shared/Utility/StringUtility.js";
import { VteBottomBar } from "./VteBottomBar.js";

export enum VtebbDurationType {
    DEFAULT = 0,
    PRECISE = 1,
}

export class VtebbDuration {
    durationSliderContainerEl: HTMLDivElement;
    durationSliderEl: HTMLDivElement;
    durationSliderClipEl: HTMLDivElement;
    durationSliderContentEl: HTMLDivElement;
    durationSliderValueContentEl: HTMLDivElement;
    durationSliderHandleEl: HTMLDivElement;
    currentTimeEl: HTMLDivElement;
    totalTimeEl: HTMLDivElement;
    trimHandleLeftEl: HTMLDivElement;
    trimHandleRightEl: HTMLDivElement;
    durationType = VtebbDurationType.DEFAULT;
    seekInputEvent: Signal<[t: number]> = new Signal();
    seekStartEvent: Signal<[]> = new Signal();
    seekEndEvent: Signal<[]> = new Signal();
    connectionOwner: ConnectionOwner = new ConnectionOwner();
    constructor(
        public bottomBar: VteBottomBar,
    ) {
        this.durationSliderContainerEl = document.createElement("div");
        bottomBar.containerEl.appendChild(this.durationSliderContainerEl);
        this.durationSliderContainerEl.classList.add("vtebb-duration-container");

        this.durationSliderEl = document.createElement("div");
        this.durationSliderContainerEl.appendChild(this.durationSliderEl);
        this.durationSliderEl.classList.add("vtebb-duration-slider");

        this.durationSliderClipEl = document.createElement("div");
        this.durationSliderEl.appendChild(this.durationSliderClipEl);
        this.durationSliderClipEl.classList.add("vtebb-duration-slider-clip");

        this.durationSliderContentEl = document.createElement("div");
        this.durationSliderClipEl.appendChild(this.durationSliderContentEl);
        this.durationSliderContentEl.classList.add("vtebb-duration-slider-content");

        const borderLeft = document.createElement("div");
        this.durationSliderContentEl.appendChild(borderLeft);
        borderLeft.classList.add("vtebb-duration-border-left");

        const borderRight = document.createElement("div");
        this.durationSliderContentEl.appendChild(borderRight);
        borderRight.classList.add("vtebb-duration-border-right");

        this.durationSliderValueContentEl = document.createElement("div");
        this.durationSliderContentEl.appendChild(this.durationSliderValueContentEl);
        this.durationSliderValueContentEl.classList.add("vtebb-duration-slider-value");
        
        this.durationSliderHandleEl = document.createElement("div");
        this.durationSliderEl.appendChild(this.durationSliderHandleEl);
        this.durationSliderHandleEl.classList.add("vtebb-duration-slider-handle");

        this.currentTimeEl = document.createElement("div");
        this.durationSliderContainerEl.appendChild(this.currentTimeEl);
        this.currentTimeEl.classList.add("vtebb-current-time");
        this.currentTimeEl.textContent = formatVideoDuration(0);

        this.totalTimeEl = document.createElement("div");
        this.durationSliderContainerEl.appendChild(this.totalTimeEl);
        this.totalTimeEl.classList.add("vtebb-total-time");
        this.totalTimeEl.textContent = formatVideoDuration(10_000);

        this.trimHandleLeftEl = document.createElement("div");
        this.durationSliderEl.appendChild(this.trimHandleLeftEl);
        this.trimHandleLeftEl.classList.add("vtebb-trim-handle-left");

        this.trimHandleRightEl = document.createElement("div");
        this.durationSliderEl.appendChild(this.trimHandleRightEl);
        this.trimHandleRightEl.classList.add("vtebb-trim-handle-right");

        const editor = bottomBar.editor;
        const durationSliderMouseDown = (e: MouseEvent, offset: boolean = false) => {
            let mouseDownConnections = new ConnectionOwner();
            this.seekStartEvent.fire();
            let seekStartMx = e.clientX;
            let seekStartT = this.durationSliderValueContentEl.clientWidth / this.durationSliderContentEl.clientWidth;
            const minSeek = editor.canvas.video.getMinSeek() ?? 0;
            const maxSeek = editor.canvas.video.getMaxSeek() ?? editor.canvas.video.videoEl.duration;
            seekStartT = (seekStartT * (maxSeek - minSeek) + minSeek) / editor.canvas.video.videoEl.duration;
            new HtmlConnection(window, "mousemove", (e: MouseEvent) => {
                let t = 0;
                if(offset) {
                    t = seekStartT + (e.clientX - seekStartMx) / this.durationSliderEl.clientWidth;
                } else {
                    const rect = this.durationSliderEl.getBoundingClientRect();
                    t = (e.clientX - rect.left) / this.durationSliderEl.clientWidth;
                }
                const minSeek = editor.canvas.video.getMinSeek() ?? 0;
                const maxSeek = editor.canvas.video.getMaxSeek() ?? editor.canvas.video.videoEl.duration;
                t = clamp(
                    t,
                    minSeek / editor.canvas.video.videoEl.duration,
                    maxSeek / editor.canvas.video.videoEl.duration,
                );
                let valuePercent = (t * editor.canvas.video.videoEl.duration - minSeek) / (maxSeek - minSeek);
                this.durationSliderValueContentEl.style.width = `${valuePercent * 100}%`;
                this.durationSliderHandleEl.style.left = `${t * 100}%`;
                this.seekInputEvent.fire(t * editor.canvas.video.videoEl.duration);
            }, { owners: [ this.connectionOwner, mouseDownConnections ], initArgs: offset ? undefined : [e], });
            new HtmlConnection(window, "mouseup", (e: MouseEvent) => {
                this.seekEndEvent.fire();
                mouseDownConnections.disconnectAll();
            }, { owners: [ this.connectionOwner, mouseDownConnections ] });
        }
        const trimHandleMouseDownLeft = (e: MouseEvent) => {
            let mouseDownConnections = new ConnectionOwner();
            this.seekStartEvent.fire();
            let seekStartMx = e.clientX;
            const minSeek = editor.canvas.video.getMinSeek() ?? 0;
            const maxSeek = editor.canvas.video.getMaxSeek() ?? editor.canvas.video.videoEl.duration;
            let seekStartT = minSeek / editor.canvas.video.videoEl.duration;
            new HtmlConnection(window, "mousemove", (e: MouseEvent) => {
                let t = clamp(seekStartT + (e.clientX - seekStartMx) / this.durationSliderEl.clientWidth, 0, maxSeek / editor.canvas.video.videoEl.duration);
                editor.canvas.video.setMinSeek(t * editor.canvas.video.videoEl.duration);
                this.updateTrim();
                this.durationSliderValueContentEl.style.width = `${0}%`;
                this.durationSliderHandleEl.style.left = `${t * 100}%`;
                this.seekInputEvent.fire(t * editor.canvas.video.videoEl.duration);
            }, { owners: [ this.connectionOwner, mouseDownConnections ], });
            new HtmlConnection(window, "mouseup", (e: MouseEvent) => {
                this.seekEndEvent.fire();
                mouseDownConnections.disconnectAll();
            }, { owners: [ this.connectionOwner, mouseDownConnections ] });
        }
        const trimHandleMouseDownRight = (e: MouseEvent) => {
            let mouseDownConnections = new ConnectionOwner();
            this.seekStartEvent.fire();
            let seekStartMx = e.clientX;
            const minSeek = editor.canvas.video.getMinSeek() ?? 0;
            const maxSeek = editor.canvas.video.getMaxSeek() ?? editor.canvas.video.videoEl.duration;
            let seekStartT = maxSeek / editor.canvas.video.videoEl.duration;
            new HtmlConnection(window, "mousemove", (e: MouseEvent) => {
                let t = clamp(seekStartT + (e.clientX - seekStartMx) / this.durationSliderEl.clientWidth, minSeek / editor.canvas.video.videoEl.duration, 1);
                editor.canvas.video.setMaxSeek(t * editor.canvas.video.videoEl.duration);
                this.updateTrim();
                this.durationSliderValueContentEl.style.width = `${100}%`;
                this.durationSliderHandleEl.style.left = `${t * 100}%`;
                this.seekInputEvent.fire(t * editor.canvas.video.videoEl.duration);
            }, { owners: [ this.connectionOwner, mouseDownConnections ], });
            new HtmlConnection(window, "mouseup", (e: MouseEvent) => {
                this.seekEndEvent.fire();
                mouseDownConnections.disconnectAll();
            }, { owners: [ this.connectionOwner, mouseDownConnections ] });
        }
        new HtmlConnection(this.durationSliderEl, "mousedown", (e: MouseEvent) => {
            if(e.target == this.trimHandleLeftEl) {
                trimHandleMouseDownLeft(e);
                return;
            }
            if(e.target == this.trimHandleRightEl) {
                trimHandleMouseDownRight(e);
                return;
            }
            durationSliderMouseDown(e, e.target == this.durationSliderHandleEl);
        }, { owners: [ this.connectionOwner, ], });

        editor.canvas.renderEvent.connect(() => {
            if(this.bottomBar.editor.canvas.video._seeking.isActive())
                return;
            let t = editor.canvas.video.videoEl.currentTime / editor.canvas.video.videoEl.duration;
            const minSeek = editor.canvas.video.getMinSeek() ?? 0;
            const maxSeek = editor.canvas.video.getMaxSeek() ?? editor.canvas.video.videoEl.duration;
            let valuePercent = (t * editor.canvas.video.videoEl.duration - minSeek) / (maxSeek - minSeek);
            this.durationSliderValueContentEl.style.width = `${valuePercent * 100}%`;
            this.durationSliderHandleEl.style.left = `${t * 100}%`;
            this.updateTimeDisplay(editor.canvas.video.videoEl.currentTime);
        }, { owners: [ this.connectionOwner, ], initArgs: [], });
    }

    updateTrim() {
        const editor = this.bottomBar.editor;
        const duration = editor.canvas.video.videoEl.duration;
        const minSeek = editor.canvas.video.getMinSeek() ?? 0;
        const maxSeek = editor.canvas.video.getMaxSeek() ?? duration;
        this.durationSliderContentEl.style.left = `${minSeek / duration * 100}%`;
        this.durationSliderContentEl.style.width = `${(maxSeek - minSeek) / duration * 100}%`;
        this.trimHandleLeftEl.style.left = `calc(${minSeek / duration * 100}% - 8px)`;
        this.trimHandleRightEl.style.right = `calc(${(duration - maxSeek) / duration * 100}% - 8px)`;
    }

    updateTimeDisplay(elapsed: number) {
        const duration = this.bottomBar.editor.canvas.video.videoEl.duration;
        switch(this.durationType) {
            case VtebbDurationType.DEFAULT:
                this.currentTimeEl.textContent = formatVideoDuration(elapsed);
                this.totalTimeEl.textContent = formatVideoDuration(duration);
                break;
            case VtebbDurationType.PRECISE:
                this.currentTimeEl.textContent = formatVideoDurationPrecise(elapsed);
                this.totalTimeEl.textContent = formatVideoDurationPrecise(duration);
                break;
        }
    }
}