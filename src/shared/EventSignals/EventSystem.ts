import { EventSysConnection, EventSysConnectionOptions } from "./EventSysConnection.js";

export class EventSystem<T extends any[]> {
    events: { [key: string]: EventSysConnection<T>[] } = {};
    constructor() {

    }

    fire(name: string, ...args: T) {
        const event = this.events[name];
        if(event == null)
            return;
        for(const conn of [...event]) {
            conn.callback(...args);
        }
    }
    
    connect(name: string, callback: (...args: T) => void, options: EventSysConnectionOptions<T>): EventSysConnection<T> {
        let event = this.events[name];
        if(event == null) {
            event = [];
            this.events[name] = event;
        }
        const conn = new EventSysConnection(this, name, callback, options);
        event.push(conn);
        return conn;
    }

    disconectAllByEvent(name: string) {
        const event = this.events[name];
        if(event == null)
            return;
        for(const conn of [...event]) {
            conn.disconnect();
        }
    }

    disconnectAll() {
        for(const name in this.events) {
            this.disconectAllByEvent(name);
        }
    }
}