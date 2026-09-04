import { Connection } from "./Connection.js";
import { EventSysConnection } from "./EventSysConnection.js";
import { HtmlConnection } from "./HtmlConnection.js";

export class ConnectionOwner {
    connections: Connection<any>[] = [];
    htmlConnections: HtmlConnection[] = [];
    eventSysConnections: EventSysConnection<any>[] = [];
    constructor() {

    }

    disconnectAll() {
        for(const conn of [ ...this.connections, ...this.htmlConnections, ...this.eventSysConnections, ]) {
            conn.disconnect();
        }
    }
}