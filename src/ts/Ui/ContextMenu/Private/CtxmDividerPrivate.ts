import { ContextMenu } from "../Public/ContextMenu";
import { CtxmDivider } from "../Public/CtxmDivider";
import { ContextMenuPrivate } from "./ContextMenuPrivate";

const WIDTH_PADDING = 8;

const privateMap = new WeakMap<CtxmDivider, CtxmDividerPrivate>();

export class CtxmDividerPrivate {
    public containerEl: HTMLDivElement;
    public rightEl?: HTMLDivElement;
    public titleEl?: HTMLDivElement;
    public menu: ContextMenu;
    constructor(obj: CtxmDivider, menu: ContextMenu) {
        privateMap.set(obj, this);

        this.menu = menu;

        this.containerEl = document.createElement("div");
        this.containerEl.classList.add("dropdownmenu-divider");
        
        const menuPrivate = ContextMenuPrivate.get(menu)!;
        menuPrivate.contentEl.appendChild(this.containerEl);
        menuPrivate.children.push(obj);
        menuPrivate.updateLayout();
    }

    public static get(obj: CtxmDivider) {
        return privateMap.get(obj);
    }

    public setTop(top: number) {
        this.containerEl.style.top = top + "px";
        if(this.titleEl !== undefined) {
            this.titleEl.style.top = (top - 8) + "px";
            this.rightEl!.style.top = top + "px";
        }
    }

    public setWidth(width: number) {
        if(this.titleEl !== undefined) {
            this.rightEl!.style.right = (8 + (this.menu.hasScrollbar ? 10 : 0)) + "px";
            this.containerEl.style.left = "8px";
            this.rightEl!.style.width = (width - this.titleEl.offsetWidth - 58 + (this.menu.hasScrollbar ? -10 : 0)) + "px";
            this.titleEl.style.left = 48 + "px"
            this.containerEl.style.width = 32 + "px";
        } else {
            this.containerEl.style.left = "8px";
            this.containerEl.style.width = (width - 16 + (this.menu.hasScrollbar ? -4 : 0)) + "px";
        }
    }

    public setTitle(text?: string | null) {
        if(text != null) {
            if(this.titleEl === undefined) {
                const menuPrivate = ContextMenuPrivate.get(this.menu)!;

                this.titleEl = document.createElement("div");
                this.titleEl.classList.add("dropdownmenu-dividertitle");
                menuPrivate.contentEl.appendChild(this.titleEl);

                this.rightEl = document.createElement("div");
                this.rightEl.classList.add("dropdownmenu-dividerright");
                menuPrivate.contentEl.appendChild(this.rightEl);
            }
            this.titleEl.textContent = text;
        }
        if(this.titleEl !== undefined && text == null) {
            this.titleEl.remove();
            this.rightEl!.remove();
            delete this.titleEl;
            delete this.rightEl;
        }
    }
}