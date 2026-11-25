import { ContextMenu } from "./ContextMenu";
import { CtxmDividerPrivate } from "../Private/CtxmDividerPrivate";

export class CtxmDivider {
    private _private: CtxmDividerPrivate;

    constructor(menu: ContextMenu) {
        this._private = new CtxmDividerPrivate(this, menu);
    }
}