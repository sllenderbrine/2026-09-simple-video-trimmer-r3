import { ContextMenu } from "../Public/ContextMenu";
import { CtxmDivider } from "../Public/CtxmDivider";
import { ContextMenuPrivate } from "./ContextMenuPrivate";

const privateMap = new WeakMap<any, CtxmDividerPrivate>();

export class CtxmDividerPrivate {
    public containerEl: HTMLDivElement;
    constructor(obj: CtxmDivider, menu: ContextMenu) {
        privateMap.set(obj, this);

        this.containerEl = document.createElement("div");
        this.containerEl.classList.add("dropdownmenu-divider");
        
        const menuPrivate = ContextMenuPrivate.get(menu)!;
        menuPrivate.contentEl.appendChild(this.containerEl);
        menuPrivate.children.push(obj);
        menuPrivate.updateLayout();
    }

    public static get(obj: any) {
        return privateMap.get(obj);
    }

    public setTop(top: number) {
        this.containerEl.style.top = top + "px";
    }

    public setWidth(width: number) {
        this.containerEl.style.width = width + "px";
    }
}