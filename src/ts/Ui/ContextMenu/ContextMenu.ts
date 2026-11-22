import { CssUtility } from "../../Utility/CssUtility";
import { MathUtility } from "../../Utility/MathUtility";
import { ContextMenuPrivate } from "./Private/ContextMenuPrivate";
import { CtxmItemLayoutPrivate } from "./Private/CtxmItemLayoutPrivate";

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
`);

export class ContextMenu {
    private _private: ContextMenuPrivate;
    private _x: number = 0;
    private _y: number = 0;
    private _offscreenOffsetX: number = 0;
    private _offscreenOffsetY: number = 0;
    private _contentWidth: number = 0;
    private _contentHeight: number = 0;
    private _width: number = 0;
    private _height: number = 0;
    private _dodgedRightEdge: boolean = false;
    private _dodgedBottomEdge: boolean = false;
    private _minWidth: number = 0;
    private _minHeight: number = 0;
    private _maxWidth: number = 300;
    private _maxHeight: number = 300;
    constructor() {
        this._private = new ContextMenuPrivate(this);

        this._private.updateContentHeight.connect(() => {
            this._updateContentHeight();
            this._updateHeight();
        });
        this._private.updateContentWidth.connect(() => {
            this._updateContentWidth();
            this._updateWidth();
        });
    }

    /**
     * The x-position on screen where the menu should be opened from.\
     * The actual position of the menu on screen is mostly determined based off this value.
     */
    public get x(): number {
        return this._x;
    }
    public set x(v: number) {
        this._x = v;
        this._updateScreenPositionX();
    }

    /**
     * The y-position on screen where the menu should be opened from.\
     * The actual position of the menu on screen is mostly determined based off this value.
     */
    public get y(): number {
        return this._y;
    }
    public set y(v: number) {
        this._y = v;
        this._updateScreenPositionY();
    }

    public get offscreenOffsetX(): number {
        return this._offscreenOffsetX;
    }
    public set offscreenOffsetX(v: number) {
        this._offscreenOffsetX = v;
        if(this._dodgedRightEdge)
            this._updateScreenPositionX();
    }

    public get offscreenOffsetY(): number {
        return this._offscreenOffsetY;
    }
    public set offscreenOffsetY(v: number) {
        this._offscreenOffsetY = v;
        if(this._dodgedBottomEdge)
            this._updateScreenPositionY();
    }

    /** The (target) content width of the menu */
    public get contentWidth(): number {
        return this._contentWidth;
    }

    /** The total content height of the menu */
    public get contentHeight(): number {
        return this._contentHeight;
    }

    /** The width of the menu w/o padding */
    public get width(): number {
        return this._width;
    }

    /** The height of the menu w/o padding */
    public get height(): number {
        return this._height;
    }

    /** True if the on screen position was shifted a full width left to avoid going off screen */
    public get dodgedRightEdge(): boolean {
        return this._dodgedRightEdge;
    }

    /** True if the on screen position was shifted a full height up to avoid going off screen */
    public get dodgedBottomEdge(): boolean {
        return this._dodgedBottomEdge;
    }

    /** The content width of the menu can't go below this value */
    public get minWidth(): number {
        return this._minWidth;
    }
    public set minWidth(v: number) {
        this._minWidth = v;
        this._updateWidth();
    }

    /** The content height of the menu can't go below this value */
    public get minHeight(): number {
        return this._minHeight;
    }
    public set minHeight(v: number) {
        this._minHeight = v;
        this._updateHeight();
    }

    /** The content width of the menu can't go above this value */
    public get maxWidth(): number {
        return this._maxWidth;
    }
    public set maxWidth(v: number) {
        this._maxWidth = v;
        this._updateWidth();
    }

    /**
     * The height of the menu w/o padding can't go above this value.\
     * The menu will be scrollable if the content height exceeds it.
     */
    public get maxHeight(): number {
        return this._maxHeight;
    }
    public set maxHeight(v: number) {
        this._maxHeight = v;
        this._updateHeight();
    }

    public _updateContentHeight() {
        let top = 0;
        for(const child of this._private.children) {
            const priv = CtxmItemLayoutPrivate.get(child)!;
            top += priv.marginTop;
            priv.top.value = top;
            top += priv.height;
            top += priv.marginBottom;
        }
        this._contentHeight = top;
    }

    private _updateHeight() {
        this._height = MathUtility.clamp(this._contentHeight, this._minHeight, this._maxHeight);
        this._private.containerEl.style.height = this._height + "px";
    }

    private _updateContentWidth() {
        let max = 0;
        for(const child of this._private.children) {
            const w = CtxmItemLayoutPrivate.get(child)!.targetWidth;
            if(w > max) max = w;
        }
        this._contentWidth = max;
    }

    private _updateWidth() {
        this._width = MathUtility.clamp(this._contentWidth, this._minWidth, this._maxWidth);
        for(const child of this._private.children) {
            CtxmItemLayoutPrivate.get(child)!.width.value = this._width;
        }
        this._private.containerEl.style.width = this._width + "px";
    }

    private _updateScreenPositionX() {
        if(this._x + this._contentWidth > window.innerWidth) {
            this._private.containerEl.style.left = (this._x - this._contentWidth + this._offscreenOffsetX) + "px";
            this._dodgedRightEdge = true;
        } else {
            this._private.containerEl.style.left = this._x + "px";
            this._dodgedRightEdge = false;
        }
    }

    private _updateScreenPositionY() {
        if(this._y + this._contentHeight > window.innerHeight) {
            this._private.containerEl.style.top = (this._y - this.contentHeight + this._offscreenOffsetY) + "px";
            this._dodgedBottomEdge = true;
        } else {
            this._private.containerEl.style.top = this._y + "px";
            this._dodgedBottomEdge = false;
        }
    }
}