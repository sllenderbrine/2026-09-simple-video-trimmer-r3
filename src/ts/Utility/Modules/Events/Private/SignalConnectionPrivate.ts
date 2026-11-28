import { EventOwner } from "../Public/EventOwner";
import { Signal } from "../Public/Signal";
import { SignalConnection, SignalConnectionSettings } from "../Public/SignalConnection";
import { EventOwnerPrivate } from "./EventOwnerPrivate";
import { SignalPrivate } from "./SignalPrivate";

const privateMap = new WeakMap<any, SignalConnectionPrivate<any>>();

export class SignalConnectionPrivate<T extends any[]> {
    public owners = new Set<EventOwner>();
    public signalPrivate: SignalPrivate<T>;
    
    constructor(
        obj: SignalConnection<T>,
        public signal: Signal<T>,
        public callback: (...args: T) => void,
        ...args: (SignalConnectionSettings<T> | EventOwner | null)[]
    ) {
        this.signalPrivate = SignalPrivate.get(this.signal)!;
        this.signalPrivate.connections.add(obj);
        if(args.length === 0 || (args.length === 1 && !(args[0]! instanceof EventOwner) && args[0]!.owners === undefined))
            console.warn("SignalConnection created without any owners. Pass null argument to silence");
        args.forEach((v, i) => {
            if(v == null)
                return;
            if(v instanceof EventOwner) {
                this.owners.add(v);
                EventOwnerPrivate.get(v)!.resources.add(obj);
            } else {
                if(i !== 0)
                    throw new Error(`SignalConnectionSettings cannot be the #${i+1} argument.`);
                if(v.owners) {
                    for(const v2 of v.owners) {
                        this.owners.add(v2);
                        EventOwnerPrivate.get(v2)!.resources.add(obj);
                    }
                }
                if(v.initArgs) {
                    this.callback(...v.initArgs);
                }
                if(v.once) {
                    const callback0 = this.callback;
                    this.callback = (...args: T) => {
                        callback0(...args);
                        obj.disconnect();
                    }
                }
            }
        });
        privateMap.set(obj, this);
    }

    public static get(obj: any) {
        return privateMap.get(obj);
    }
}