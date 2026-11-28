import { EventOwner } from "../Public/EventOwner";
import { HtmlEventMap, HtmlEventMapElement, HtmlListener, HtmlListenerSettings } from "../Public/HtmlListener";
import { EventOwnerPrivate } from "./EventOwnerPrivate";

const privateMap = new WeakMap<any, HtmlListenerPrivate<any, any>>();

export class HtmlListenerPrivate<T extends HtmlEventMapElement, K extends keyof HtmlEventMap<T>> {
    public owners = new Set<EventOwner>();
    public disconnected = false;
    constructor(
        obj: HtmlListener<T, K>,
        public element: T,
        public name: K,
        public callback: (this: T, ev: HtmlEventMap<T>[K]) => any,
        ...args: (HtmlListenerSettings<T, K> | EventOwner | null)[]
    ) {
        if(args.length === 0 || (args.length === 1 && !(args[0]! instanceof EventOwner) && args[0]!.owners === undefined))
            console.warn("HtmlListener created without any owners. Pass null argument to silence");
        args.forEach((v, i) => {
            if(v == null)
                return;
            if(v instanceof EventOwner) {
                this.owners.add(v);
                EventOwnerPrivate.get(v)!.resources.add(obj);
            } else {
                if(i !== 0)
                    throw new Error(`HtmlListenerSettings cannot be the #${i+1} argument.`);
                if(v.owners) {
                    for(const v2 of v.owners) {
                        this.owners.add(v2);
                        EventOwnerPrivate.get(v2)!.resources.add(obj);
                    }
                }
                if(v.initArgs) {
                    (this.callback as any)(v.initArgs);
                }
                if(v.once) {
                    const callback0 = this.callback;
                    this.callback = (...args: any[]) => {
                        (callback0 as any)(...args);
                        obj.disconnect();
                    }
                }
            }
        });
        element.addEventListener(name as string, this.callback as any);
        privateMap.set(obj, this);
    }

    public static get(obj: any) {
        return privateMap.get(obj);
    }
}