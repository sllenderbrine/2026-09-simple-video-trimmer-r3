import { Signal } from "../Public/Signal";

const privateMap = new WeakMap<any, ObserverPrivate<any>>();

export class ObserverPrivate<V> {
    public signal = new Signal<[value: V]>();
    constructor(
        public obj: any,
        public value: V
    ) {
        privateMap.set(obj, this);
    }

    public static get(obj: any) {
        return privateMap.get(obj);
    }
}