import { EventOwner } from "./EventOwner";
import { EventOwnerPrivate } from "../Private/EventOwnerPrivate";
import { TimeoutEventPrivate } from "../Private/TimeoutEventPrivate";

export interface TimeoutEventSettings {
    owners?: EventOwner[] | null,
}

/**
 * A single-callback event that triggers after a specified timeout.
 */
export class TimeoutEvent {
    private _private: TimeoutEventPrivate;
    constructor(
        callback: () => void,
        ms: number,
        ...args: (TimeoutEventSettings | EventOwner | null)[]
    ) {
        this._private = new TimeoutEventPrivate(this, callback, ms, ...args);
    }

    public isConnected() {
        return !this._private.disconnected;
    }

    /**
     * Disables this timeout event and removes it from any associated event owners.
     */
    public disconnect(): void {
        this._private.disconnected = true;
        clearTimeout(this._private.eventId);
        for(const v of this._private.owners) {
            EventOwnerPrivate.get(v)!.resources.delete(this);
        }
        this._private.owners.clear();
    }
}