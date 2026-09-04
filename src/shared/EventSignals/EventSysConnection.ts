import { ConnectionOwner } from "./ConnectionOwner.js";
import { EventSystem } from "./EventSystem.js";

export type EventSysConnectionOptions<T extends any[]> = {
    owners?: ConnectionOwner[] | null;
    initArgs?: T,
    once?: boolean,
}

export class EventSysConnection<T extends any[]> {
    owners: ConnectionOwner[] = [];
    disconnected = false;
    constructor(
        public sys: EventSystem<T>,
        public evName: string,
        public callback: ((...args: T) => void),
        options: EventSysConnectionOptions<T>,
    ) {
        if(options.owners != null) {
            for(const owner of options.owners) {
                owner.eventSysConnections.push(this);
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
        
        let event: EventSysConnection<T>[] | undefined = sys.events[evName];
        if(event == null) {
            event = [];
            sys.events[evName] = event;
        }
        event.push(this);
    }

    disconnect() {
        if(this.disconnected)
            return;
        this.disconnected = true;
        let event = this.sys.events[this.evName];
        if(event != null) {
            const eventIndex = event.indexOf(this);
            if(eventIndex != -1) {
                event.splice(eventIndex, 1);
                if(event.length == 0) {
                    delete this.sys.events[this.evName];
                }
            }
        }
        for(const owner of [...this.owners]) {
            const ownerIndex = owner.eventSysConnections.indexOf(this);
            if(ownerIndex != -1) {
                owner.eventSysConnections.splice(ownerIndex, 1);
            }
        }
        this.owners = [];
    }
}