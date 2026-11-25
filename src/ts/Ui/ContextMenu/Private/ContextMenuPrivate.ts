import { MathUtility } from "../../../Utility/MathUtility";
import { ContextMenu, ContextMenuChild } from "../Public/ContextMenu";
import { CtxmButton } from "../Public/CtxmButton";
import { CtxmDivider } from "../Public/CtxmDivider";
import { CtxmButtonPrivate } from "./CtxmButtonPrivate";
import { CtxmDividerPrivate } from "./CtxmDividerPrivate";

const privateMap = new WeakMap<any, ContextMenuPrivate>();

export function getCtxmChildPrivate(child: ContextMenuChild) {
    switch(child.constructor) {
        case CtxmDivider:
            return CtxmDividerPrivate.get(child);
        case CtxmButton:
            return CtxmButtonPrivate.get(child);
    }
}

export class ContextMenuPrivate {
    public public: ContextMenu;
    public children: ContextMenuChild[] = [];
    public width = 0;
    public height = 0;
    public targetWidth = 0;
    public targetHeight = 0;
    public x = 0;
    public y = 0;
    public minWidth = 0;
    public minHeight = 0;
    public maxWidth = 300;
    public maxHeight = 300;
    public offscreenOffsetX = 0;
    public offscreenOffsetY = 0;
    public dodgedRightEdge = false;
    public dodgedBottomEdge = false;
    public containerEl: HTMLDivElement;
    public contentEl: HTMLDivElement;
    constructor(
        obj: ContextMenu,
    ) {
        privateMap.set(obj, this);
        this.public = obj;
    
        this.containerEl = document.createElement("div");
        this.containerEl.classList.add("dropdownmenu");
        document.body.appendChild(this.containerEl);

        this.contentEl = document.createElement("div");
        this.contentEl.classList.add("dropdownmenu-content");
        this.containerEl.appendChild(this.contentEl);
    }

    public static get(obj: any) {
        return privateMap.get(obj);
    }

    public updateLayout() {
        let width = 0;
        let top = 0;
        for(const child of this.children) {
            const priv = getCtxmChildPrivate(child)!;
            if(child.constructor === CtxmButton) {
                let w = (priv as CtxmButtonPrivate).getTargetWidth();
                if(w > width)
                    width = w;
                priv.setTop(top);
                top += 24;
            } else if(child.constructor === CtxmDivider) {
                priv.setTop(top + 4);
                top += 9;
            }
        }
        this.targetWidth = width;
        this.targetHeight = top;
        this.width = MathUtility.clamp(width, this.minWidth, this.maxWidth);
        this.containerEl.style.width = this.width + "px";
        this.height = MathUtility.clamp(top, this.minHeight, this.maxHeight);
        this.containerEl.style.height = this.height + "px";
        for(const child of this.children) {
            const priv = getCtxmChildPrivate(child)!;
            priv.setWidth(this.width);
        }
    }

    public updateScreenPositionX() {
        if(this.x + this.width > window.innerWidth) {
            this.containerEl.style.left = (this.x - this.width + this.offscreenOffsetX) + "px";
            this.dodgedRightEdge = true;
        } else {
            this.containerEl.style.left = this.x + "px";
            this.dodgedRightEdge = false;
        }
    }

    public updateScreenPositionY() {
        if(this.y + this.height > window.innerHeight) {
            this.containerEl.style.top = (this.y - this.height + this.offscreenOffsetY) + "px";
            this.dodgedBottomEdge = true;
        } else {
            this.containerEl.style.top = this.y + "px";
            this.dodgedBottomEdge = false;
        }
    }
}