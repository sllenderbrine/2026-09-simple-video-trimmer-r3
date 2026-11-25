import { EventOwner } from "./EventOwner";
import { EventOwnerPrivate } from "../Private/EventOwnerPrivate";
import { IntervalEventPrivate } from "../Private/IntervalEventPrivate";

export interface IntervalEventSettings {
    owners?: EventOwner[] | null,
    runFirst?: boolean,
}

/**
 * A single-callback event that triggers at regular intervals.
 */
export class IntervalEvent {
    private _private: IntervalEventPrivate;
    constructor(
        callback: () => void,
        ms: number,
        ...args: (IntervalEventSettings | EventOwner | null)[]
    ) {
        this._private = new IntervalEventPrivate(this, callback, ms, ...args);
    }

    public isConnected() {
        return !this._private.disconnected;
    }

    /**
     * Disables this interval event and removes it from any associated event owners.
     */
    public disconnect(): void {
        this._private.disconnected = true;
        clearInterval(this._private.eventId);
        for(const v of this._private.owners) {
            EventOwnerPrivate.get(v)!.resources.delete(this);
        }
        this._private.owners.clear();
    }
}