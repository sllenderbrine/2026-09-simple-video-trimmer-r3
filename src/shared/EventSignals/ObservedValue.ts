import { ConnectionOptions } from "./Connection.js";
import { Signal } from "./Signal.js";

export class ObservedValue<V extends any> extends Signal<[V]> {
    constructor(private _value: V) {
        super();
    }

    get() {
        return this._value;
    }

    set(value: V) {
        this._value = value;
        this.fire();
    }

    fire() {
        super.fire(this._value);
    }

    handle(
        callback: (v: V) => void,
        options: ConnectionOptions<[V]>,
    ) {
        options.initArgs = [ this._value, ];
        return this.connect(callback, options)
    }
}