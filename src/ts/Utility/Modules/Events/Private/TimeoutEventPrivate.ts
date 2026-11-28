import { EventOwner } from "../Public/EventOwner";
import { TimeoutEvent, TimeoutEventSettings } from "../Public/TimeoutEvent";
import { EventOwnerPrivate } from "./EventOwnerPrivate";

const privateMap = new WeakMap<any, TimeoutEventPrivate>();

export class TimeoutEventPrivate {
    public eventId: number;
    public owners = new Set<EventOwner>();
    public disconnected = false;
    constructor(
        obj: TimeoutEvent,
        public callback: () => void,
        public ms: number,
        ...args: (TimeoutEventSettings | EventOwner | null)[]
    ) {
        if(args.length === 0 || (args.length === 1 && !(args[0]! instanceof EventOwner) && args[0]!.owners === undefined))
            console.warn("TimeoutEvent created without any owners. Pass null argument to silence");
        args.forEach((v, i) => {
            if(v == null)
                return;
            if(v instanceof EventOwner) {
                this.owners.add(v);
                EventOwnerPrivate.get(v)!.resources.add(obj);
            } else {
                if(i !== 0)
                    throw new Error(`TimeoutEventSettings cannot be the #${i+1} argument.`);
                if(v.owners) {
                    for(const v2 of v.owners) {
                        this.owners.add(v2);
                        EventOwnerPrivate.get(v2)!.resources.add(obj);
                    }
                }
            }
        });
        const callback0 = this.callback;
        this.callback = () => {
            callback0();
            this.disconnected = true;
            for(const v of this.owners) {
                EventOwnerPrivate.get(v)!.resources.delete(obj);
            }
            this.owners.clear();
        }
        this.eventId = setTimeout(this.callback, this.ms);
        privateMap.set(obj, this);
    }

    public static get(obj: any) {
        return privateMap.get(obj);
    }
}