import { ContextMenu } from "./ContextMenu";
import { CtxmDividerPrivate } from "../Private/CtxmDividerPrivate";
import { ContextMenuPrivate } from "../Private/ContextMenuPrivate";

export class CtxmDivider {
    private _private: CtxmDividerPrivate;

    constructor(menu: ContextMenu) {
        this._private = new CtxmDividerPrivate(this, menu);
    }

    public get menu() {
        return this._private.menu;
    }

    public setTitle(text?: string | null) {
        this._private.setTitle(text);
        const menuPrivate = ContextMenuPrivate.get(this.menu)!;
        menuPrivate.updateLayout();
    }
}