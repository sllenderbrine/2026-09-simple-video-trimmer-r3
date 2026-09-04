import { Connection, ConnectionOptions } from "./Connection.js";

export class Signal<T extends any[]> {
    connections: Connection<T>[] = [];
    onDisconnect?: (conn: Connection<T>) => void;
    constructor() {

    }

    connect(callback: (...args: T) => void, options: ConnectionOptions<T>): Connection<T> {
        const conn = new Connection(this, callback, options);
        return conn;
    }

    fire(...args: T) {
        for(const conn of [...this.connections]) {
            conn.callback(...args);
        }
    }

    disconnectAll() {
        for(const conn of [...this.connections]) {
            conn.disconnect();
        }
    }
}