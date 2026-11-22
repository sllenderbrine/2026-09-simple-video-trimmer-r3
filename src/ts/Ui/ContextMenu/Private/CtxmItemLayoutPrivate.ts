import { Observer } from "../../../Utility/Events";

const privateMap = new WeakMap<any, CtxmItemLayoutPrivate>();

export class CtxmItemLayoutPrivate {
    public targetWidth = 0;
    public height = 0;
    public marginTop = 0;
    public marginBottom = 0;
    public width = new Observer(0);
    public top = new Observer(0);
    constructor(
        obj: any,
    ) {
        privateMap.set(obj, this);
    }

    public static get(obj: any) {
        return privateMap.get(obj);
    }
}