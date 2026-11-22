import { Signal } from "../../../Utility/Events";
import { ContextMenu } from "../ContextMenu";
import { CtxmDivider } from "../CtxmDivider";

const privateMap = new WeakMap<any, ContextMenuPrivate>();

export type ContextMenuChild = CtxmDivider;

export class ContextMenuPrivate {
    public public: ContextMenu;
    public updateContentWidth = new Signal<[]>();
    public updateContentHeight = new Signal<[]>();
    public children: ContextMenuChild[] = [];
    public containerEl: HTMLDivElement;
    public contentEl: HTMLDivElement;
    constructor(
        obj: ContextMenu,
    ) {
        this.public = obj;
    
        this.containerEl = document.createElement("div");
        this.containerEl.classList.add("dropdownmenu");
        document.body.appendChild(this.containerEl);

        this.contentEl = document.createElement("div");
        this.contentEl.classList.add("dropdownmenu-content");
        this.containerEl.appendChild(this.contentEl);
        
        privateMap.set(obj, this);
    }

    public static get(obj: any) {
        return privateMap.get(obj);
    }
}