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

    public setKeybind(text: string | null) {
        this._private.setKeybind(text);
        const menuPrivate = ContextMenuPrivate.get(this.menu)!;
        menuPrivate.updateLayout();
    }

    public setPrefixIcon(src: string | null) {
        this._private.setPrefixIcon(src);
        const menuPrivate = ContextMenuPrivate.get(this.menu)!;
        menuPrivate.updateLayout();
    }

    public setSvgIcon(name: string | null, scale?: number) {
        this._private.setPrefixIcon("./src/icons/" + name + ".svg");
        if(scale !== undefined)
            this._private.setPrefixIconScale(scale);
        const menuPrivate = ContextMenuPrivate.get(this.menu)!;
        menuPrivate.updateLayout();
    }
}