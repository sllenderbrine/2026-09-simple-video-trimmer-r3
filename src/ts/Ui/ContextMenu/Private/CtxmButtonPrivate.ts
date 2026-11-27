import { ContextMenu, ContextMenuChild } from "../Public/ContextMenu";
import { CtxmButton } from "../Public/CtxmButton";
import { ContextMenuPrivate } from "./ContextMenuPrivate";

const TEXT_PADDING = 12;

const privateMap = new WeakMap<CtxmButton, CtxmButtonPrivate>();

export class CtxmButtonPrivate {
    public containerEl: HTMLDivElement;
    public menu: ContextMenu;
    public titleEl?: HTMLDivElement;
    public keybindEl?: HTMLDivElement;
    public prefixIconEl?: HTMLDivElement;
    public keybindWidth = 0;
    public targetWidth = 0;
    public prefixIconScale = 1;
    public width = 0;
    constructor(obj: CtxmButton, menu: ContextMenu) {
        privateMap.set(obj, this);
        this.menu = menu;

        this.containerEl = document.createElement("div");
        this.containerEl.classList.add("dropdownmenu-button");
        const menuPrivate = ContextMenuPrivate.get(menu)!;
        menuPrivate.contentEl.appendChild(this.containerEl);
        menuPrivate.children.push(obj);
        menuPrivate.updateLayout();
    }

    public static get(obj: CtxmButton) {
        return privateMap.get(obj);
    }

    public updateTargetWidth() {
        this.targetWidth = 0;
        if(this.prefixIconEl !== undefined) {
            this.targetWidth += 30;
        }
        if(this.titleEl) {
            let s = this.titleEl.style.width;
            this.titleEl.style.width = "fit-content";
            this.targetWidth += this.titleEl.offsetWidth + TEXT_PADDING * 2;
            this.titleEl.style.width = s;
        }
        if(this.keybindEl) {
            let s = this.keybindEl.style.width;
            this.keybindEl.style.width = "fit-content";
            this.keybindWidth = this.keybindEl.offsetWidth;
            this.targetWidth += this.keybindWidth + TEXT_PADDING * 2;
            this.keybindEl.style.width = s;
        }
    }

    public setTop(top: number) {
        this.containerEl.style.top = top + "px";
    }

    public setWidth(width: number) {
        this.width = width;
        this.containerEl.style.width = width + "px";
        let left = 0;
        let right = 0;
        if(this.prefixIconEl !== undefined) {
            left += 6;
            this.prefixIconEl.style.left = left + "px";
            left += 24;
        }
        if(this.keybindEl !== undefined) {
            this.keybindEl.style.width = this.keybindWidth + "px";
            right += this.keybindWidth + TEXT_PADDING * 2;
            this.keybindEl.style.left = (width - right + TEXT_PADDING) + "px";
        }
        if(this.titleEl !== undefined) {
            left += TEXT_PADDING;
            this.titleEl.style.left = left + "px";
            this.titleEl.style.width = (width - right - left) + "px";
        }
    }

    public setTitle(text: string | null) {
        if(text === null) {
            if(this.titleEl !== undefined) {
                this.titleEl.remove();
                delete this.titleEl;
            }
        } else {
            if(this.titleEl === undefined) {
                this.titleEl = document.createElement("div");
                this.titleEl.classList.add("dropdownmenu-title");
                this.containerEl.appendChild(this.titleEl);
            }
            this.titleEl.textContent = text;
        }
    }

    public setKeybind(text: string | null) {
        if(text === null) {
            if(this.keybindEl !== undefined) {
                this.keybindEl.remove();
                delete this.keybindEl;
                this.keybindWidth = 0;
            }
        } else {
            if(this.keybindEl === undefined) {
                this.keybindEl = document.createElement("div");
                this.keybindEl.classList.add("dropdownmenu-keybind");
                this.containerEl.appendChild(this.keybindEl);
            }
            this.keybindEl.textContent = text;
        }
    }

    public setPrefixIcon(src: string | null) {
        if(src === null) {
            if(this.prefixIconEl !== undefined) {
                this.prefixIconEl.remove();
                delete this.prefixIconEl;
            }
        } else {
            let icon = this.prefixIconEl;
            if(icon === undefined) {
                icon = document.createElement("div");
                icon.classList.add("dropdownmenu-prefixicon");
                this.containerEl.appendChild(icon);
                this.prefixIconEl = icon;
            }
            fetch(src).then(res => res.text()).then(text => {
                icon.innerHTML = text;
                const svg = icon.querySelector("svg");
                if(svg !== null) {
                    svg.style.scale = this.prefixIconScale.toString();
                }
            });
        }
    }

    public setPrefixIconScale(scale: number) {
        this.prefixIconScale = scale;
        if(this.prefixIconEl === undefined)
            return;
        const svg = this.prefixIconEl.querySelector("svg");
        if(svg !== null) {
            svg.style.scale = this.prefixIconScale.toString();
        }
    }

    public updateStyleNeighboring(prev: ContextMenuChild | undefined, next: ContextMenuChild | undefined) {
        if(this.prefixIconEl !== undefined) {
            this.prefixIconEl.style.borderTopLeftRadius = prev?.constructor === CtxmButton ? "" : "6px";
            this.prefixIconEl.style.borderTopRightRadius = prev?.constructor === CtxmButton ? "" : "6px";
            this.prefixIconEl.style.borderBottomLeftRadius = next?.constructor === CtxmButton ? "" : "6px";
            this.prefixIconEl.style.borderBottomRightRadius = next?.constructor === CtxmButton ? "" : "6px";
        }
    }
}