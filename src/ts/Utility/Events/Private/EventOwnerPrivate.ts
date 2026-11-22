import { EventOwnerResource } from "../Public/EventOwner";

const privateMap = new WeakMap<any, EventOwnerPrivate>();

export class EventOwnerPrivate {
    public resources = new Set<EventOwnerResource>();
    
    constructor(obj: any) {
        privateMap.set(obj, this);
    }
    
    public static get(obj: any) {
        return privateMap.get(obj);
    }
}