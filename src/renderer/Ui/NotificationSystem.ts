import { Color } from "../../shared/Color/Color.js";
import { ConnectionOwner } from "../../shared/EventSignals/ConnectionOwner.js";
import { HtmlConnection } from "../../shared/EventSignals/HtmlConnection.js";
import { ObservedValue } from "../../shared/EventSignals/ObservedValue.js";
import { Signal } from "../../shared/EventSignals/Signal.js";
import { get2dContext } from "../../shared/Utility/Canvas2dUtility.js";
import { joinPaths } from "../../shared/Utility/FilePathUtility.js";
import { clamp, lerp, lerpClamped, pmod, roundDecimals } from "../../shared/Utility/MathUtility.js";
import { Vec2 } from "../../shared/Vectors/Vec2.js";
import { ContextMenu } from "./ContextMenu.js";
import { WindowBar, WindowBarButton, WindowBarSide } from "./WindowBar.js";
import { renderEvent } from "./WindowGlobal/WindowEvents.js";

const PATH_RESOURCES = "..";
const PATH_ICONS = joinPaths(PATH_RESOURCES, "icons");

export class ActiveNotification {
    containerEl: HTMLDivElement;
    rowEl: HTMLDivElement;
    textContentEl: HTMLDivElement;
    titleEl: HTMLDivElement;
    iconEl: HTMLDivElement;
    descriptionEl: HTMLDivElement;
    closeButtonEl?: HTMLButtonElement;
    progressEl?: HTMLDivElement;
    progressValueEl?: HTMLDivElement;
    icon: string = "";
    iconType: NotificationIconType = NotificationIconType.NONE;
    iconColor: Color = Color.WHITE;
    timeout: number = -1;
    timeoutStart: number = -1;
    timeoutPaused: boolean = false;
    currentPosition: Vec2 = Vec2.zero();
    targetPosition: Vec2 = Vec2.zero();
    targetOffset: Vec2 = Vec2.zero();
    currentOpacity: number = 0;
    targetOpacity: number = 1;
    removed: boolean = false;
    removeEvent: Signal<[]> = new Signal();
    iconConnections: ConnectionOwner = new ConnectionOwner();
    connectionOwner: ConnectionOwner = new ConnectionOwner();
    constructor(public parent: NotificationSystem) {
        this.containerEl = document.createElement("div");
        this.containerEl.classList.add("ntf-container");

        this.rowEl = document.createElement("div");
        this.containerEl.appendChild(this.rowEl);
        this.rowEl.classList.add("ntf-container-row");

        this.iconEl = document.createElement("div");
        this.rowEl.appendChild(this.iconEl);
        this.iconEl.classList.add("ntf-icon-container");

        this.textContentEl = document.createElement("div");
        this.rowEl.appendChild(this.textContentEl);
        this.textContentEl.classList.add("ntf-text-content");

        this.titleEl = document.createElement("div");
        this.textContentEl.appendChild(this.titleEl);
        this.titleEl.classList.add("ntf-title");

        this.descriptionEl = document.createElement("div");
        this.textContentEl.appendChild(this.descriptionEl);
        this.descriptionEl.classList.add("ntf-description");

        new HtmlConnection(this.containerEl, "mouseenter", () => {
            this.timeoutPaused = true;
        }, { owners: [ this.connectionOwner, ], });
        
        new HtmlConnection(this.containerEl, "mouseleave", () => {
            this.timeoutPaused = false;
        }, { owners: [ this.connectionOwner, ], });

        const tempVec = Vec2.zero();
        renderEvent.connect(dt => {
            this.targetPosition.add(this.targetOffset, tempVec);
            this.currentPosition.lerpClampedSelf(tempVec, dt * 20);
            this.currentOpacity = lerpClamped(this.currentOpacity, this.targetOpacity, dt * 20);
            this.updateTransform();
            if(this.timeoutPaused)
                this.timeoutStart += dt * 1000;
            if(this.timeout >= 0) {
                let t = (performance.now() - this.timeoutStart) / 1000 / this.timeout;
                if(t > 1) {
                    this.remove();
                }
                this.setProgress(clamp(t, 0, 1));
            }
        }, { owners: [ this.connectionOwner, this.parent.connectionOwner ] });
    }

    setCloseButton(v: boolean) {
        if(v && this.closeButtonEl == null) {
            const btn = document.createElement("button");
            this.closeButtonEl = btn;
            this.containerEl.appendChild(this.closeButtonEl);
            this.closeButtonEl.classList.add("ntf-close-button");
            const iconContainer = document.createElement("div");
            iconContainer.style.width = "100%";
            iconContainer.style.height = "100%";
            iconContainer.style.scale = "1.1";
            btn.appendChild(iconContainer);
            fetch(joinPaths(PATH_ICONS, "cross.svg")).then(res => res.text()).then(text => {
                iconContainer.innerHTML = text;
            });
            btn.onclick = () => {
                this.remove();
            }
        } else if(!v && this.closeButtonEl != null) {
            this.closeButtonEl.remove();
            delete this.closeButtonEl;
        }
    }

    setProgress(v: number) {
        if(v == -1 && this.progressEl != null) {
            this.progressEl.remove();
            delete this.progressEl;
            delete this.progressValueEl;
            return;
        }
        if(this.progressEl == null) {
            this.progressEl = document.createElement("div");
            this.containerEl.appendChild(this.progressEl);
            this.progressEl.classList.add("ntf-progress");

            this.progressValueEl = document.createElement("div");
            this.progressEl.appendChild(this.progressValueEl);
            this.progressValueEl.classList.add("ntf-progress-value");
            let pvcol = this.iconColor.clone();
            pvcol.v += 40;
            pvcol.s -= 20;
            this.progressValueEl.style.backgroundColor = pvcol.toCss();
        }
        this.progressValueEl!.style.width = (v * 100) + "%";
    }

    setTitle(v: string) {
        this.titleEl.textContent = v;
    }

    setDescription(v: string) {
        this.descriptionEl.textContent = v;
    }

    addViewDetailsLink(el: HTMLDivElement) {
        const linkEl = document.createElement("span");
        this.descriptionEl.appendChild(linkEl);
        linkEl.classList.add("ntf-link");
        linkEl.textContent = " View details";
        linkEl.onclick = () => {
            this.parent.setDetailsVisible(true);
            this.parent.scrollToDetails(el);
        }
    }

    createIconContainer(scale: number = 1) {
        this.iconConnections.disconnectAll();
        this.iconEl.innerHTML = "";
        const iconContainer = document.createElement("div");
        this.iconEl.appendChild(iconContainer);
        iconContainer.classList.add("ntf-icon");
        this.iconEl.style.scale = scale + "";
        return iconContainer;
    }

    createCustomIconContainer(v: string, scale: number = 1) {
        const iconContainer = this.createIconContainer(scale);
        iconContainer.style.color = this.iconColor.toCss();
        fetch(joinPaths(PATH_ICONS, v + ".svg")).then(res => res.text()).then(text => {
            iconContainer.innerHTML = text;
        });
        return iconContainer;
    }

    setIconColor(color: Color) {
        this.iconColor = color;
        if(this.progressValueEl != null) {
            let pvcol = color.clone();
            pvcol.v += 40;
            pvcol.s -= 20;
            this.progressValueEl.style.backgroundColor = pvcol.toCss();
        }
        const container = this.iconEl.querySelector(".ntf-icon") as HTMLDivElement;
        if(container != null) {
            container.style.color = color.toCss();
        }
    }

    setIconType(v: NotificationIconType) {
        this.iconType = v;
        let iconContainer: HTMLDivElement;
        switch(v) {
            case NotificationIconType.CUSTOM:
                this.createCustomIconContainer(this.icon);
                break;
            case NotificationIconType.CHECK:
                this.setIconColor(Color.fromRgb(30, 165, 55));
                iconContainer = this.createCustomIconContainer("check-circle-fill", 1.3);
                iconContainer.style.scale = "0.5";
                setTimeout(() => {
                    iconContainer.style.scale = "1";
                    iconContainer.animate([
                        { scale: "0.5", },
                        { scale: "1", },
                    ], { duration: 500, easing: "cubic-bezier(0.68, -0.55, 0.27, 1.55)" });
                }, 100);
                break;
            case NotificationIconType.ERROR:
                this.setIconColor(Color.fromRgb(205, 30, 55));
                iconContainer = this.createCustomIconContainer("cross-circle-fill", 1.1);
                iconContainer.style.scale = "0.5";
                setTimeout(() => {
                    iconContainer.style.scale = "1";
                    iconContainer.animate([
                        { scale: "0.5", },
                        { scale: "1", },
                    ], { duration: 500, easing: "cubic-bezier(0.68, -0.55, 0.27, 1.55)" });
                }, 0);
                break;
            case NotificationIconType.INFO:
                this.setIconColor(Color.fromRgb(100, 100, 100));
                iconContainer = this.createCustomIconContainer("info-circle", 1.4);
                iconContainer.style.scale = "1";
                break;
            case NotificationIconType.LOADING:
                iconContainer = this.createCustomIconContainer("loading", 1.2);
                iconContainer.style.scale = "1.5";
                let angle = 0;
                renderEvent.connect(dt => {
                    angle = pmod(angle + dt * 360, 360);
                    iconContainer.style.rotate = angle + "deg";
                }, { owners: [ this.connectionOwner, this.iconConnections, ], });
                break;
            case NotificationIconType.NONE:
                this.iconEl.innerHTML = "";
                break;
        }
    }

    setIcon(v: string, scale: number = 1) {
        this.icon = v;
        if(this.iconType == NotificationIconType.CUSTOM) {
            const iconContainer = this.createIconContainer(scale);
            fetch(joinPaths(PATH_ICONS, this.icon + ".svg")).then(res => res.text()).then(text => {
                iconContainer.innerHTML = text;
            });
        }
    }

    setTimeout(v: number) {
        this.timeout = v;
        this.timeoutStart = performance.now();
    }

    snapToActualPosition(initialOffset: Vec2 = Vec2.zero()) {
        this.currentPosition.copy(this.targetPosition).addSelf(initialOffset);
        this.updateTransform();
    }

    updateTransform() {
        const dx = this.currentPosition.x - this.targetPosition.x;
        const dy = this.currentPosition.y - this.targetPosition.y;
        this.containerEl.style.transform = `translate(${roundDecimals(dx, 0.2)}px, ${roundDecimals(dy, 0.2)}px)`;
        this.containerEl.style.opacity = roundDecimals(this.currentOpacity, 1) + "";
    }

    updateTargetPosition() {
        this.containerEl.style.transform = "";
        const rect = this.containerEl.getBoundingClientRect();
        this.targetPosition.fromComponents(rect.left, rect.top);
        this.updateTransform();
    }

    remove() {
        if(this.removed)
            return;
        this.removed = true;
        this.targetOpacity = 0;
        this.targetOffset.x = -50;
        setTimeout(() => {
            this.containerEl.remove();
            this.parent.updateActiveNotificationsLayout();
            this.removeEvent.fire();
            this.connectionOwner.disconnectAll();
        }, 100);
    }
}

export enum NotificationIconType {
    CUSTOM = 0,
    ERROR = 1,
    LOADING = 2,
    CHECK = 3,
    INFO = 4,
    NONE = 5,
}

export type ActiveNotificationOptions = {
    title?: string,
    iconType?: NotificationIconType,
    icon?: string,
    iconColor?: Color,
    description?: string,
    timeout?: number,
    detailedTitle?: string | null,
    detailedDescription?: string,
    iconScale?: number,
    canClose?: boolean,
    descriptionWordBreak?: boolean,
};

export class NotificationSystem {
    activeContainerEl: HTMLDivElement;
    notificationButton: WindowBarButton;
    notificationCounter: HTMLDivElement;
    detailsContainerEl: HTMLDivElement;
    detailsContentEl: HTMLDivElement;
    activeNotifications: ActiveNotification[] = [];
    activeNotificationCountChanged: Signal<[count: number]> = new Signal();
    activeClosed: boolean = false;
    detailsVisible: boolean = false;
    detailsVisibleIndex: number = 0;
    runAppActionEvent = new Signal<[ action: string, data: any ]>();
    connectionOwner: ConnectionOwner = new ConnectionOwner();
    constructor(wbar: WindowBar) {
        this.detailsContainerEl = document.createElement("div");
        this.detailsContainerEl.classList.add("ntf-details-container");
        
        this.detailsContentEl = document.createElement("div");
        this.detailsContainerEl.appendChild(this.detailsContentEl);
        this.detailsContentEl.classList.add("ntf-details-content");

        const detailsCloseBtn = document.createElement("button");
        this.detailsContainerEl.appendChild(detailsCloseBtn);
        detailsCloseBtn.classList.add("ntf-close-button");
        fetch(joinPaths(PATH_ICONS, "cross.svg")).then(res => res.text()).then(text => {
            detailsCloseBtn.innerHTML = text;
        });
        detailsCloseBtn.onclick = () => {
            this.setDetailsVisible(false);
            this.setActiveClosed(false);
        }

        this.activeContainerEl = document.createElement("div");
        this.activeContainerEl.classList.add("ntf-active-container");

        const notifBtn = wbar.addIconButton("notification", null, () => {
            if(this.activeClosed) {
                this.activeClosed = false;
                this.setActiveClosed(false);
            } else {
                this.activeClosed = true;
                this.setActiveClosed(true);
            }
            notifBtn.buttonEl.style.cursor = "default";
            setTimeout(() => {
                notifBtn.buttonEl.style.cursor = "pointer";
            }, 50);
        }, WindowBarSide.RIGHT, false, 24, 16);
        this.notificationButton = notifBtn;
        notifBtn.containerEl.classList.add("wbar-notif");
        const notifCounter = document.createElement("div");
        notifBtn.containerEl.appendChild(notifCounter);
        notifCounter.classList.add("wbar-notif-counter");
        this.notificationCounter = notifCounter;
        notifCounter.style.display = "none";
        notifBtn.buttonEl.style.backgroundColor = "rgb(30, 30, 30)";

        notifBtn.buttonEl.addEventListener("mousedown", (e) => {
            if(e.button != 2)
                return;
            requestAnimationFrame(() => {
                let menu = new ContextMenu(null, e.clientX, e.clientY);
                menu.addLayout([
                    {
                        title: "View Details",
                        icon: "info-circle",
                        iconScale: 1.4,
                        separator: true,
                        data: { action: "toggle-notification-details", },
                    },
                    {
                        title: "Dismiss All",
                        icon: "cross",
                        disabled: this.activeNotifications.length === 0,
                        data: { action: "dismiss-all-notifications", },
                    },
                ]);
                menu.clickOffEvent.connect((e) => {
                    menu.remove();
                }, { owners: [ this.connectionOwner, ], });
                menu.buttonClickEvent.connect((btn) => {
                    if(btn.data != null && typeof btn.data === "object" && btn.data.action != null) {
                        this.runAppActionEvent.fire(btn.data.action, btn.data);
                    }
                    menu.remove();
                }, { owners: [ this.connectionOwner, ], });
                e.preventDefault();
            });
        });

        this.activeNotificationCountChanged.connect(count => {
            notifCounter.textContent = count + "";
            this.notificationCounter.style.display = !this.activeClosed || this.activeNotifications.length == 0 ? "none" : "block";
        }, { owners: [ this.connectionOwner ], initArgs: [ this.activeNotifications.length ] })

        new HtmlConnection(window, "resize", () => {
            this.updateActiveNotificationsLayout();
        }, { owners: [ this.connectionOwner ] });

        const openDetailsCtxMenu = (e: MouseEvent) => {
            if(e.button != 2)
                return;
            requestAnimationFrame(() => {
                const menu = new ContextMenu(null, e.clientX, e.clientY);
                menu.addLayout([
                    {
                        title: "Close Details",
                        icon: "cross",
                        dangerSeparator: true,
                        data: { action: "close-details", },
                    },
                    {
                        title: "Clear Details",
                        danger: true,
                        icon: "trash",
                        iconScale: 1.2,
                        data: { action: "clear-details", },
                    },
                ]);
                menu.clickOffEvent.connect(e2 => {
                    menu.remove();
                }, { owners: [ this.connectionOwner, menu.connectionOwner, ], });
                menu.buttonClickEvent.connect(e2 => {
                    if(e2.data == null)
                        return;
                    if(e2.data.action == "clear-details") {
                        let rect = e2.buttonEl.getBoundingClientRect();
                        const menu2 = new ContextMenu(null, rect.left, rect.top);
                        menu2.addLayout([
                            {
                                title: "Confirm?",
                                disabled: true,
                            },
                            {
                                title: "Cancel",
                                dangerSeparator: true,
                            },
                            {
                                title: "Clear",
                                danger: true,
                                icon: "trash",
                                iconScale: 1.2,
                                data: { action: "clear-confirm", },
                            }
                        ]);
                        menu2.buttons[0]!.prefixIconEl!.style.width = "8px";
                        menu2.clickOffEvent.connect(e => {
                            menu2.remove();
                        }, { owners: [ this.connectionOwner, menu2.connectionOwner, ], });
                        menu2.buttonClickEvent.connect(e => {
                            if(e.data != null && e.data.action === "clear-confirm") {
                                this.clearAllNotificationDetails();
                            }
                            menu2.remove();
                        }, { owners: [ this.connectionOwner, menu2.connectionOwner, ], });
                        menu.remove();
                    } else if(e2.data.action == "close-details") {
                        this.setDetailsVisible(false);
                        menu.remove();
                        this.setActiveClosed(false);
                    }
                }, { owners: [ this.connectionOwner, menu.connectionOwner, ], });
            });
            e.preventDefault();
        }

        new HtmlConnection(this.detailsContentEl, "mousedown", openDetailsCtxMenu, { owners: [ this.connectionOwner, ], });
        new HtmlConnection(this.detailsContainerEl, "mousedown", openDetailsCtxMenu, { owners: [ this.connectionOwner, ], });
    }

    clearAllNotificationDetails() {
        this.detailsContentEl.innerHTML = "";
    }

    toggleDetailsVisible() {
        this.setDetailsVisible(!this.detailsVisible);
    }

    setDetailsVisible(v: boolean) {
        if(v === this.detailsVisible)
            return;
        this.detailsVisible = v;
        let id = ++this.detailsVisibleIndex;
        if(v)
            this.setActiveClosed(true);
        if(v) {
            this.detailsContainerEl.style.display = "block";
            this.detailsContainerEl.animate([
                { transform: "translate(20px)", opacity: "0", },
                { transform: "translate(0px)", opacity: "1", },
            ], { duration: 100, easing: "ease", });
        } else {
            this.detailsContainerEl.animate([
                { transform: "translate(0px)", opacity: "1", },
                { transform: "translate(20px)", opacity: "0", },
            ], { duration: 100, easing: "ease", });
            setTimeout(() => {
                if(id != this.detailsVisibleIndex)
                    return;
                this.detailsContainerEl.style.display = "none";
            }, 100);
        }
    }

    scrollToDetails(el: HTMLDivElement) {
        el.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest",
        });
    }

    setActiveClosed(v: boolean) {
        if(v) {
            this.activeClosed = true;
            this.activeContainerEl.style.display = "none";
            this.notificationButton.buttonEl.style.backgroundColor = "";
            this.notificationCounter.style.display = this.activeNotifications.length == 0 ? "none" : "block";
        } else {
            this.setDetailsVisible(false);
            this.activeClosed = false;
            this.activeContainerEl.style.display = "flex";
            this.notificationButton.buttonEl.style.backgroundColor = "rgb(30, 30, 30)";
            this.notificationCounter.style.display = "none";
        }
    }

    sendNotificationDetails(title: string, description: string) {
        let detailsEl = document.createElement("div");
        this.detailsContentEl.appendChild(detailsEl);
        detailsEl.classList.add("ntf-details-item");

        let titleEl = document.createElement("div");
        detailsEl.appendChild(titleEl);
        titleEl.textContent = title;
        titleEl.classList.add("ntf-details-title");

        let timestampEl = document.createElement("div");
        detailsEl.appendChild(timestampEl);
        let now = Temporal.Now.zonedDateTimeISO();
        let hour24 = now.hour;
        let minute = now.minute;
        let hour12 = hour24 % 12 || 12;
        let ampm = hour24 >= 12 ? "PM" : "AM";
        timestampEl.textContent = `${now.year}/${now.month.toString().padStart(2, "0")}/${now.day.toString().padStart(2, "0")} ${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;
        timestampEl.classList.add("ntf-details-timestamp");

        let descriptionEl = document.createElement("div");
        detailsEl.appendChild(descriptionEl);
        descriptionEl.textContent = description;
        descriptionEl.classList.add("ntf-details-description");

        return detailsEl;
    }

    sendActiveNotification({
        title = "",
        iconType = NotificationIconType.INFO,
        iconColor = Color.WHITE,
        icon = "",
        description = "",
        timeout = -1,
        detailedTitle = null,
        detailedDescription = "",
        iconScale = 1,
        canClose = true,
        descriptionWordBreak = false,
    }: ActiveNotificationOptions = {}) {
        if(!this.detailsVisible && this.activeClosed && this.activeNotifications.length === 0) {
            this.setActiveClosed(false);
        }
        const notif = new ActiveNotification(this);
        notif.setTitle(title);
        notif.setIconColor(iconColor);
        notif.setIconType(iconType);
        notif.setIcon(icon, iconScale);
        notif.setDescription(description);
        notif.setTimeout(timeout);
        this.activeContainerEl.appendChild(notif.containerEl);
        this.activeNotifications.push(notif);
        this.activeNotificationCountChanged.fire(this.activeNotifications.length);
        this.updateActiveNotificationsLayout();
        notif.snapToActualPosition(Vec2.LEFT.mulScalar(50));
        notif.removeEvent.connect(() => {
            const index = this.activeNotifications.indexOf(notif);
            if(index !== -1) {
                this.activeNotifications.splice(index, 1);
                this.activeNotificationCountChanged.fire(this.activeNotifications.length);
            }
        }, { owners: null });
        if(detailedTitle != null) {
            let detailsEl = this.sendNotificationDetails(detailedTitle, detailedDescription);
            notif.addViewDetailsLink(detailsEl);
        }
        if(descriptionWordBreak) {
            notif.descriptionEl.style.wordBreak = "break-word";
        }
        notif.setCloseButton(canClose);
        return notif;
    }

    updateActiveNotificationsLayout() {
        this.activeNotifications.forEach(notif => {
            notif.updateTargetPosition();
        });
    }

    dismissAll() {
        for(let notif of [ ...this.activeNotifications ]) {
            if(notif.closeButtonEl == null)
                continue;
            notif.remove();
        }
    }
    
    viewDetails() {

    }
}