import { EventOwner } from "./EventOwner";
import { GroupedSignal } from "./GroupedSignal";
import { EventOwnerPrivate } from "../Private/EventOwnerPrivate";
import { GroupedSignalConnectionPrivate } from "../Private/GroupedSignalConnectionPrivate";

export interface GroupedSignalConnectionSettings<T extends any[]> {
    initArgs?: T,
    owners?: EventOwner[] | null,
    once?: boolean,
}

/**
 * A GroupSignal connection that is triggered only when the specified name is fired on the corresponding signal.
 */
export class GroupedSignalConnection<M extends Record<string, any[]>, K extends keyof M> {
    private _private: GroupedSignalConnectionPrivate<M, K>;
    constructor(
        signal: GroupedSignal<M>,
        name: K,
        callback: (...args: M[K]) => void,
        ...args: (GroupedSignalConnectionSettings<M[K]> | EventOwner | null)[]
    ) {
        this._private = new GroupedSignalConnectionPrivate<M, K>(this, signal, name, callback, ...args);
    }

    public isConnected() {
        let list = this._private.signalPrivate.connections.get(this._private.name);
        if(list == null)
            return false;
        return list.has(this);
    }

    /** Disconnects this connection from the corresponding signal and any associated event owners. */
    public disconnect() {
        let list = this._private.signalPrivate.connections.get(this._private.name);
        if(list == null)
            return;
        list.delete(this);
        if(list.size === 0) {
            this._private.signalPrivate.connections.delete(this._private.name);
        }
        for(const v of this._private.owners) {
            EventOwnerPrivate.get(v)!.resources.delete(this);
        }
        this._private.owners.clear();
    }
}