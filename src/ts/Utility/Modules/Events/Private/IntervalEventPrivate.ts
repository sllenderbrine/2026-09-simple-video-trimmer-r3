import { EventOwner } from "../Public/EventOwner";
import { IntervalEvent, IntervalEventSettings } from "../Public/IntervalEvent";
import { EventOwnerPrivate } from "./EventOwnerPrivate";

const privateMap = new WeakMap<any, IntervalEventPrivate>();

export class IntervalEventPrivate {
    public eventId: number;
    public owners = new Set<EventOwner>();
    public disconnected = false;
    constructor(
        obj: IntervalEvent,
        public callback: () => void,
        public ms: number,
        ...args: (IntervalEventSettings | EventOwner | null)[]
    ) {
        if(args.length === 0 || (args.length === 1 && !(args[0]! instanceof EventOwner) && args[0]!.owners === undefined))
            console.warn("IntervalEvent created without any owners. Pass null argument to silence");
        args.forEach((v, i) => {
            if(v == null)
                return;
            if(v instanceof EventOwner) {
                this.owners.add(v);
                EventOwnerPrivate.get(v)!.resources.add(obj);
            } else {
                if(i !== 0)
                    throw new Error("IntervalEventSettings must be the first argument.");
                if(v.owners) {
                    for(const v2 of v.owners) {
                        this.owners.add(v2);
                        EventOwnerPrivate.get(v2)!.resources.add(obj);
                    }
                }
                if(v.runFirst) {
                    this.callback();
                }
            }
        });
        this.eventId = setInterval(this.callback, this.ms);
        privateMap.set(obj, this);
    }

    public static get(obj: any) {
        return privateMap.get(obj);
    }
}