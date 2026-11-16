import { CssUtility } from "../Utility/CssUtility";

export const DROPDOWNMENU_STYLE = CssUtility.adoptStyle(`
    .dropdownmenu {
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

    .dropdownmenu-button {
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

    .dropdownmenu-button:hover {
        background-color: var(--bright1);
    }

    .dropdownmenu-prefixicon {
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

        svg {
            width: 100%;
            height: 100%;
        }
    }

    .dropdownmenu-title {
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

    .dropdownmenu-divider {
        width: 100%;
        height: 1px;
        background-color: var(--bg2);
        flex: 0 0 auto;
        margin: 4px 0px;
        user-select: none;
        pointer-events: none;
    }

    .dropdownmenu-keybind {
        height: var(--item-height);
        align-content: center;
        text-align: left;
        padding: 0px 12px;
        white-space: nowrap;
        overflow: hidden;
        user-select: none;
        pointer-events: none;
        opacity: 0.5;
        width: fit-content;
        flex: 0 0 auto;
    }

    .dropdownmenu-expandicon {
        width: var(--item-height);
        height: var(--item-height);
        flex: 0 0 auto;
        user-select: none;
        pointer-events: none;
        text-align: center;
        align-content: center;
        padding: 0px 4px;
        opacity: 0.5;

        svg {
            width: 100%;
            height: 100%;
        }
    }

    .dropdownmenu-radiotogglecontainer {
        width: 16px;
        height: var(--item-height);
        flex: 0 0 auto;
        user-select: none;
        pointer-events: none;
        opacity: 0.5;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 0px 4px;
    }

    .dropdownmenu-radiotoggle {
        width: calc(var(--item-height) * 0.2);
        height: calc(var(--item-height) * 0.2);
        outline: 1.5px solid var(--text);
        border: 2px solid var(--bg1);
        border-radius: var(--item-height);
    }
`);

export class DropdownMenuRadioToggle {
    public _containerEl: HTMLDivElement;
    public _contentEl: HTMLDivElement;
    public _value = false;
    constructor() {
        this._containerEl = document.createElement("div");
        this._containerEl.classList.add("dropdownmenu-radiotogglecontainer");
        this._contentEl = document.createElement("div");
        this._contentEl.classList.add("dropdownmenu-radiotoggle");
        this._containerEl.appendChild(this._contentEl);
    }
    
    public enable() {
        this._value = true;
        this._contentEl.style.backgroundColor = "var(--text)";
    }
    
    public disable() {
        this._value = false;
        this._contentEl.style.backgroundColor = "";
    }
}

export class DropdownMenuExpandIcon {
    public _containerEl: HTMLDivElement;
    public _svgEl: SVGElement | null = null;
    constructor() {
        this._containerEl = document.createElement("div");
        this._containerEl.classList.add("dropdownmenu-expandicon");
        fetch("./src/icons/triangle-fill.svg").then(res => res.text()).then(text => {
            this._containerEl.innerHTML = text;
            this._svgEl = this._containerEl.querySelector("svg");
            if(this._svgEl !== null) {
                this._svgEl.style.scale = "0.6";
                this._svgEl.style.rotate = "90deg";
            }
        });
    }
}

export class DropdownMenuPrefixIcon {
    public _containerEl: HTMLDivElement;
    public _svgEl: SVGElement | null = null;
    public _fetchId = 0;
    public _scale = 1;
    constructor() {
        this._containerEl = document.createElement("div");
        this._containerEl.classList.add("dropdownmenu-prefixicon");
    }

    public setIcon(src: string): void {
        let fetchId = ++this._fetchId;
        if(src.endsWith(".svg")) {
            fetch(src).then(res => res.text()).then(text => {
                if(fetchId != this._fetchId)
                    return;
                this._containerEl.innerHTML = text;
                this._svgEl = this._containerEl.querySelector("svg");
                if(this._svgEl !== null)
                    this._svgEl.style.scale = this._scale.toString();
            });
        }
    }

    public setScale(scale: number): void {
        this._scale = scale;
        if(this._svgEl !== null)
            this._svgEl.style.scale = this._scale.toString();
    }
}

export class DropdownMenuTitle {
    public _containerEl: HTMLDivElement;
    constructor() {
        this._containerEl = document.createElement("div");
        this._containerEl.classList.add("dropdownmenu-title");
    }

    public setText(text: string): this {
        this._containerEl.textContent = text;
        return this;
    }

    public setTooltip(text: string): this {
        this._containerEl.title = text;
        return this;
    }
}

export class DropdownMenuKeybind {
    public _containerEl: HTMLDivElement;
    constructor() {
        this._containerEl = document.createElement("div");
        this._containerEl.classList.add("dropdownmenu-keybind");
    }

    public setText(text: string): this {
        this._containerEl.textContent = text;
        return this;
    }

    public setTooltip(text: string): this {
        this._containerEl.title = text;
        return this;
    }
}

export type DropdownMenuButtonChild = DropdownMenuPrefixIcon
    | DropdownMenuTitle
    | DropdownMenuKeybind
    | DropdownMenuExpandIcon
    | DropdownMenuRadioToggle;

export class DropdownMenuButton {
    public _containerEl: HTMLButtonElement;
    public _children: DropdownMenuButtonChild[] = [];
    public _childMenuK: ((k: DropdownMenu) => void) | null = null;
    public _parentMenu: DropdownMenu | null = null;
    constructor() {
        this._containerEl = document.createElement("button");
        this._containerEl.classList.add("dropdownmenu-button");
        this._containerEl.addEventListener("mouseenter", e => {
            if(this._parentMenu == null)
                return;
            if(this._parentMenu._childMenu != null) {
                this._parentMenu._childMenu.remove();
                this._parentMenu._childMenu = null;
            }
            if(this._childMenuK != null) {
                this._parentMenu._childMenu = new DropdownMenu(this._childMenuK);
                this._parentMenu._childMenu._parentMenu = this._parentMenu;
            }
        });
    }

    public addPrefixIcon(callback?: (k: DropdownMenuPrefixIcon) => void) {
        const el = new DropdownMenuPrefixIcon();
        callback?.(el);
        this._containerEl.appendChild(el._containerEl);
        this._children.push(el);
        return el;
    }

    public addPrefixIcon2(name: string, scale?: number) {
        const k = this.addPrefixIcon();
        k.setIcon("./src/icons/" + name);
        if(scale !== undefined)
            k.setScale(scale);
        return k;
    }

    public addTitle(callback?: (k: DropdownMenuTitle) => void) {
        const el = new DropdownMenuTitle();
        callback?.(el);
        this._containerEl.appendChild(el._containerEl);
        this._children.push(el);
        return el;
    }

    public addTitle2(text: string, tooltip?: string) {
        const k = this.addTitle();
        k.setText(text);
        if(tooltip !== undefined)
            k.setTooltip(tooltip);
        return k;
    }

    public addKeybind(callback?: (k: DropdownMenuKeybind) => void) {
        const el = new DropdownMenuKeybind();
        callback?.(el);
        this._containerEl.appendChild(el._containerEl);
        this._children.push(el);
        return el;
    }

    public addKeybind2(text: string, tooltip?: string) {
        const k = this.addKeybind();
        k.setText(text);
        if(tooltip !== undefined)
            k.setTooltip(tooltip);
        return k;
    }

    public addExpandIcon(callback?: (k: DropdownMenuExpandIcon) => void) {
        const el = new DropdownMenuExpandIcon();
        callback?.(el);
        this._containerEl.appendChild(el._containerEl);
        this._children.push(el);
        return el;
    }

    public addRadioToggle(callback?: (k: DropdownMenuRadioToggle) => void) {
        const el = new DropdownMenuRadioToggle();
        callback?.(el);
        this._containerEl.appendChild(el._containerEl);
        this._children.push(el);
        return el;
    }

    public addChildMenu(callback?: (k: DropdownMenu) => void) {
        this._childMenuK = callback ?? null;
        this.addExpandIcon();
    }

    public setTooltip(text: string) {
        this._containerEl.title = text;
    }

    public enable() {
        this._containerEl.style.opacity = "";
        this._containerEl.style.backgroundColor = "";
        this._containerEl.style.cursor = "";
        this._containerEl.style.pointerEvents = "";
        this._containerEl.disabled = false;
    }

    public disable() {
        this._containerEl.style.opacity = "0.3";
        this._containerEl.style.backgroundColor = "rgb(10, 10, 10)";
        this._containerEl.style.cursor = "default";
        this._containerEl.style.pointerEvents = "none";
        this._containerEl.disabled = true;
    }
}

export class DropdownMenuDivider {
    public _containerEl: HTMLDivElement;
    constructor() {
        this._containerEl = document.createElement("div");
        this._containerEl.classList.add("dropdownmenu-divider");
    }
}

export type DropdownMenuChild = DropdownMenuButton
    | DropdownMenuDivider;

export class DropdownMenu {
    public _containerEl: HTMLDivElement;
    public _elements: DropdownMenuChild[] = [];
    public _initCallbackActive = false;
    public _childMenu: DropdownMenu | null = null;
    public _parentMenu: DropdownMenu | null = null;
    public _isHovering = false;
    public _hoverLostTimeout: number | null = null;
    public _x = 0;
    public _y = 0;
    public _xs = 0;
    public _ys = 0;
    constructor(callback?: (k: DropdownMenu) => void) {
        this._containerEl = document.createElement("div");
        this._containerEl.classList.add("dropdownmenu");
        this._containerEl.addEventListener("contextmenu", e => {
            e.preventDefault();
        });
        document.body.appendChild(this._containerEl);
        this._initCallbackActive = true;
        callback?.(this);
        this._initCallbackActive = false;
        this.updatePosition();
        this.animateOpen();
        this.updateBorderRadius();
        this._containerEl.addEventListener("mouseenter", e => {
            if(this._isHovering)
                return;
            this._isHovering = true;
            this._onMouseEnterProp();
        });
        this._containerEl.addEventListener("mouseleave", e => {
            if(!this._isHovering)
                return;
            this._isHovering = false;
            this._onMouseLeaveProp();
        });
    }
    
    public addButton(callback?: (k: DropdownMenuButton) => void) {
        let el = new DropdownMenuButton();
        el._parentMenu = this;
        callback?.(el);
        this._elements.push(el);
        this._containerEl.appendChild(el._containerEl);
        this.updateBorderRadius();
        return el;
    }
    
    public addDivider(callback?: (k: DropdownMenuDivider) => void) {
        let el = new DropdownMenuDivider();
        callback?.(el);
        this._elements.push(el);
        this._containerEl.appendChild(el._containerEl);
        this.updateBorderRadius();
        return el;
    }

    public updateBorderRadius() {
        if(this._initCallbackActive)
            return;
        for(let i=0; i<this._elements.length; i++) {
            const el = this._elements[i]!;
            const prevEl = this._elements[i - 1];
            const nextEl = this._elements[i + 1];
            if(el instanceof DropdownMenuButton) {
                if(prevEl != null && prevEl instanceof DropdownMenuButton) {
                    el._containerEl.style.borderTopLeftRadius = "0px";
                    el._containerEl.style.borderTopRightRadius = "0px";
                }
                if(nextEl != null && nextEl instanceof DropdownMenuButton) {
                    el._containerEl.style.borderBottomLeftRadius = "0px";
                    el._containerEl.style.borderBottomRightRadius = "0px";
                }
            }
        }
    }

    public updatePosition() {
        if(this._initCallbackActive)
            return;
        if((this._x + this._xs) + this._containerEl.offsetWidth > window.innerWidth) {
            this._containerEl.style.left = (this._x - this._containerEl.offsetWidth) + "px";
        } else {
            this._containerEl.style.left = (this._x + this._xs) + "px";
        }
        if(this._y + this._containerEl.offsetHeight > window.innerHeight) {
            this._containerEl.style.top = (this._y + this._ys - this._containerEl.offsetHeight) + "px";
        } else {
            this._containerEl.style.top = this._y + "px";
        }
    }

    public setPosition(x: number, y: number) {
        this._x = x;
        this._y = y;
        this._xs = 0;
        this._ys = 0;
        this.updatePosition();
    }

    public setPosition2(button: DropdownMenuButton) {
        let rect = button._containerEl.getBoundingClientRect();
        this._x = rect.left;
        this._y = rect.top;
        this._xs = rect.width;
        this._ys = rect.height;
        this.updatePosition();
    }

    public setWidth(x: number) {
        this._containerEl.style.width = x + "px";
        this.updatePosition();
    }

    public animateOpen() {
        this._containerEl.animate([
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
                height: (this._containerEl.clientHeight - 8) + "px",
                scale: "1",
                transformOrigin: "top left",
                opacity: "1",
                pointerEvents: "none",
            },
        ], { duration: 150, easing: "ease-in-out" });
    }

    public animateClose() {
        this._containerEl.animate([
            {
                minHeight: "0px",
                height: (this._containerEl.clientHeight - 8) + "px",
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
        this._containerEl.style.opacity = "0";
        this._containerEl.style.pointerEvents = "none";
    }

    public _onMouseEnterProp() {
        if(this._parentMenu != null) {
            this._parentMenu._onMouseEnterProp();
            return;
        }
        if(this._hoverLostTimeout != null) {
            clearTimeout(this._hoverLostTimeout);
            this._hoverLostTimeout = null;
        }
    }

    public _onMouseLeaveProp() {
        if(this._parentMenu != null) {
            if(this._parentMenu._isHovering)
                return;
            this._parentMenu._onMouseLeaveProp();
            return;
        }
        this._hoverLostTimeout = setTimeout(() => {
            this._childMenu?.remove();
            this._childMenu = null;
        }, 150);
    }

    public remove() {
        this.animateClose();
        if(this._childMenu != null) {
            this._childMenu.remove();
            this._childMenu = null;
        }
        setTimeout(() => {
            this._containerEl.remove();
        }, 150);
    }
}
