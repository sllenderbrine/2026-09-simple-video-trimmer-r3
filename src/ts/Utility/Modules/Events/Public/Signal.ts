import { EventOwner } from "./EventOwner";
import { SignalConnectionPrivate } from "../Private/SignalConnectionPrivate";
import { SignalPrivate } from "../Private/SignalPrivate";
import { SignalConnection, SignalConnectionSettings } from "./SignalConnection";

/**
 * A generic event signal that can connect with any number of callback listeners.\
 * When `.fire` is called, all connections are triggered with the specified arguments.
 */
export class Signal<T extends any[]> {
    private _private: SignalPrivate<T>;
    constructor() {
        this._private = new SignalPrivate<T>(this);
    }

    public fire(...args: T) {
        for(const con of [ ...this._private.connections ]) {
            SignalConnectionPrivate.get(con)!.callback(...args);
        }
    }

    public connect(
        callback: (...args: T) => void,
        ...args: (SignalConnectionSettings<T> | EventOwner | null)[]
    ): SignalConnection<T> {
        return new SignalConnection(this, callback, ...args);
    }

    public once(
        callback: (...args: T) => void,
        ...args: (SignalConnectionSettings<T> | EventOwner | null)[]
    ): SignalConnection<T> {
        if(args[0] == null || args[0] instanceof EventOwner)
            args.unshift({});
        const settings = (args[0]! as SignalConnectionSettings<T>);
        settings.once = true;
        return this.connect(callback, ...args);
    }

    public handle(
        callback: (...args: T) => void,
        args0: T,
        ...args: (SignalConnectionSettings<T> | EventOwner | null)[]
    ): SignalConnection<T> {
        if(args[0] == null || args[0] instanceof EventOwner)
            args.unshift({});
        const settings = (args[0]! as SignalConnectionSettings<T>);
        settings.initArgs = args0;
        return this.connect(callback, ...args);
    }

    public handleOnce(
        callback: (...args: T) => void,
        args0: T,
        ...args: (SignalConnectionSettings<T> | EventOwner | null)[]
    ): SignalConnection<T> {
        if(args[0] == null || args[0] instanceof EventOwner)
            args.unshift({});
        const settings = (args[0]! as SignalConnectionSettings<T>);
        settings.initArgs = args0;
        settings.once = true;
        return this.connect(callback, ...args);
    }
}