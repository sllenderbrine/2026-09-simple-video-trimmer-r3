import { VteBottomBar } from "./VteBottomBar.js";

export class VtebbToolsLeft {
    containerEl: HTMLDivElement;
    textBoxEl: HTMLInputElement;
    constructor(public bottombar: VteBottomBar) {
        this.containerEl = document.createElement("div");
        bottombar.toolsContainerEl.appendChild(this.containerEl);
        this.containerEl.classList.add("vtebb-tools-left");

        this.textBoxEl = document.createElement("input");
        this.containerEl.appendChild(this.textBoxEl);
        this.textBoxEl.classList.add("vtebb-title-input");
        this.textBoxEl.type = "text";
        this.textBoxEl.title = "Rename Video Title";
    }

    setTitle(v: string) {
        this.textBoxEl.value = v;
    }

    getTitle() {
        return this.textBoxEl.value;
    }
}