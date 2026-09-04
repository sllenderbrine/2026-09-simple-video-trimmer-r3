import { HtmlConnection } from "../../../shared/EventSignals/HtmlConnection.js";
import { Signal } from "../../../shared/EventSignals/Signal.js";

export abstract class WindowKeypresses {
    static keys: { [key: string]: boolean } = {};
    static keyDownEvent: Signal<[e: KeyboardEvent]> = new Signal();
    static keyUpEvent: Signal<[e: KeyboardEvent]> = new Signal();
    constructor() {

    }

    static isKeyDown(name: string): boolean {
        return this.keys[name] ?? false;
    }
}

new HtmlConnection(window, "keydown", (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    WindowKeypresses.keys[key] = true;
    WindowKeypresses.keyDownEvent.fire(e);
}, { owners: null, });
new HtmlConnection(window, "keyup", (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    delete WindowKeypresses.keys[key];
    WindowKeypresses.keyUpEvent.fire(e);
}, { owners: null, });