import { ConnectionOwner } from "../../../shared/EventSignals/ConnectionOwner.js";
import { HtmlConnection } from "../../../shared/EventSignals/HtmlConnection.js";
import { Signal } from "../../../shared/EventSignals/Signal.js";
import { joinPaths } from "../../../shared/Utility/FilePathUtility.js";
import { clamp } from "../../../shared/Utility/MathUtility.js";
import { delay } from "../../../shared/Utility/PromiseUtility.js";
import { renderEvent } from "../../Ui/WindowGlobal/WindowEvents.js";
import { WindowKeypresses } from "../../Ui/WindowGlobal/WindowKeypresses.js";
import { VteBottomBar } from "./VteBottomBar.js";

const PATH_RESOURCES = "..";
const PATH_ICONS = joinPaths(PATH_RESOURCES, "icons");
const VOLUME_SHIFT_PRECISE_SPEED = 15;

export class VtebbToolsRight {
    containerEl: HTMLDivElement;
    volumeSliderContainerEl: HTMLDivElement;
    volumeSliderEl: HTMLDivElement;
    volumeSliderValueEl: HTMLDivElement;
    volumeHandleEl: HTMLDivElement;
    volumeTooltipEl: HTMLDivElement;
    iconEl: HTMLDivElement;
    iconContentElements: HTMLDivElement[] = [];
    volume: number = 100;
    minVolume: number = 0;
    maxVolume: number = 200;
    unmuteToVolume: number = 100;
    muted: boolean = false;
    hideTooltipAnimIndex: number = 0;
    volumeInputEvent: Signal<[volume: number]> = new Signal();
    connectionOwner: ConnectionOwner = new ConnectionOwner();
    constructor(public bottombar: VteBottomBar) {
        this.containerEl = document.createElement("div");
        bottombar.toolsContainerEl.appendChild(this.containerEl);
        this.containerEl.classList.add("vtebb-tools-right");
        
        this.volumeSliderContainerEl = document.createElement("div");
        this.containerEl.appendChild(this.volumeSliderContainerEl);
        this.volumeSliderContainerEl.classList.add("vtebb-volume-container");
        this.volumeSliderContainerEl.title = "Playback Volume";

        this.volumeSliderEl = document.createElement("div");
        this.volumeSliderContainerEl.appendChild(this.volumeSliderEl);
        this.volumeSliderEl.classList.add("vtebb-volume-slider");

        let separator = document.createElement("div");
        this.volumeSliderEl.appendChild(separator);
        separator.style = "position:absolute;top:0px;left:50%;transform:translateX(-50%);width:2px;height:100%;backdrop-filter:brightness(0.5) invert(1);z-index:2;";

        this.volumeSliderValueEl = document.createElement("div");
        this.volumeSliderEl.appendChild(this.volumeSliderValueEl);
        this.volumeSliderValueEl.classList.add("vtebb-volume-slider-value");

        this.volumeHandleEl = document.createElement("div");
        this.volumeSliderValueEl.appendChild(this.volumeHandleEl);
        this.volumeHandleEl.classList.add("vtebb-volume-slider-handle");

        this.volumeTooltipEl = document.createElement("div");
        this.volumeHandleEl.appendChild(this.volumeTooltipEl);
        this.volumeTooltipEl.classList.add("vtebb-volume-slider-tooltip");

        this.iconEl = document.createElement("div");
        this.volumeSliderContainerEl.appendChild(this.iconEl);
        this.iconEl.classList.add("vtebb-volume-icon");

        const volumeIcon0 = document.createElement("div");
        volumeIcon0.style.scale = "1.3";
        this.iconEl.appendChild(volumeIcon0);
        volumeIcon0.classList.add("vtebb-volume-icon-content");
        fetch(joinPaths(PATH_ICONS, "volume0.svg")).then(res => res.text()).then(text => {
            volumeIcon0.innerHTML = text;
        });
        this.iconContentElements.push(volumeIcon0);
        const volumeIcon1 = document.createElement("div");
        volumeIcon1.style.scale = "1.3";
        this.iconEl.appendChild(volumeIcon1);
        volumeIcon1.classList.add("vtebb-volume-icon-content");
        fetch(joinPaths(PATH_ICONS, "volume1.svg")).then(res => res.text()).then(text => {
            volumeIcon1.innerHTML = text;
        });
        this.iconContentElements.push(volumeIcon1);
        const volumeIcon2 = document.createElement("div");
        volumeIcon2.style.scale = "1.3";
        this.iconEl.appendChild(volumeIcon2);
        volumeIcon2.classList.add("vtebb-volume-icon-content");
        fetch(joinPaths(PATH_ICONS, "volume2.svg")).then(res => res.text()).then(text => {
            volumeIcon2.innerHTML = text;
        });
        this.iconContentElements.push(volumeIcon2);
        const volumeIcon3 = document.createElement("div");
        volumeIcon3.style.scale = "1.3";
        this.iconEl.appendChild(volumeIcon3);
        volumeIcon3.classList.add("vtebb-volume-icon-content");
        fetch(joinPaths(PATH_ICONS, "volume3.svg")).then(res => res.text()).then(text => {
            volumeIcon3.innerHTML = text;
        });
        this.iconContentElements.push(volumeIcon3);
        const volumeIcon4 = document.createElement("div");
        volumeIcon4.style.scale = "1.3";
        this.iconEl.appendChild(volumeIcon4);
        volumeIcon4.classList.add("vtebb-volume-icon-content");
        fetch(joinPaths(PATH_ICONS, "volume4.svg")).then(res => res.text()).then(text => {
            volumeIcon4.innerHTML = text;
        });
        this.iconContentElements.push(volumeIcon4);

        let dragConnections = new ConnectionOwner();
        const startDrag = (e: MouseEvent) => {
            if(this.muted)
                this.muted = false
            this.showTooltip();
            let startMx = e.clientX;
            let startT = (this.volume - this.minVolume) / (this.maxVolume - this.minVolume);
            const dragUpdate = (e: MouseEvent) => {
                let dx = e.clientX - startMx;
                let rect = this.volumeSliderEl.getBoundingClientRect();
                let dt = dx / rect.width;
                this.volume = clamp((startT + dt) * (this.maxVolume - this.minVolume) + this.minVolume, this.minVolume, this.maxVolume);
                this._snapVolume();
                this.updateVolumeVisual();
                this.volumeInputEvent.fire(this.volume);
            }
            if(e.target != this.volumeHandleEl) {
                let rect = this.volumeSliderEl.getBoundingClientRect();
                const t = (this.volume - this.minVolume) / (this.maxVolume - this.minVolume);
                startMx = rect.left + rect.width * t;
                dragUpdate(e);
            }
            renderEvent.connect(dt => {
                if(WindowKeypresses.isKeyDown("a")) {
                    startMx += dt * VOLUME_SHIFT_PRECISE_SPEED
                    this.volume = clamp(this.volume - dt * VOLUME_SHIFT_PRECISE_SPEED, this.minVolume, this.maxVolume);
                }
                if(WindowKeypresses.isKeyDown("d")) {
                    startMx -= dt * VOLUME_SHIFT_PRECISE_SPEED
                    this.volume = clamp(this.volume + dt * VOLUME_SHIFT_PRECISE_SPEED, this.minVolume, this.maxVolume);
                }
                this.updateVolumeVisual();
            }, { owners: [ this.connectionOwner, dragConnections, ], });
            new HtmlConnection(window, "mousemove", (e: MouseEvent) => {
                dragUpdate(e);
            }, { owners: [ this.connectionOwner, dragConnections, ], });
            new HtmlConnection(window, "mouseup", (e: MouseEvent) => {
                dragConnections.disconnectAll();
                this.hideTooltip(0.5);
            }, { owners: [ this.connectionOwner, dragConnections, ], });
        }
        new HtmlConnection(this.volumeSliderEl, "mousedown", (e: MouseEvent) => {
            if(e.target == this.volumeHandleEl)
                return;
            startDrag(e);
        }, { owners: [ this.connectionOwner, ], });
        new HtmlConnection(this.volumeHandleEl, "mousedown", (e: MouseEvent) => {
            startDrag(e);
        }, { owners: [ this.connectionOwner, ], });
        
        new HtmlConnection(this.iconEl, "click", (e: MouseEvent) => {
            this.toggleMuted();
            this.volumeInputEvent.fire(this.volume);
        }, { owners: [ this.connectionOwner, ], });

        this._updateIcon();
        this.hideTooltip();
        this.updateVolumeVisual();
    }

    _snapVolume() {
        let snapped = Math.round(this.volume / 10) * 10;
        let dist = Math.abs(snapped - this.volume);
        if(dist < 3)
            this.volume = snapped;
    }

    updateVolumeVisual() {
        this._updateVolumeHandlePosition();
        this._updateVolumeTooltipText();
        this._updateIcon();
    }

    _updateVolumeTooltipText() {
        this.volumeTooltipEl.textContent = (Math.floor(this.volume * 10) / 10) + "%";
    }

    _updateVolumeHandlePosition() {
        const t = (this.volume - this.minVolume) / (this.maxVolume - this.minVolume);
        this.volumeSliderValueEl.style.width = (t * 100) + "%";
    }

    showTooltip() {
        this.hideTooltipAnimIndex++;
        this.volumeTooltipEl.animate([
            { transform: "translate(-50%, -150%) translateY(-20px)", opacity: "0", },
            { transform: "translate(-50%, -150%) translateY(0px)", opacity: "1", },
        ], { duration: 100, easing: "ease", });
        this.volumeTooltipEl.style.opacity = "1";
    }

    async hideTooltip(timeout?: number) {
        if(timeout != null) {
            let i = ++this.hideTooltipAnimIndex;
            let startT = performance.now();
            let now = startT;
            while((now - startT) / 1000 < timeout) {
                await delay(100);
                if(i !== this.hideTooltipAnimIndex)
                    return;
                now = performance.now();
            }
        }
        this.volumeTooltipEl.animate([
            { transform: "translate(-50%, -150%) translateY(0px)", opacity: "1", },
            { transform: "translate(-50%, -150%) translateY(-20px)", opacity: "0", },
        ], { duration: 100, easing: "ease", });
        this.volumeTooltipEl.style.opacity = "0";
    }

    toggleMuted() {
        if(this.muted) {
            this.muted = false;
            this.volume = this.unmuteToVolume;
        } else {
            this.muted = true;
            this.unmuteToVolume = this.volume;
            this.volume = 0;
        }
        this.updateVolumeVisual();
    }

    _updateIcon() {
        const t = (this.volume - this.minVolume) / (this.maxVolume - this.minVolume);
        let index = clamp(Math.ceil((t + 0.15) * (this.iconContentElements.length - 1)), 0, this.iconContentElements.length - 1);
        if(t < 1e-7)
            index = 0;
        this.setIcon(index);
    }

    setIcon(n: number) {
        for(let i=0; i<this.iconContentElements.length; i++) {
            const el = this.iconContentElements[i]!;
            el.style.display = i === n ? "flex" : "none";
        }
    }
}