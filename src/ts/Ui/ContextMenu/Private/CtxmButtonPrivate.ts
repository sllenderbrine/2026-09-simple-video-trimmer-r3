import { EventOwner, IntervalEvent, MathUtility } from "../../../Utility";
import { ContextMenu, ContextMenuChild } from "../Public/ContextMenu";
import { CtxmButton } from "../Public/CtxmButton";
import { ContextMenuPrivate } from "./ContextMenuPrivate";

const TEXT_PADDING = 12;

const privateMap = new WeakMap<CtxmButton, CtxmButtonPrivate>();

export class CtxmButtonPrivate {
    public containerEl: HTMLDivElement;
    public interactEl: HTMLButtonElement;
    public menu: ContextMenu;
    public titleContainerEl?: HTMLDivElement;
    public titleEl?: HTMLDivElement;
    public keybindEl?: HTMLDivElement;
    public prefixIconEl?: HTMLDivElement;
    public overflowReadUpdate?: IntervalEvent;
    public keybindWidth = 0;
    public targetWidth = 0;
    public prefixIconScale = 1;
    public textOverflow = false;
    public textOverflowX = 0;
    public textOverflowFlip = false;
    public textOverflowScrub = false;
    public width = 0;
    public eventOwner = new EventOwner();
    constructor(obj: CtxmButton, menu: ContextMenu) {
        privateMap.set(obj, this);
        this.menu = menu;

        this.containerEl = document.createElement("div");
        this.containerEl.classList.add("dropdownmenu-button");

        this.interactEl = document.createElement("button");
        this.interactEl.classList.add("dropdownmenu-buttoninteract");

        const menuPrivate = ContextMenuPrivate.get(menu)!;
        menuPrivate.contentEl.appendChild(this.containerEl);
        menuPrivate.interactEl.appendChild(this.interactEl);
        menuPrivate.children.push(obj);
        menuPrivate.updateLayout();

        let x = 0;
        let flip = false;
        let scrub = false;
        let titleRect = null;
        let scrubX = 0;
        let hoverX = 0;
        let scrubX2 = 0;
        let scrubX3 = 0;
        this.interactEl.addEventListener("mouseenter", e => {
            if(this.overflowReadUpdate === undefined && this.textOverflow) {
                const dt = 1 / 60;
                x = 0;
                flip = false;
                this.overflowReadUpdate = new IntervalEvent(() => {
                    if(this.titleEl !== undefined) {
                        if(this.textOverflow) {
                            titleRect = this.titleContainerEl!.getBoundingClientRect();
                            scrubX = (hoverX - titleRect.left) / titleRect.width;
                            if(scrubX >= 0 && scrubX <= 1) {
                                if(!scrub)
                                    scrubX3 = x;
                                const r = (this.titleEl.offsetWidth - this.titleContainerEl!.offsetWidth);
                                scrubX2 = MathUtility.clamp(-(scrubX * 1.4 - 0.2) * r, -r, 0);
                                scrubX3 = MathUtility.easeAnimation(scrubX3, scrubX2, dt * 15, dt * 60);
                                scrub = true;
                                this.titleEl.style.left = scrubX3 + "px";
                            } else {
                                scrub = false;
                            }
                        }
                        if(!scrub && this.textOverflow) {
                            if(flip) {
                                const cw = this.titleContainerEl!.offsetWidth;
                                const ml = this.titleEl.offsetWidth - cw;
                                x += ml * 4 * dt;
                                if(x > 0) {
                                    x = cw * 0.25;
                                    flip = !flip;
                                }
                                this.titleEl.style.left = MathUtility.clamp(x, -ml, 0) + "px";
                            } else {
                                const cw = this.titleContainerEl!.offsetWidth;
                                const ml = this.titleEl.offsetWidth - cw;
                                x -= 60 * dt;
                                if(x < -ml - cw * 0.25) {
                                    x = -ml - cw * 0.25;
                                    flip = !flip;
                                }
                                this.titleEl.style.left = MathUtility.clamp(x, -ml, 0) + "px";
                            }
                        }
                    }
                }, dt * 1000, this.eventOwner);
            }
        });

        this.interactEl.addEventListener("mouseleave", e => {
            if(this.overflowReadUpdate !== undefined) {
                this.overflowReadUpdate.disconnect();
                delete this.overflowReadUpdate;
                if(this.titleEl !== undefined) {
                    this.titleEl.style.left = "0px";
                }
            }
        });

        this.interactEl.addEventListener("mousemove", e => {
            hoverX = e.clientX;
        });
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
            this.targetWidth += this.titleEl.offsetWidth + TEXT_PADDING * 2;
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
        this.interactEl.style.top = top + "px";
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
        if(this.keybindEl === undefined) {
            right += 12;
        }
        if(this.titleEl !== undefined) {
            left += TEXT_PADDING;
            this.titleContainerEl!.style.left = left + "px";
            this.titleContainerEl!.style.width = (width - right - left) + "px";
            this.textOverflow = this.titleEl.offsetWidth > this.titleContainerEl!.offsetWidth;
        } else {
            this.textOverflow = false;
        }
        this.interactEl.style.width = (width - 12 + (this.menu.hasScrollbar ? -2 : 0)) + "px";
        this.interactEl.style.left = 6 + "px";
    }

    public setTitle(text: string | null) {
        if(text === null) {
            if(this.titleEl !== undefined) {
                this.titleContainerEl!.remove();
                this.titleEl.remove();
                delete this.titleContainerEl;
                delete this.titleEl;
            }
        } else {
            if(this.titleEl === undefined) {
                this.titleContainerEl = document.createElement("div");
                this.titleContainerEl.classList.add("dropdownmenu-titlecontainer");
                this.containerEl.appendChild(this.titleContainerEl);

                this.titleEl = document.createElement("div");
                this.titleEl.classList.add("dropdownmenu-title");
                this.titleContainerEl.appendChild(this.titleEl);
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
        this.interactEl.style.borderTopLeftRadius = prev?.constructor === CtxmButton ? "" : "6px";
        this.interactEl.style.borderTopRightRadius = prev?.constructor === CtxmButton ? "" : "6px";
        this.interactEl.style.borderBottomLeftRadius = next?.constructor === CtxmButton ? "" : "6px";
        this.interactEl.style.borderBottomRightRadius = next?.constructor === CtxmButton ? "" : "6px";
    }
}