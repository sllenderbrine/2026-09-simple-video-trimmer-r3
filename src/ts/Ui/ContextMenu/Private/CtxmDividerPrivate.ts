import { ContextMenu } from "../ContextMenu";
import { CtxmDivider } from "../CtxmDivider";
import { ContextMenuPrivate } from "./ContextMenuPrivate";
import { CtxmItemLayoutPrivate } from "./CtxmItemLayoutPrivate";

const privateMap = new WeakMap<any, CtxmDividerPrivate>();

export class CtxmDividerPrivate {
    public containerEl: HTMLDivElement;
    public layout: CtxmItemLayoutPrivate;
    constructor(obj: CtxmDivider, menu: ContextMenu) {
        this.containerEl = document.createElement("div");
        this.containerEl.classList.add("dropdownmenu-divider");
        ContextMenuPrivate.get(menu)!.contentEl.appendChild(this.containerEl);

        this.layout = new CtxmItemLayoutPrivate(obj);
        this.layout.height = 1;
        this.layout.marginTop = 4;
        this.layout.marginBottom = 4;
        this.layout.top.handle(v => {
            this.containerEl.style.top = v + "px";
            console.log(v);
        }, null);

        privateMap.set(obj, this);
    }

    public static get(obj: any) {
        return privateMap.get(obj);
    }
}