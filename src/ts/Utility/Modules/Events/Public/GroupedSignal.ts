import { EventOwner } from "./EventOwner";
import { GroupedSignalConnection, GroupedSignalConnectionSettings } from "./GroupedSignalConnection";
import { GroupedSignalConnectionPrivate } from "../Private/GroupedSignalConnectionPrivate";
import { GroupedSignalPrivate } from "../Private/GroupedSignalPrivate";

export type GroupedSignalConnectionsMap<M extends Record<string, any[]>> = {
    get<K extends keyof M>(key: K): Set<GroupedSignalConnection<M, K>> | undefined;
    set<K extends keyof M>(key: K, value: Set<GroupedSignalConnection<M, K>>): GroupedSignalConnectionsMap<M>;
    has<K extends keyof M>(key: K): boolean;
    delete<K extends keyof M>(key: K): boolean;
};

export class GroupedSignal<M extends Record<string, any[]>> {
    private _private: GroupedSignalPrivate<M>;
    constructor() {
        this._private = new GroupedSignalPrivate(this);
    }

    public fire<K extends keyof M>(name: K, ...args: M[K]) {
        const list = this._private.connections.get(name);
        if(list == null)
            return;
        for(const con of [ ...list ]) {
            GroupedSignalConnectionPrivate.get(con)!.callback(...args);
        }
    }

    public connect<K extends keyof M>(
        name: K,
        callback: (...args: M[K]) => void,
        ...args: (GroupedSignalConnectionSettings<M[K]> | EventOwner | null)[]
    ): GroupedSignalConnection<M, K> {
        return new GroupedSignalConnection(this, name, callback, ...args);
    }

    public once<K extends keyof M>(
        name: K,
        callback: (...args: M[K]) => void,
        ...args: (GroupedSignalConnectionSettings<M[K]> | EventOwner | null)[]
    ): GroupedSignalConnection<M, K> {
        if(args[0] == null || args[0] instanceof EventOwner)
            args.unshift({});
        const settings = (args[0]! as GroupedSignalConnectionSettings<M[K]>);
        settings.once = true;
        return this.connect(name, callback, ...args);
    }

    public handle<K extends keyof M>(
        name: K,
        callback: (...args: M[K]) => void,
        args0: M[K],
        ...args: (GroupedSignalConnectionSettings<M[K]> | EventOwner | null)[]
    ): GroupedSignalConnection<M, K> {
        if(args[0] == null || args[0] instanceof EventOwner)
            args.unshift({});
        const settings = (args[0]! as GroupedSignalConnectionSettings<M[K]>);
        settings.initArgs = args0;
        return this.connect(name, callback, ...args);
    }

    public handleOnce<K extends keyof M>(
        name: K,
        callback: (...args: M[K]) => void,
        args0: M[K],
        ...args: (GroupedSignalConnectionSettings<M[K]> | EventOwner | null)[]
    ): GroupedSignalConnection<M, K> {
        if(args[0] == null || args[0] instanceof EventOwner)
            args.unshift({});
        const settings = (args[0]! as GroupedSignalConnectionSettings<M[K]>);
        settings.initArgs = args0;
        settings.once = true;
        return this.connect(name, callback, ...args);
    }
}