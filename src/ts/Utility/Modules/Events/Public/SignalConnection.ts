import { EventOwner } from "./EventOwner";
import { EventOwnerPrivate } from "../Private/EventOwnerPrivate";
import { SignalConnectionPrivate } from "../Private/SignalConnectionPrivate";
import { Signal } from "./Signal";

export interface SignalConnectionSettings<T extends any[]> {
    initArgs?: T,
    owners?: EventOwner[] | null,
    once?: boolean,
}

/**
 * A single listener connected to the specified signal,\
 * running the specified callback function when the signal is fired.
 */
export class SignalConnection<T extends any[]> {
    private _private: SignalConnectionPrivate<T>;
    constructor(
        signal: Signal<T>,
        callback: (...args: T) => void,
        ...args: (SignalConnectionSettings<T> | EventOwner | null)[]
    ) {
        this._private = new SignalConnectionPrivate(this, signal, callback, ...args);
    }

    public isConnected() {
        return this._private.signalPrivate.connections.has(this);
    }

    /**
     * Disconnects this connection from the corresponding signal and any associated event owners.
     */
    public disconnect() {
        this._private.signalPrivate.connections.delete(this);
        for(const v of this._private.owners) {
            EventOwnerPrivate.get(v)!.resources.delete(this);
        }
        this._private.owners.clear();
    }
}