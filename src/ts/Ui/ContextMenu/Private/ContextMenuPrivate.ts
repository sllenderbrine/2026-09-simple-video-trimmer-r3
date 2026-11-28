import { EventOwner, HtmlListener, MathUtility } from "../../../Utility";
import { ContextMenu, ContextMenuChild } from "../Public/ContextMenu";
import { CtxmButton } from "../Public/CtxmButton";
import { CtxmDivider } from "../Public/CtxmDivider";
import { CtxmButtonPrivate } from "./CtxmButtonPrivate";
import { CtxmDividerPrivate } from "./CtxmDividerPrivate";

const HEIGHT_PADDING = 6;

const privateMap = new WeakMap<ContextMenu, ContextMenuPrivate>();

export function getCtxmChildPrivate(child: ContextMenuChild) {
    switch(child.constructor) {
        case CtxmDivider:
            return CtxmDividerPrivate.get(child as CtxmDivider);
        case CtxmButton:
            return CtxmButtonPrivate.get(child as CtxmButton);
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
    public left = 0;
    public top = 0;
    public minWidth = 0;
    public minHeight = 0;
    public maxWidth = 300;
    public maxHeight = 300;
    public offscreenOffsetX = 0;
    public offscreenOffsetY = 0;
    public dodgedRightEdge = false;
    public dodgedBottomEdge = false;
    public hasScrollbar = false;
    public scrollbarHidden = false;
    public scrollbarScrub = false;
    public eventOwner = new EventOwner();
    public scrollbarEvents = new EventOwner();
    public containerEl: HTMLDivElement;
    public backgroundContainerEl: HTMLDivElement;
    public backgroundEl: HTMLDivElement;
    public overlayEl: HTMLDivElement;
    public contentScrollEl: HTMLDivElement;
    public contentEl: HTMLDivElement;
    public interactScrollEl: HTMLDivElement;
    public interactEl: HTMLDivElement;
    public scrollbarEl?: HTMLDivElement;
    public scrollbarInteractEl?: HTMLDivElement;
    public headerEl?: HTMLDivElement;
    constructor(
        obj: ContextMenu,
    ) {
        privateMap.set(obj, this);
        this.public = obj;
    
        this.containerEl = document.createElement("div");
        this.containerEl.classList.add("dropdownmenu");
        this.containerEl.setAttribute("data-scrollbar-visible", "false");
        this.containerEl.setAttribute("data-scrollbar-hover", "false");
        this.containerEl.setAttribute("data-header-position", "bottom");
        document.body.appendChild(this.containerEl);
    
        this.backgroundContainerEl = document.createElement("div");
        this.backgroundContainerEl.classList.add("dropdownmenu-backgroundcontainer");
        this.containerEl.appendChild(this.backgroundContainerEl);
    
        this.backgroundEl = document.createElement("div");
        this.backgroundEl.classList.add("dropdownmenu-background");
        this.backgroundContainerEl.appendChild(this.backgroundEl);

        this.contentScrollEl = document.createElement("div");
        this.contentScrollEl.classList.add("dropdownmenu-contentscroll");
        this.containerEl.appendChild(this.contentScrollEl);

        this.contentEl = document.createElement("div");
        this.contentEl.classList.add("dropdownmenu-content");
        this.contentScrollEl.appendChild(this.contentEl);

        this.interactScrollEl = document.createElement("div");
        this.interactScrollEl.classList.add("dropdownmenu-interactscroll");
        this.containerEl.appendChild(this.interactScrollEl);

        this.interactEl = document.createElement("div");
        this.interactEl.classList.add("dropdownmenu-interact");
        this.interactScrollEl.appendChild(this.interactEl);
    
        this.overlayEl = document.createElement("div");
        this.overlayEl.classList.add("dropdownmenu-overlay");
        this.containerEl.appendChild(this.overlayEl);

        this.interactScrollEl.addEventListener("wheel", e => {
            if(this.scrollbarScrub)
                e.preventDefault();
        });

        this.interactScrollEl.addEventListener("scroll", () => {
            this.updateContentScrollTop();
        });

        this.containerEl.addEventListener("mouseenter", () => {
            this.scrollbarHidden = false;
            this.containerEl.setAttribute("data-scrollbar-visible", "true");
        });

        this.containerEl.addEventListener("mouseleave", () => {
            this.scrollbarHidden = true;
            this.containerEl.setAttribute("data-scrollbar-visible", "false");
        });
    }

    public static get(obj: ContextMenu) {
        return privateMap.get(obj);
    }

    public updateContentScrollTop() {
        this.contentScrollEl.scrollTop = this.interactScrollEl.scrollTop;
        if(this.scrollbarEl !== undefined) {
            const t = (this.contentEl.offsetHeight - this.contentScrollEl.offsetHeight);
            let sh = this.contentScrollEl.offsetHeight - 12;
            sh -= 0.5 * Math.min(t, 200);
            sh -= 0.05 * Math.max(t - 200, 0);
            sh = Math.max(sh, 24);
            this.scrollbarEl.style.height = sh + "px";
            this.scrollbarInteractEl!.style.height = sh + "px";
            let th = this.contentScrollEl.offsetHeight - this.scrollbarEl.offsetHeight - 13;
            this.scrollbarEl.style.top = (6 + this.contentScrollEl.scrollTop / t * th) + "px";
            this.scrollbarInteractEl!.style.top = (6 + this.contentScrollEl.scrollTop / t * th + this.interactScrollEl.scrollTop) + "px";
        }
    }

    public updateLayout() {
        let maxKw = 0;
        let widthKw = 0;
        let width = 0;
        let top = HEIGHT_PADDING;
        for(const child of this.children) {
            const priv = getCtxmChildPrivate(child)!;
            if(child.constructor === CtxmButton) {
                const priv2 = priv as CtxmButtonPrivate;
                priv2.updateTargetWidth();
                let w = priv2.targetWidth;
                let kw = priv2.keybindWidth;
                if(w > width) {
                    width = w;
                    widthKw = kw;
                }
                if(kw > maxKw)
                    maxKw = kw;
                priv.setTop(top);
                top += 24;
            } else if(child.constructor === CtxmDivider) {
                priv.setTop(priv.titleEl === undefined ? top + 4 : top + 6);
                top += (priv.titleEl === undefined ? 8 : 12) + 1;
            }
        }
        width = width - widthKw + maxKw;
        top += HEIGHT_PADDING + 1;
        width += this.hasScrollbar ? 6 : 0
        this.targetWidth = width;
        this.targetHeight = top;
        this.hasScrollbar = top > this.maxHeight;
        this.width = MathUtility.clamp(width, this.minWidth, this.maxWidth);
        this.containerEl.style.width = this.width + "px";
        this.contentEl.style.width = this.width + "px";
        this.interactEl.style.width = this.width + "px";
        this.height = MathUtility.clamp(top, this.minHeight, this.maxHeight);
        this.containerEl.style.height = this.height + "px";
        this.contentEl.style.height = this.targetHeight + "px";
        this.interactEl.style.height = this.targetHeight + "px";
        this.children.forEach((child, i) => {
            const priv = getCtxmChildPrivate(child)!;
            priv.setWidth(this.width + (this.hasScrollbar ? -6 : 0));
            if(child.constructor === CtxmButton) {
                const priv2 = priv as CtxmButtonPrivate;
                priv2.updateStyleNeighboring(this.children[i - 1], this.children[i + 1]);
            }
        });
        if(this.hasScrollbar) {
            if(this.scrollbarEl === undefined) {
                this.scrollbarEl = document.createElement("div");
                this.scrollbarEl.classList.add("dropdownmenu-scrollbar");
                this.backgroundContainerEl.appendChild(this.scrollbarEl);
                
                this.scrollbarInteractEl = document.createElement("div");
                this.scrollbarInteractEl.classList.add("dropdownmenu-scrollbarinteract");
                this.interactScrollEl.appendChild(this.scrollbarInteractEl);

                let scrollbar = this.scrollbarEl;

                let evs = new EventOwner();
                let mdY = 0;
                let mdT = 0;
                let hover = false;
                new HtmlListener(this.scrollbarInteractEl, "mousedown", e => {
                    this.scrollbarScrub = true;
                    mdY = e.clientY;
                    mdT = this.interactScrollEl.scrollTop;
                    new HtmlListener(window, "mousemove", e => {
                        let dY = e.clientY - mdY;
                        let sbarH = scrollbar.offsetHeight;
                        let outerH = this.interactScrollEl.offsetHeight;
                        let innerH = this.interactEl.offsetHeight;
                        let dSy = dY / (outerH - sbarH - 13) * (innerH - outerH);
                        this.interactScrollEl.scrollTo({
                            top: mdT + dSy,
                            behavior: "instant",
                        })
                    }, this.scrollbarEvents, this.eventOwner, evs);
                    new HtmlListener(window, "mouseup", () => {
                        this.scrollbarScrub = false;
                        evs.cancelEventConnections();
                        this.containerEl.setAttribute("data-scrollbar-hover", hover.toString());
                    }, this.scrollbarEvents, this.eventOwner, evs);
                }, this.scrollbarEvents, this.eventOwner);
                new HtmlListener(this.scrollbarInteractEl, "mouseenter", () => {
                    hover = true;
                    this.containerEl.setAttribute("data-scrollbar-hover", "true");
                }, this.scrollbarEvents, this.eventOwner);
                new HtmlListener(this.scrollbarInteractEl, "mouseleave", () => {
                    hover = false;
                    if(!this.scrollbarScrub)
                        this.containerEl.setAttribute("data-scrollbar-hover", "false");
                }, this.scrollbarEvents, this.eventOwner);
            }
        } else {
            if(this.scrollbarEl !== undefined) {
                this.scrollbarEl.remove();
                this.scrollbarInteractEl!.remove();
                delete this.scrollbarEl;
                delete this.scrollbarInteractEl;
                this.scrollbarEvents.cancelEventConnections();
                this.scrollbarScrub = false;
            }
        }
        this.updateContentScrollTop();
    }

    public updateScreenPositionX() {
        if(this.x + this.width > window.innerWidth) {
            this.left = (this.x - this.width + this.offscreenOffsetX);
            this.containerEl.style.left = this.left + "px";
            this.dodgedRightEdge = true;
        } else {
            this.left = this.x;
            this.containerEl.style.left = this.left + "px";
            this.dodgedRightEdge = false;
        }
    }

    public updateScreenPositionY() {
        if(this.y + this.height > window.innerHeight) {
            this.top = (this.y - this.height + this.offscreenOffsetY);
            this.containerEl.style.top = this.top + "px";
            this.dodgedBottomEdge = true;
        } else {
            this.top = this.y;
            this.containerEl.style.top = this.top + "px";
            this.dodgedBottomEdge = false;
        }
        if(this.top > 22) {
            this.containerEl.setAttribute("data-header-position", "top");
        } else {
            this.containerEl.setAttribute("data-header-position", "bottom");
        }
    }

    public setHeader(text?: string | null) {
        if(text != null) {
            if(this.headerEl === undefined) {
                this.headerEl = document.createElement("div");
                this.headerEl.classList.add("dropdownmenu-header");
                this.containerEl.appendChild(this.headerEl);
            }
            this.headerEl.textContent = text;
        }
        if(text == null && this.headerEl !== undefined) {
            this.headerEl.remove();
            delete this.headerEl;
        }
    }
}