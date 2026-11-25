import { GroupedSignalConnectionsMap } from "../Public/GroupedSignal";

const privateMap = new WeakMap<any, GroupedSignalPrivate<any>>();

export class GroupedSignalPrivate<M extends Record<string, any[]>> {
    public connections: GroupedSignalConnectionsMap<M> = new Map();
        
    constructor(obj: any) {
        privateMap.set(obj, this);
    }

    public static get(obj: any) {
        return privateMap.get(obj);
    }
}