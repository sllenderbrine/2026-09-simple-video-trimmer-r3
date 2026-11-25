import { ContextMenu } from "../Public/ContextMenu";
import { CtxmButton } from "../Public/CtxmButton";
import { ContextMenuPrivate } from "./ContextMenuPrivate";

const privateMap = new WeakMap<any, CtxmButtonPrivate>();

export class CtxmButtonPrivate {
    public containerEl: HTMLDivElement;
    public menu: ContextMenu;
    public titleEl?: HTMLDivElement;
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

    public static get(obj: any) {
        return privateMap.get(obj);
    }

    public getTargetWidth() {
        let w = 0;
        if(this.titleEl) {
            let s = this.titleEl.style.width;
            this.titleEl.style.width = "fit-content";
            w += this.titleEl.offsetWidth;
            this.titleEl.style.width = s;
        }
        return w;
    }

    public setTop(top: number) {
        this.containerEl.style.top = top + "px";
    }

    public setWidth(width: number) {
        this.width = width;
        this.containerEl.style.width = width + "px";
        let w = width;
        let left = 0;
        if(this.titleEl !== undefined) {
            this.titleEl.style.left = left + "px";
            this.titleEl.style.width = w + "px";
            left += w;
            w = 0;
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
}