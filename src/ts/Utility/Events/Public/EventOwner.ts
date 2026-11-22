import { GroupedSignalConnection } from "./GroupedSignalConnection";
import { IntervalEvent } from "./IntervalEvent";
import { EventOwnerPrivate } from "../Private/EventOwnerPrivate";
import { TimeoutEvent } from "./TimeoutEvent";
import { SignalConnection } from "./SignalConnection";
import { SignalConnectionPrivate } from "../Private/SignalConnectionPrivate";
import { IntervalEventPrivate } from "../Private/IntervalEventPrivate";
import { TimeoutEventPrivate } from "../Private/TimeoutEventPrivate";
import { GroupedSignalConnectionPrivate } from "../Private/GroupedSignalConnectionPrivate";

export type EventOwnerResource = SignalConnection<any> | IntervalEvent | TimeoutEvent | GroupedSignalConnection<any, any>;

export function getEventOwnerResourcePrivate(v: EventOwnerResource) {
    switch(v.constructor) {
        case SignalConnection: return SignalConnectionPrivate.get(v);
        case IntervalEvent: return IntervalEventPrivate.get(v);
        case TimeoutEvent: return TimeoutEventPrivate.get(v);
        case GroupedSignalConnection: return GroupedSignalConnectionPrivate.get(v);
    }
}

/**
 * Groups event resources and allows for simplified cleanup and management.
 */
export class EventOwner {
    private _private: EventOwnerPrivate;

    constructor() {
        this._private = new EventOwnerPrivate(this);
    }


    /**
     * Adds ownership of the specified resource.
     */
    public addResource(v: EventOwnerResource): void {
        this._private.resources.add(v);
        getEventOwnerResourcePrivate(v)!.owners.add(this);
    }

    /**
     * Removes ownership of the specified resource.
     */
    public removeResource(v: EventOwnerResource): void {
        this._private.resources.delete(v);
        getEventOwnerResourcePrivate(v)!.owners.delete(this);
    }
    
    /**
     * Removes ownership of all resources.\
     * Does **NOT** disconnect any resources from their corresponding signals.
     */
    public removeAllResources(): void {
        for(const v of this._private.resources) {
            getEventOwnerResourcePrivate(v)!.owners.delete(this);
        }
        this._private.resources.clear();
    }

    /**
     * Calls .disconnect() on all event connection resources.\
     * As a result, all owned connections are disconnected from this and their corresponding signals.
     */
    public cancelEventConnections(): void {
        for(const v of [ ...this._private.resources ]) {
            v.disconnect();
        }
    }
}