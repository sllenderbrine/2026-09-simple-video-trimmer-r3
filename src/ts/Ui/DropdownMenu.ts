import { CssUtility } from "../Utility/CssUtility";

CssUtility.adoptStyle(`
    .dropdown-container {
        position: absolute;
        display: flex;
        flex-direction: column;
        background-color: var(--bg1);
        // outline: 1px solid var(--bg2);
        border-radius: 8px;
        padding: 4px 4px;
        width: 300px;
        height: fit-content;
        min-height: 12px;
        max-height: 300px;
        overflow-x: hidden;
        overflow-y: auto;
        scrollbar-width: none;
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
        user-select: none;
        --item-height: 24px;
    }

    .dropdown-button {
        display: flex;
        flex-direction: row;
        flex: 0 0 auto;
        height: var(--item-height);
        align-items: center;
        padding: 0;
        border: none;
        outline: none;
        background-color: transparent;
        cursor: pointer;
        transition: background-color 0.1s ease;
        border-radius: 4px;
        user-select: none;
        overflow: hidden;
    }

    .dropdown-button:hover {
        background-color: var(--bright1);
    }

    .dropdown-button-icon-container {
        width: var(--item-height);
        height: var(--item-height);
        flex: 0 0 auto;
        user-select: none;
        pointer-events: none;
        background-color: var(--bright0);
        text-align: center;
        align-content: center;
        padding: 0px 4px;
        opacity: 0.5;
    }
    
    .dropdown-button-icon-container svg {
        width: 100%;
        height: 100%;
    }

    .dropdown-button-label {
        width: 100%;
        height: var(--item-height);
        flex-shrink: 1;
        align-content: center;
        text-align: left;
        padding: 0px 12px;
        white-space: nowrap;
        overflow: hidden;
        user-select: none;
        pointer-events: none;
    }

    .dropdown-divider {
        width: 100%;
        height: 1px;
        background-color: var(--bg2);
        flex: 0 0 auto;
        margin: 4px 0px;
        user-select: none;
        pointer-events: none;
    }

    .dropdown-keybind-label {
        opacity: 0.5;
        width: fit-content;
        flex: 0 0 auto;
        user-select: none;
        pointer-events: none;
    }

    .dropdown-button-expand-icon {
        background-color: transparent;
    }
`);

export class DropdownButtonIconElement {
    public containerEl: HTMLDivElement;
    public svgEl: SVGElement | null = null;
    private _fetchIndex = 0;
    private _scale = 1;
    constructor() {
        this.containerEl = document.createElement("div");
        this.containerEl.classList.add("dropdown-button-icon-container");
    }

    public setIcon(src: string): void {
        let fetchId = ++this._fetchIndex;
        fetch(src).then(res => res.text()).then(text => {
            if(fetchId != this._fetchIndex)
                return;
            this.containerEl.innerHTML = text;
            this.svgEl = this.containerEl.querySelector("svg");
            if(this.svgEl !== null)
                this.svgEl.style.scale = this._scale.toString();
        });
    }

    public setScale(scale: number): void {
        this._scale = scale;
        if(this.svgEl !== null)
            this.svgEl.style.scale = this._scale.toString();
    }
}

export class DropdownButtonLabelElement {
    public containerEl: HTMLDivElement;
    constructor() {
        this.containerEl = document.createElement("div");
        this.containerEl.classList.add("dropdown-button-label");
    }

    public setText(text: string): this {
        this.containerEl.textContent = text;
        return this;
    }

    public setTooltip(text: string): this {
        this.containerEl.title = text;
        return this;
    }
}

export type DropdownButtonElementAppendable = DropdownButtonLabelElement
    | DropdownButtonIconElement;

export class DropdownButtonElement {
    public containerEl: HTMLButtonElement;
    public elements: DropdownButtonElementAppendable[] = [];
    constructor() {
        this.containerEl = document.createElement("button");
        this.containerEl.classList.add("dropdown-button");
    }

    public append(...els: DropdownButtonElementAppendable[]): this {
        for(const el of els) {
            this.containerEl.appendChild(el.containerEl);
            this.elements.push(el);
        }
        return this;
    }

    public setTooltip(text: string): this {
        this.containerEl.title = text;
        return this;
    }

    public setEnabled(value: boolean): this {
        if(value) {
            this.containerEl.style.opacity = "";
            this.containerEl.style.backgroundColor = "";
            this.containerEl.style.cursor = "";
            this.containerEl.style.pointerEvents = "";
            this.containerEl.disabled = false;
        } else {
            this.containerEl.style.opacity = "0.3";
            this.containerEl.style.backgroundColor = "rgb(10, 10, 10)";
            this.containerEl.style.cursor = "default";
            this.containerEl.style.pointerEvents = "none";
            this.containerEl.disabled = true;
        }
        console.log(value);
        return this;
    }

    public onClick(callback: (e: MouseEvent) => void): this {
        this.containerEl.addEventListener("click", callback);
        return this;
    }
}

export class DropdownDividerElement {
    public containerEl: HTMLDivElement;
    constructor() {
        this.containerEl = document.createElement("div");
        this.containerEl.classList.add("dropdown-divider");
    }
}

export type DropdownMenuElementAppendable = DropdownButtonElement
    | DropdownDividerElement;

export type DropdownMenuCreateCallback = (menu: DropdownMenuElement, k: typeof dropdownMenuElementCreator) => void;

export class DropdownMenuElement {
    public containerEl: HTMLDivElement;
    public elements: DropdownMenuElementAppendable[] = [];
    constructor() {
        this.containerEl = document.createElement("div");
        this.containerEl.classList.add("dropdown-container");
        this.containerEl.addEventListener("contextmenu", e => {
            e.preventDefault();
        });
        document.body.appendChild(this.containerEl);
    }

    public static create(callback: DropdownMenuCreateCallback): DropdownMenuElement {
        let menu = new DropdownMenuElement();
        callback(menu, dropdownMenuElementCreator);
        return menu;
    }

    public append(...els: DropdownMenuElementAppendable[]): this {
        for(const el of els) {
            this.containerEl.appendChild(el.containerEl);
            this.elements.push(el);
        }
        this.updateBorderRadius();
        return this;
    }

    public updateBorderRadius(): void {
        for(let i=0; i<this.elements.length; i++) {
            const el = this.elements[i]!;
            const prevEl = this.elements[i - 1];
            const nextEl = this.elements[i + 1];
            if(el instanceof DropdownButtonElement) {
                if(prevEl != null && prevEl instanceof DropdownButtonElement) {
                    el.containerEl.style.borderTopLeftRadius = "0px";
                    el.containerEl.style.borderTopRightRadius = "0px";
                }
                if(nextEl != null && nextEl instanceof DropdownButtonElement) {
                    el.containerEl.style.borderBottomLeftRadius = "0px";
                    el.containerEl.style.borderBottomRightRadius = "0px";
                }
            }
        }
    }

    public setPosition(x: number, y: number): this {
        if(x + this.containerEl.offsetWidth > window.innerWidth) {
            this.containerEl.style.right = (window.innerWidth - x) + "px";
        } else {
            this.containerEl.style.left = x + "px";
        }
        console.log(y, window.innerHeight);
        if(y + this.containerEl.offsetHeight > window.innerHeight) {
            this.containerEl.style.bottom = (window.innerHeight - y) + "px";
        } else {
            this.containerEl.style.top = y + "px";
        }
        return this;
    }

    public animateOpen(): this {
        this.containerEl.animate([
            {
                minHeight: "0px",
                height: "0px",
                scale: "0.9",
                transformOrigin: "top left",
                opacity: "0",
                pointerEvents: "none",
            },
            {
                minHeight: "0px",
                height: (this.containerEl.clientHeight - 8) + "px",
                scale: "1",
                transformOrigin: "top left",
                opacity: "1",
                pointerEvents: "none",
            },
        ], { duration: 150, easing: "ease-in-out" });
        return this;
    }

    public animateClose(): this {
        this.containerEl.animate([
            {
                minHeight: "0px",
                height: (this.containerEl.clientHeight - 8) + "px",
                scale: "1",
                transformOrigin: "top left",
                opacity: "1",
            },
            {
                minHeight: "0px",
                height: "0px",
                scale: "0.9",
                transformOrigin: "top left",
                opacity: "0",
            },
        ], { duration: 150, easing: "ease-in-out" });
        this.containerEl.style.opacity = "0";
        this.containerEl.style.pointerEvents = "none";
        return this;
    }
}

const dropdownMenuElementCreator = {
    button: () => new DropdownButtonElement(),
    buttonLabel: (text: string) => new DropdownButtonLabelElement().setText(text),
    divider: () => new DropdownDividerElement(),
    textButton: (text: string, keybind: string) => {
        let btn = new DropdownButtonElement();
        btn.append(new DropdownButtonLabelElement().setText(text));
        let keybindEl = new DropdownButtonLabelElement().setText(keybind);
        keybindEl.containerEl.classList.add("dropdown-keybind-label");
        btn.append(keybindEl);
        return btn;
    },
    decorativeButton: (first: string, text: string, last?: string | DropdownMenuCreateCallback) => {
        let btn = new DropdownButtonElement();
        let iconEl = new DropdownButtonIconElement();
        btn.append(iconEl);
        if(first !== "") {
            let parts = first.split("/");
            let iconName = parts[0]!;
            let iconScale = parseFloat(parts[1] ?? "1");
            if(!isFinite(iconScale)) iconScale = 1;
            iconEl.setIcon("./src/icons/" + iconName);
            iconEl.setScale(iconScale);
        }
        btn.append(new DropdownButtonLabelElement().setText(text));
        if(typeof last === "string") {
            let keybindEl = new DropdownButtonLabelElement().setText(last);
            keybindEl.containerEl.classList.add("dropdown-keybind-label");
            btn.append(keybindEl);
        } else if(typeof last === "function") {
            let iconEl = new DropdownButtonIconElement();
            iconEl.containerEl.classList.add("dropdown-button-expand-icon");
            iconEl.setIcon("./src/icons/triangle.svg");
            iconEl.setScale(0.5);
            btn.append(iconEl);
        }
        return btn;
    },
}
