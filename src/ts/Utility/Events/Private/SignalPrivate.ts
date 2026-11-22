import { SignalConnection } from "../Public/SignalConnection";

const privateMap = new WeakMap<any, SignalPrivate<any>>();

export class SignalPrivate<T extends any[]> {
    public connections = new Set<SignalConnection<T>>();
            
    constructor(obj: any) {
        privateMap.set(obj, this);
    }

    public static get(obj: any) {
        return privateMap.get(obj);
    }
}