import { ContextMenu } from "./ContextMenu";
import { ContextMenuPrivate } from "./Private/ContextMenuPrivate";
import { CtxmDividerPrivate } from "./Private/CtxmDividerPrivate";

export class CtxmDivider {
    private _private: CtxmDividerPrivate;
    private _menuPrivate: ContextMenuPrivate;

    constructor(menu: ContextMenu) {
        this._private = new CtxmDividerPrivate(this, menu);
        this._menuPrivate = ContextMenuPrivate.get(menu)!;

        this._menuPrivate.children.push(this);
        this._menuPrivate.updateContentHeight.fire();
    }
}