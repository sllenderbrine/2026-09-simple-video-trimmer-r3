import type { ConnectionOwner } from "./ConnectionOwner.js";

export type HtmlConnectionOptions = {
    owners?: ConnectionOwner[] | null;
    initArgs?: any[],
    once?: boolean,
}

export class HtmlConnection {
    owners: ConnectionOwner[] = [];
    disconnected: boolean = false;
    constructor(
        public el: EventTarget,
        public eventName: string,
        public callback: any,
        options: HtmlConnectionOptions
    ) {
        el.addEventListener(eventName, callback);
        if(options.owners != null) {
            for(const owner of options.owners) {
                owner.htmlConnections.push(this);
                this.owners.push(owner);
            }
        }
        if(options.owners === undefined) {
            const err = new Error();
            const stackLines = err.stack ? err.stack.split("\n") : [];
            const callerFrame = (stackLines[2] || "").trim();
            console.warn("Warning: HtmlConnection created without any connection owners. Set parameter to null or [] to silence.\n" + callerFrame);
        }
        if(options.once === true) {
            const callback = this.callback;
            this.callback = (...args: any[]) => {
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
        this.el.removeEventListener(this.eventName, this.callback);
        for(const owner of [...this.owners]) {
            const ownerIndex = owner.htmlConnections.indexOf(this);
            if(ownerIndex != -1) {
                owner.htmlConnections.splice(ownerIndex, 1);
            }
        }
        this.owners = [];
    }
}