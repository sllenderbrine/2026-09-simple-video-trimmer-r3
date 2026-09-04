import { ConnectionOwner } from "../../shared/EventSignals/ConnectionOwner.js";
import { HtmlConnection } from "../../shared/EventSignals/HtmlConnection.js";
import { joinPaths } from "../../shared/Utility/FilePathUtility.js";
import { clamp } from "../../shared/Utility/MathUtility.js";

const PATH_RESOURCES = "..";
const PATH_ICONS = joinPaths(PATH_RESOURCES, "icons");

export class CustomScrollbar {
    containerEl: HTMLDivElement;
    arrowTopIconEl: HTMLDivElement;
    arrowBottomIconEl: HTMLDivElement;
    handleEl: HTMLDivElement;
    handlePercent: number = 0.5;
    connectionOwner: ConnectionOwner = new ConnectionOwner();
    constructor(public targetElement: HTMLDivElement) {
        this.containerEl = document.createElement("div");
        this.containerEl.classList.add("custom-scrollbar-container");

        this.arrowTopIconEl = document.createElement("div");
        this.containerEl.appendChild(this.arrowTopIconEl);
        this.arrowTopIconEl.classList.add("csb-arrow-top");

        this.arrowBottomIconEl = document.createElement("div");
        this.containerEl.appendChild(this.arrowBottomIconEl);
        this.arrowBottomIconEl.classList.add("csb-arrow-bottom");

        this.handleEl = document.createElement("div");
        this.containerEl.appendChild(this.handleEl);
        this.handleEl.classList.add("csb-handle");

        fetch(joinPaths(PATH_ICONS, "triangle-fill.svg")).then(res => res.text()).then(text => {
            this.arrowTopIconEl.innerHTML = text;
            this.arrowBottomIconEl.innerHTML = text;
        });

        new HtmlConnection(targetElement, "scroll", () => {
            this.updateHandlePosition();
        }, { owners: [ this.connectionOwner ] });

        new HtmlConnection(window, "resize", () => {
            this.updateHandlePosition();
        }, { owners: [ this.connectionOwner ] });

        let draggingConnectionOwner = new ConnectionOwner();
        new HtmlConnection(this.handleEl, "mousedown", (e: MouseEvent) => {
            let startY = e.clientY;
            let startPercent = this.handlePercent;
            const updateDrag = (e: MouseEvent) => {
                let dPercent = (e.clientY - startY) / this.getScollbarContentHeight();
                this.setHandlePercent(startPercent + dPercent);
                this.scrollTargetToHandle();
            }

            new HtmlConnection(window, "mousemove", (e: MouseEvent) => {
                updateDrag(e);
            }, { owners: [ this.connectionOwner, draggingConnectionOwner ] })

            new HtmlConnection(window, "mouseup", (e: MouseEvent) => {
                draggingConnectionOwner.disconnectAll();
            }, { owners: [ this.connectionOwner, draggingConnectionOwner ] })
        }, { owners: [ this.connectionOwner ] });

        this.updateHandlePosition();
    }

    updateHandlePosition() {
        this.setHandlePercent(this.targetElement.scrollTop / (this.targetElement.scrollHeight - this.targetElement.clientHeight));
    }

    getScrollbarContentMargin() {
        return 22 + this.handleEl.clientHeight / 2;
    }

    getScollbarContentHeight() {
        return this.containerEl.clientHeight - 2 * this.getScrollbarContentMargin();
    }

    setHandlePercent(percent: number) {
        if(!Number.isFinite(percent))
            percent = 0;
        percent = clamp(percent, 0, 1);
        this.handlePercent = percent;
        this.handleEl.style.top = (percent * this.getScollbarContentHeight() + this.getScrollbarContentMargin()) + "px";
    }

    scrollTargetToHandle() {
        this.targetElement.scrollTop = this.handlePercent * (this.targetElement.scrollHeight - this.targetElement.clientHeight);
    }

    remove() {
        this.containerEl.remove();
        this.connectionOwner.disconnectAll();
    }
}