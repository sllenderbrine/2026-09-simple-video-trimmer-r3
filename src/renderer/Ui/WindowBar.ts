import { ConnectionOwner } from "../../shared/EventSignals/ConnectionOwner.js";
import { Signal } from "../../shared/EventSignals/Signal.js";
import { joinPaths } from "../../shared/Utility/FilePathUtility.js";
import { ContextMenu } from "./ContextMenu.js";
import { ContextMenuLayout } from "./ContextMenu.js";
import { ContextMenuButton } from "./ContextMenu.js";

const PATH_RESOURCES = "..";
const PATH_ICONS = joinPaths(PATH_RESOURCES, "icons");

export class WindowBarButton {
    containerEl: HTMLDivElement;
    buttonEl: HTMLButtonElement;
    titleEl: HTMLDivElement;
    childContextMenu?: ContextMenu;
    connectionOwner: ConnectionOwner = new ConnectionOwner();
    constructor(
        public parent: WindowBar,
        title: string | null,
        icon: string | null,
        public getContextMenuLayout: (() => ContextMenuLayout[]) | null,
        public onClick: ((btnEl: HTMLButtonElement) => void) | null,
        danger: boolean = false,
        overrideSize: number | null = null,
        overrideWidth: number | null = null,
    ) {
        this.containerEl = document.createElement("div");
        this.containerEl.classList.add("wbar-button-container");
        if(danger) {
            this.containerEl.classList.add("wbar-button-danger");
        }
        this.buttonEl = document.createElement("button");
        this.containerEl.appendChild(this.buttonEl);
        this.buttonEl.classList.add("wbar-button");
        this.titleEl = document.createElement("div");
        this.containerEl.appendChild(this.titleEl);
        this.titleEl.classList.add("wbar-title");
        if(title != null) {
            this.setTitle(title, overrideSize, overrideWidth);
        }
        if(icon != null) {
            this.setIcon(icon, overrideSize, overrideWidth);
        }
        if(onClick || getContextMenuLayout) {
            this.buttonEl.addEventListener("click", e => {
                this.buttonEl.blur();
                if(onClick) {
                    onClick(this.buttonEl);
                }
                this.parent.buttonClickEvent.fire(this);
                if(this.childContextMenu) {
                    this.childContextMenu.remove();
                    delete this.childContextMenu;
                } else if(getContextMenuLayout) {
                    const rect = this.containerEl.getBoundingClientRect();
                    const layout = getContextMenuLayout();
                    const menu = new ContextMenu(null, rect.left, rect.top + rect.height);
                    menu.addLayout(layout);
                    parent.contextMenus.push(menu);
                    this.childContextMenu = menu;
                    menu.buttonClickEvent.connect((btn) => {
                        parent.menuButtonClickEvent.fire(btn, this);
                    }, { owners: [ parent.connectionOwner, menu.connectionOwner, this.connectionOwner ] });
                    menu.clickOffEvent.connect((e) => {
                        if(e.target == this.buttonEl)
                            return;
                        if(e.target && this.parent.elementToButton.get(e.target))
                            return;
                        menu.remove();
                    }, { owners: [ parent.connectionOwner, menu.connectionOwner, this.connectionOwner ] });
                    menu.removeEvent.connect(() => {
                        if(this.childContextMenu == menu) {
                            delete this.childContextMenu;
                        }
                        const index = parent.contextMenus.indexOf(menu);
                        if(index !== -1) {
                            parent.contextMenus.splice(index, 1);
                        }
                    }, { owners: [ parent.connectionOwner, menu.connectionOwner, this.connectionOwner ] });
                    this.parent.buttonClickEvent.connect(btn => {
                        if(btn == this)
                            return;
                        menu.remove();
                    }, { owners: [ parent.connectionOwner, menu.connectionOwner, this.connectionOwner ] });
                }
            });
        }
    }
    
    setTitle(title: string, overrideSize: number | null, overrideWidth: number | null) {
        this.titleEl.innerHTML = "";
        this.titleEl.textContent = title;
        if(overrideSize != null) {
            this.titleEl.style.fontSize = overrideSize + "px";
        } else {
            this.titleEl.style.fontSize = "";
        }
        if(overrideWidth != null) {
            this.titleEl.style.width = overrideWidth + "px";
        } else {
            this.titleEl.style.width = "";
        }
    }

    setIcon(icon: string, overrideSize: number | null, overrideWidth: number | null) {
        this.titleEl.innerHTML = "";
        const iconContainer = document.createElement("div");
        this.titleEl.appendChild(iconContainer);
        iconContainer.classList.add("wbar-icon");
        fetch(joinPaths(PATH_ICONS, icon + ".svg")).then(res => res.text()).then(inner => {
            iconContainer.innerHTML = inner;
        });
        if(overrideSize != null) {
            iconContainer.style.width = overrideSize + "px";
            iconContainer.style.height = overrideSize + "px";
        }
        if(overrideWidth != null) {
            this.titleEl.style.width = overrideWidth + "px";
        } else {
            this.titleEl.style.width = "";
        }
    }
}

export enum WindowBarSide {
    LEFT = 0,
    RIGHT = 1,
};

export class WindowBar {
    containerEl: HTMLDivElement;
    leftContentEl: HTMLDivElement;
    rightContentEl: HTMLDivElement;
    buttons: WindowBarButton[] = [];
    contextMenus: ContextMenu[] = [];
    elementToButton: Map<EventTarget, WindowBarButton> = new Map();
    closeFunc: (btnEl: HTMLButtonElement) => void;
    maximizeFunc: (btnEl: HTMLButtonElement) => void;
    minimizeFunc: (btnEl: HTMLButtonElement) => void;
    menuButtonClickEvent: Signal<[ctxbtn: ContextMenuButton, wbtn: WindowBarButton]> = new Signal();
    buttonClickEvent: Signal<[btn: WindowBarButton]> = new Signal();
    connectionOwner: ConnectionOwner = new ConnectionOwner();
    constructor() {
        this.containerEl = document.createElement("div");
        this.containerEl.classList.add("wbar-container");
        document.body.appendChild(this.containerEl);

        this.leftContentEl = document.createElement("div");
        this.leftContentEl.classList.add("wbar-left");
        this.containerEl.appendChild(this.leftContentEl);

        this.rightContentEl = document.createElement("div");
        this.rightContentEl.classList.add("wbar-right");
        this.containerEl.appendChild(this.rightContentEl);

        this.closeFunc = () => {
            window.windowApi.close();
        }

        this.maximizeFunc = () => {
            window.windowApi.maximize();
        }

        this.minimizeFunc = () => {
            window.windowApi.minimize();
        }

        this.addIconButton("cross", null, (btn) => {
            this.closeFunc(btn);
        }, WindowBarSide.RIGHT, true, 24, 22);

        this.addIconButton("maximize", null, (btn) => {
            this.maximizeFunc(btn);
        }, WindowBarSide.RIGHT, false, 22, 22);

        this.addIconButton("dash", null, (btn) => {
            this.minimizeFunc(btn);
        }, WindowBarSide.RIGHT, false, 24, 22);
    }

    addTextButton(
        title: string,
        getContextMenuLayout: (() => ContextMenuLayout[]) | null,
        onClick: ((btnEl: HTMLButtonElement) => void) | null,
        side: WindowBarSide,
        danger: boolean = false,
        overrideSize: number | null = null,
        overrideWidth: number | null = null,
    ) {
        const btn = new WindowBarButton(
            this,
            title,
            null,
            getContextMenuLayout,
            onClick,
            danger,
            overrideSize,
            overrideWidth,
        );
        if(side == WindowBarSide.LEFT) {
            this.leftContentEl.appendChild(btn.containerEl);
        } else if(side == WindowBarSide.RIGHT) {
            this.rightContentEl.appendChild(btn.containerEl);
        }
        this.buttons.push(btn);
        this.elementToButton.set(btn.buttonEl, btn);
        return btn;
    }
    
    addIconButton(
        icon: string,
        getContextMenuLayout: (() => ContextMenuLayout[]) | null,
        onClick: ((btnEl: HTMLButtonElement) => void) | null,
        side: WindowBarSide,
        danger: boolean = false,
        overrideSize: number | null = null,
        overrideWidth: number | null = null,
    ) {
        const btn = new WindowBarButton(
            this,
            null,
            icon,
            getContextMenuLayout,
            onClick,
            danger,
            overrideSize,
            overrideWidth,
        );
        if(side == WindowBarSide.LEFT) {
            this.leftContentEl.appendChild(btn.containerEl);
        } else if(side == WindowBarSide.RIGHT) {
            this.rightContentEl.appendChild(btn.containerEl);
        }
        this.buttons.push(btn);
        this.elementToButton.set(btn.containerEl, btn);
        return btn;
    }
}