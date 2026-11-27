import { ContextMenu } from "../Public/ContextMenu";
import { CtxmDivider } from "../Public/CtxmDivider";
import { ContextMenuPrivate } from "./ContextMenuPrivate";

const WIDTH_PADDING = 8;

const privateMap = new WeakMap<CtxmDivider, CtxmDividerPrivate>();

export class CtxmDividerPrivate {
    public containerEl: HTMLDivElement;
    public menu: ContextMenu;
    constructor(obj: CtxmDivider, menu: ContextMenu) {
        privateMap.set(obj, this);

        this.menu = menu;

        this.containerEl = document.createElement("div");
        this.containerEl.classList.add("dropdownmenu-divider");
        this.containerEl.style.left = WIDTH_PADDING + "px";
        
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
    }

    public setWidth(width: number) {
        this.containerEl.style.width = (width - WIDTH_PADDING * 2 + (this.menu.hasScrollbar ? -4 : 0)) + "px";
    }
}