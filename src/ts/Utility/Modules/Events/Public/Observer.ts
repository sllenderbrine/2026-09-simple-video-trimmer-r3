import { ObserverPrivate } from "../Private/ObserverPrivate";
import { EventOwner } from "./EventOwner";
import { SignalConnection, SignalConnectionSettings } from "./SignalConnection";

/**
 * An observable value that can be watched for changes.\
 * Any connections will be triggered when `.set` or `.fire` is called.\
 * Use `.connect`, `.handle`, `.once`, or `.handleOnce` to listen for changes.
 */
export class Observer<V> {
    private _private: ObserverPrivate<V>;
    constructor(value: V) {
        this._private = new ObserverPrivate(this, value);
    }

    public get value(): V {
        return this._private.value;
    }

    public set value(v: V) {
        this._private.value = v;
        this._private.signal.fire(v);
    }

    public fire(): void {
        this._private.signal.fire(this._private.value);
    }

    public connect(
        callback: (value: V) => void,
        ...args: (SignalConnectionSettings<[value: V]> | EventOwner | null)[]
    ): SignalConnection<[value: V]> {
        return this._private.signal.connect(callback, ...args);
    }

    public handle(
        callback: (value: V) => void,
        ...args: (SignalConnectionSettings<[value: V]> | EventOwner | null)[]
    ): SignalConnection<[value: V]> {
        return this._private.signal.handle(callback, [ this._private.value ], ...args);
    }

    public once(
        callback: (value: V) => void,
        ...args: (SignalConnectionSettings<[value: V]> | EventOwner | null)[]
    ): SignalConnection<[value: V]> {
        return this._private.signal.once(callback, ...args);
    }

    public handleOnce(
        callback: (value: V) => void,
        ...args: (SignalConnectionSettings<[value: V]> | EventOwner | null)[]
    ): SignalConnection<[value: V]> {
        return this._private.signal.handleOnce(callback, [ this._private.value ], ...args);
    }
}