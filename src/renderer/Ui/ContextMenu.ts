import { ConnectionOwner } from "../../shared/EventSignals/ConnectionOwner.js";
import { HtmlConnection } from "../../shared/EventSignals/HtmlConnection.js";
import { Signal } from "../../shared/EventSignals/Signal.js";
import { joinPaths } from "../../shared/Utility/FilePathUtility.js";
import { clipEllipses, clipStartEllipses } from "../../shared/Utility/StringUtility.js";

const PATH_RESOURCES = "..";
const PATH_ICONS = joinPaths(PATH_RESOURCES, "icons");

export type ContextMenuLayout = {
    title: string,
    keybind?: string,
    tooltip?: string,
    disabled?: boolean,
    icon?: string,
    iconScale?: number,
    data?: any,
    children?: ContextMenuLayout[],
    separator?: boolean,
    danger?: boolean,
    dangerSeparator?: boolean,
    textAlign?: ContextMenuTextAlign,
};

export class ContextMenuClickOffEvent {
    contextMenu?: ContextMenu;
    target?: EventTarget;
    constructor() {
        
    }

    clone() {
        return new ContextMenuClickOffEvent().copy(this) as this;
    }
    
    copy(other: ContextMenuClickOffEvent) {
        this.contextMenu = other.contextMenu;
        this.target = other.target;
        return this;
    }
}

export enum ContextMenuTextAlign {
    LEFT = 0,
    CENTER = 1,
    RIGHT = 2,
}

export class ContextMenuButton {
    containerEl: HTMLDivElement;
    buttonEl: HTMLButtonElement;
    titleEl: HTMLDivElement;
    keybindEl?: HTMLDivElement;
    prefixIconEl?: HTMLDivElement;
    suffixIconEl?: HTMLDivElement;
    childrenLayout?: ContextMenuLayout[];
    childContextMenu?: ContextMenu;
    data?: any;
    disabled: boolean = false;
    textAlign = ContextMenuTextAlign.LEFT;
    connectionOwner: ConnectionOwner = new ConnectionOwner();
    constructor(
        public contextMenu: ContextMenu,
    ) {
        this.containerEl = document.createElement("div");
        this.containerEl.classList.add("ctxm-button-container");
        this.buttonEl = document.createElement("button");
        this.containerEl.appendChild(this.buttonEl);
        this.buttonEl.classList.add("ctxm-button");
        this.buttonEl.addEventListener("click", () => {
            this.buttonEl.blur();
        });

        this.titleEl = document.createElement("div");
        this.containerEl.appendChild(this.titleEl);
        this.titleEl.classList.add("ctxm-title");
    }

    setTitle(title: string) {
        let nameClip = this.textAlign == ContextMenuTextAlign.RIGHT ? clipStartEllipses(title, 32) : clipEllipses(title, 32);
        this.titleEl.textContent = nameClip;
    }

    setTooltip(tooltip?: string | null) {
        this.buttonEl.title = tooltip ?? "";
    }

    setKeybind(keybind?: string | null) {
        if(keybind == null && this.keybindEl != null) {
            this.keybindEl.remove();
            delete this.keybindEl;
        } else if(keybind != null && this.keybindEl == null) {
            this.keybindEl = document.createElement("div");
            this.titleEl.after(this.keybindEl);
            this.keybindEl.classList.add("ctxm-keybind");
            let keybindClip = clipStartEllipses(keybind, 32);
            this.keybindEl.textContent = keybindClip;
        } else if(keybind != null && this.keybindEl != null) {
            let keybindClip = clipStartEllipses(keybind, 32);
            this.keybindEl.textContent = keybindClip;
        }
    }

    addIconMargin() {
        if(this.prefixIconEl != null)
            return;
        this.prefixIconEl = document.createElement("div");
        this.titleEl.before(this.prefixIconEl);
        this.prefixIconEl.classList.add("ctxm-prefix-icon");
        this.prefixIconEl.style.opacity = this.disabled ? "0.5" : "1";
    }

    removeIconMargin() {
        if(this.prefixIconEl == null)
            return;
        this.prefixIconEl.remove();
        delete this.prefixIconEl;
    }

    setIcon(icon?: string | null, iconScale?: number | null) {
        this.addIconMargin();
        this.prefixIconEl!.innerHTML = "";
        if(icon == null)
            return;
        const iconContainer = document.createElement("div");
        this.prefixIconEl!.appendChild(iconContainer);
        iconContainer.classList.add("ctxm-icon");
        fetch(joinPaths(PATH_ICONS, icon + ".svg")).then(res => res.text()).then(inner => {
            iconContainer.innerHTML = inner;
            iconContainer.style.scale = `${iconScale ?? 1}`;
        });
    }

    setChildrenLayout(childrenLayout?: ContextMenuLayout[] | null) {
        if(childrenLayout == null) {
            if(this.suffixIconEl != null) {
                this.suffixIconEl.remove();
                delete this.suffixIconEl;
            }
            delete this.childrenLayout;
            return;
        }
        if(this.suffixIconEl == null) {
            this.suffixIconEl = document.createElement("div");
            (this.keybindEl ?? this.titleEl).after(this.suffixIconEl)
            this.suffixIconEl.classList.add("ctxm-suffix-icon");
            this.suffixIconEl.style.rotate = "90deg";
            this.suffixIconEl.style.opacity = this.disabled ? "0.5" : "1";
        }
        this.suffixIconEl.innerHTML = "";
        const iconContainer = document.createElement("div");
        this.suffixIconEl!.appendChild(iconContainer);
        iconContainer.classList.add("ctxm-icon");
        iconContainer.style.scale = "0.7";
        this.childrenLayout = childrenLayout;
        fetch(joinPaths(PATH_ICONS, "triangle-fill.svg")).then(res => res.text()).then(inner => {
            iconContainer.innerHTML = inner;
        });
    }

    setDisabled(v: boolean) {
        this.disabled = v;
        
        this.buttonEl.style.display = this.disabled ? "none" : "block";
        this.containerEl.style.pointerEvents = this.disabled ? "none" : "auto";
        this.titleEl.style.opacity = this.disabled ? "0.5" : "1";

        if(this.suffixIconEl != null) {
            this.suffixIconEl.style.opacity = this.disabled ? "0.5" : "1";
        }

        if(this.prefixIconEl != null) {
            this.prefixIconEl.style.opacity = this.disabled ? "0.5" : "1";
        }
    }
}

export class ContextMenu {
    containerEl: HTMLDivElement;
    buttons: ContextMenuButton[] = [];
    childrenMenus: ContextMenu[] = [];
    elementToButton: Map<EventTarget, ContextMenuButton> = new Map();
    buttonClickEvent: Signal<[btn: ContextMenuButton]> = new Signal();
    clickOffEvent: Signal<[e: ContextMenuClickOffEvent]> = new Signal();
    removeEvent: Signal<[]> = new Signal();
    connectionOwner: ConnectionOwner = new ConnectionOwner();
    constructor(public parent: ContextMenu | null, x: number, y: number) {
        this.containerEl = document.createElement("div");
        document.body.appendChild(this.containerEl);
        this.containerEl.classList.add("ctxm-container");
        this.containerEl.style.left = x + "px";
        this.containerEl.style.top = y + "px";
        new HtmlConnection(window, "mousemove", (e: MouseEvent) => {
            if(e.target != null) {
                const btn = this.elementToButton.get(e.target);
                if(btn != null) {
                    if(btn.childContextMenu != null)
                        return;
                    for(const menu of this.childrenMenus) {
                        menu.remove();
                    }
                    this.childrenMenus = [];
                    if(btn.childrenLayout) {
                        const rect = btn.buttonEl.getBoundingClientRect();
                        const menu = new ContextMenu(this, rect.left + rect.width, rect.top);
                        menu.addLayout(btn.childrenLayout);
                        menu.containerEl.style.borderTopLeftRadius = "0px";
                        const rect2 = this.containerEl.getBoundingClientRect();
                        const rect3 = menu.containerEl.getBoundingClientRect();
                        if(rect3.top + rect3.height < rect2.top + rect2.height - 8) {
                            menu.containerEl.style.borderBottomLeftRadius = "0px";
                        }
                        menu.buttonClickEvent.connect((...args) => {
                            this.buttonClickEvent.fire(...args);
                        }, { owners: [ this.connectionOwner ] });
                        menu.clickOffEvent.connect((e) => {
                            if(e.target == btn.buttonEl)
                                return;
                            menu.remove();
                        }, { owners: [ this.connectionOwner ] });
                        menu.removeEvent.connect(() => {
                            if(btn.childContextMenu == menu) {
                                delete btn.childContextMenu;
                            }
                            const index = this.childrenMenus.indexOf(menu);
                            if(index !== -1) {
                                this.childrenMenus.splice(index, 1);
                            }
                        }, { owners: [ this.connectionOwner ] });
                        btn.childContextMenu = menu;
                        this.childrenMenus.push(menu);
                    }
                    return;
                }
            }
        }, { owners: [ this.connectionOwner ] });
        new HtmlConnection(window, "mousedown", (e: MouseEvent) => {
            if(e.target != null) {
                const btn = this.elementToButton.get(e.target);
                if(btn != null) {
                    this.buttonClickEvent.fire(btn);
                    return;
                }
            }
            if(this.isMouseTarget(e))
                return;
            const e2 = new ContextMenuClickOffEvent();
            e2.contextMenu = this;
            e2.target = e.target ?? undefined;
            this.clickOffEvent.fire(e2);
        }, { owners: [ this.connectionOwner ] });
    }
    
    addLayout(layout: ContextMenuLayout[]): this {
        for(const itemLayout of layout) {
            const item = new ContextMenuButton(this);
            item.setTitle(itemLayout.title);
            item.setDisabled(itemLayout.disabled ?? false);
            item.setTooltip(itemLayout.tooltip);
            item.setKeybind(itemLayout.keybind);
            item.setIcon(itemLayout.icon, itemLayout.iconScale);
            item.setChildrenLayout(itemLayout.children);
            item.data = itemLayout.data;
            if(itemLayout.textAlign == ContextMenuTextAlign.RIGHT) {
                item.titleEl.style.marginLeft = "auto";
                item.titleEl.style.marginRight = "0px";
            } else if(itemLayout.textAlign == ContextMenuTextAlign.CENTER) {
                item.titleEl.style.marginLeft = "auto";
            }
            if(itemLayout.danger) {
                item.titleEl.style.color = "rgb(216, 129, 141)";
                if(item.prefixIconEl) {
                    item.prefixIconEl.style.color = "rgb(185, 103, 114)";
                }
                item.containerEl.classList.add("ctxm-container-danger");
            }
            this.containerEl.appendChild(item.containerEl);
            this.buttons.push(item);
            this.elementToButton.set(item.buttonEl, item);
            if(itemLayout.separator) {
                const separator = document.createElement("div");
                separator.classList.add("ctxm-separator");
                this.containerEl.appendChild(separator);
            }
            if(itemLayout.dangerSeparator) {
                const separator = document.createElement("div");
                separator.classList.add("ctxm-separator-danger");
                this.containerEl.appendChild(separator);
            }
        }
        return this;
    }

    isMouseTarget(e: MouseEvent): boolean {
        if(e.target == null)
            return false;
        if(e.target === this.containerEl)
            return true;
        const btn = this.elementToButton.get(e.target);
        if(btn != null)
            return true;
        for(const menu of this.childrenMenus) {
            if(menu.isMouseTarget(e))
                return true;
        }
        return false;
    }

    remove() {
        this.removeEvent.fire();
        for(const menu of this.childrenMenus) {
            menu.remove();
        }
        this.connectionOwner.disconnectAll();
        this.containerEl.remove();
    }
}