import { CssUtility } from "../../../Utility";
import { CtxmButton } from "./CtxmButton";
import { CtxmDivider } from "./CtxmDivider";
import { ContextMenuPrivate } from "../Private/ContextMenuPrivate";

export const CONTEXTMENU_STYLE = CssUtility.adoptStyle(`
    .dropdownmenu {
        container-type: size;
        position: absolute;
        background-color: var(--bg1);
        border-radius: 8px;
        padding: 4px 4px;
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
        user-select: none;
    }

    .dropdownmenu-content {
        position: absolute;
        width: 100cqw;
        height: 100cqh;
        display: flex;
        flex-direction: column;
        overflow-x: hidden;
        overflow-y: auto;
        scrollbar-width: none;
    }

    .dropdownmenu-divider {
        position: absolute;
        width: 100%;
        height: 1px;
        background-color: var(--bg2);
    }

    .dropdownmenu-button {
        position: absolute;
        width: 100%;
        height: 24px;
        display: flex;
    }

    .dropdownmenu-title {
        height: 24px;
        left: 0px;
        top: 0px;
        position: absolute;
        align-content: center;
        text-align: left;
        white-space: nowrap;
        overflow: hidden;
        user-select: none;
        pointer-events: none;
    }
`);

export type ContextMenuChild = CtxmDivider | CtxmButton;

export class ContextMenu {
    private _private: ContextMenuPrivate;
    constructor() {
        this._private = new ContextMenuPrivate(this);
    }

    /**
     * The x-position on screen where the menu should be opened from.\
     * The actual position of the menu on screen is mostly determined based off this value.
     */
    public get x(): number {
        return this._private.x;
    }
    public set x(v: number) {
        this._private.x = v;
        this._private.updateScreenPositionX();
    }

    /**
     * The y-position on screen where the menu should be opened from.\
     * The actual position of the menu on screen is mostly determined based off this value.
     */
    public get y(): number {
        return this._private.y;
    }
    public set y(v: number) {
        this._private.y = v;
        this._private.updateScreenPositionY();
    }

    public get offscreenOffsetX(): number {
        return this._private.offscreenOffsetX;
    }
    public set offscreenOffsetX(v: number) {
        this._private.offscreenOffsetX = v;
        if(this._private.dodgedRightEdge)
            this._private.updateScreenPositionX();
    }

    public get offscreenOffsetY(): number {
        return this._private.offscreenOffsetY;
    }
    public set offscreenOffsetY(v: number) {
        this._private.offscreenOffsetY = v;
        if(this._private.dodgedBottomEdge)
            this._private.updateScreenPositionY();
    }

    /** The target content width of the menu */
    public get targetWidth(): number {
        return this._private.targetWidth;
    }

    /** The target content height of the menu */
    public get targetHeight(): number {
        return this._private.targetHeight;
    }

    /** The width of the menu w/o padding */
    public get width(): number {
        return this._private.width;
    }

    /** The height of the menu w/o padding */
    public get height(): number {
        return this._private.height;
    }

    /** True if the on screen position was shifted a full width left to avoid going off screen */
    public get dodgedRightEdge(): boolean {
        return this._private.dodgedRightEdge;
    }

    /** True if the on screen position was shifted a full height up to avoid going off screen */
    public get dodgedBottomEdge(): boolean {
        return this._private.dodgedBottomEdge;
    }

    /** The content width of the menu can't go below this value */
    public get minWidth(): number {
        return this._private.minWidth;
    }
    public set minWidth(v: number) {
        this._private.minWidth = v;
        this._private.updateLayout();
    }

    /** The content height of the menu can't go below this value */
    public get minHeight(): number {
        return this._private.minHeight;
    }
    public set minHeight(v: number) {
        this._private.minHeight = v;
        this._private.updateLayout();
    }

    /** The content width of the menu can't go above this value */
    public get maxWidth(): number {
        return this._private.maxWidth;
    }
    public set maxWidth(v: number) {
        this._private.maxWidth = v;
        this._private.updateLayout();
    }

    /**
     * The height of the menu w/o padding can't go above this value.\
     * The menu will be scrollable if the content height exceeds it.
     */
    public get maxHeight(): number {
        return this._private.maxHeight;
    }
    public set maxHeight(v: number) {
        this._private.maxHeight = v;
        this._private.updateLayout();
    }
}