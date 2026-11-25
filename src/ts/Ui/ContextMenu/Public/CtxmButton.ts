import { ContextMenu } from "./ContextMenu";
import { CtxmButtonPrivate } from "../Private/CtxmButtonPrivate";
import { ContextMenuPrivate } from "../Private/ContextMenuPrivate";

export class CtxmButton {
    private _private: CtxmButtonPrivate;

    constructor(menu: ContextMenu) {
        this._private = new CtxmButtonPrivate(this, menu);
    }

    public get menu() {
        return this._private.menu;
    }

    public setTitle(text: string | null) {
        this._private.setTitle(text);
        const menuPrivate = ContextMenuPrivate.get(this.menu)!;
        menuPrivate.updateLayout();
    }
}