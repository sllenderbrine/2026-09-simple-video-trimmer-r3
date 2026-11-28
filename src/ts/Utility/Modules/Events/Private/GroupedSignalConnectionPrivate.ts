import { EventOwner } from "../Public/EventOwner";
import { GroupedSignal } from "../Public/GroupedSignal";
import { GroupedSignalConnection, GroupedSignalConnectionSettings } from "../Public/GroupedSignalConnection";
import { EventOwnerPrivate } from "./EventOwnerPrivate";
import { GroupedSignalPrivate } from "./GroupedSignalPrivate";

const privateMap = new WeakMap<any, GroupedSignalConnectionPrivate<any, any>>();

export class GroupedSignalConnectionPrivate<M extends Record<string, any[]>, K extends keyof M> {
    public owners = new Set<EventOwner>();
    public signalPrivate: GroupedSignalPrivate<M>;

    constructor(
        obj: GroupedSignalConnection<M, K>,
        public signal: GroupedSignal<M>,
        public name: K,
        public callback: (...args: M[K]) => void,
        ...args: (GroupedSignalConnectionSettings<M[K]> | EventOwner | null)[]
    ) {
        this.signalPrivate = GroupedSignalPrivate.get(this.signal)!;
        let list = this.signalPrivate.connections.get(name);
        if(list == null) {
            list = new Set();
            this.signalPrivate.connections.set(name, list);
        }
        list.add(obj);
        if(args.length === 0 || (args.length === 1 && !(args[0]! instanceof EventOwner) && args[0]!.owners === undefined))
            console.warn("GroupedSignalConnection created without any owners. Pass null argument to silence");
        args.forEach((v, i) => {
            if(v == null)
                return;
            if(v instanceof EventOwner) {
                this.owners.add(v);
                EventOwnerPrivate.get(v)!.resources.add(obj);
            } else {
                if(i !== 0)
                    throw new Error(`GroupedSignalConnectionSettings cannot be the #${i+1} argument.`);
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
                    this.callback = (...args: M[K]) => {
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