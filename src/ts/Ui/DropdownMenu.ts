import { CssUtility } from "../Utility/CssUtility";

CssUtility.adoptStyle(`
    .dropdown-container {
        display: flex;
        flex-direction: column;
        background-color: var(--bg1);
        // outline: 1px solid var(--bg2);
        border-radius: 8px;
        padding: 4px 4px;
        width: 300px;
        height: fit-content;
        min-height: 12px;
        max-height: 200px;
        overflow-x: hidden;
        overflow-y: auto;
        scrollbar-width: none;
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
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
    }

    .dropdown-button:hover {
        background-color: var(--hover-bright);
    }

    .dropdown-button-icon-container {
        width: var(--item-height);
        height: var(--item-height);
        flex: 0 0 auto;
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
    }

    .dropdown-divider {
        width: 100%;
        height: 1px;
        background-color: var(--bg2);
        flex: 0 0 auto;
        margin: 4px 0px;
    }

    .dropdown-keybind-label {
        opacity: 0.5;
        width: fit-content;
        flex: 0 0 auto;
    }
`);

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

export type DropdownButtonElementAppendable = DropdownButtonLabelElement;

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
    decorativeButton: (svgArg: string, text: string, last?: string | DropdownMenuCreateCallback) => {
        let btn = new DropdownButtonElement();
        btn.append(new DropdownButtonLabelElement().setText(text));
        if(typeof last === "string") {
            let keybindEl = new DropdownButtonLabelElement().setText(last);
            keybindEl.containerEl.classList.add("dropdown-keybind-label");
            btn.append(keybindEl);
        } else if(typeof last === "function") {
            
        }
        return btn;
    }
}