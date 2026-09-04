import type { ConnectionOwner } from "./ConnectionOwner.js";
import type { Signal } from "./Signal.js";

export type ConnectionOptions<T extends any[]> = {
    owners?: ConnectionOwner[] | null;
    initArgs?: T,
    once?: boolean,
}

export class Connection<T extends any[]> {
    owners: ConnectionOwner[] = [];
    disconnected = false;
    constructor(
        public signal: Signal<T>,
        public callback: ((...args: T) => void),
        options: ConnectionOptions<T>,
    ) {
        signal.connections.push(this);
        if(options.owners != null) {
            for(const owner of options.owners) {
                owner.connections.push(this);
                this.owners.push(owner);
            }
        }
        if(options.owners === undefined) {
            const err = new Error();
            const stackLines = err.stack ? err.stack.split("\n") : [];
            const callerFrame = (stackLines[3] || "").trim();
            console.warn("Warning: Connection created without any connection owners. Set parameter to null or [] to silence.\n" + callerFrame);
        }
        if(options.once === true) {
            const callback = this.callback;
            this.callback = (...args: T) => {
                callback(...args);
                this.disconnect();
            }
        }
        if(options.initArgs != null) {
            this.callback(...options.initArgs);
        }
    }

    disconnect() {
        if(this.disconnected)
            return;
        this.disconnected = true;
        const signalIndex = this.signal.connections.indexOf(this);
        if(signalIndex != -1) {
            this.signal.connections.splice(signalIndex, 1);
            if(this.signal.onDisconnect)
                this.signal.onDisconnect(this);
        }
        for(const owner of [...this.owners]) {
            const ownerIndex = owner.connections.indexOf(this);
            if(ownerIndex != -1) {
                owner.connections.splice(ownerIndex, 1);
            }
        }
        this.owners = [];
    }
}