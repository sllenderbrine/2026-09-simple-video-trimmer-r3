import { EventOwner } from "./EventOwner";
import { EventOwnerPrivate } from "../Private/EventOwnerPrivate";
import { HtmlListenerPrivate } from "../Private/HtmlListenerPrivate";

export interface HtmlListenerSettings<T extends HtmlEventMapElement, K extends keyof HtmlEventMap<T>> {
    initArgs?: HtmlEventMap<T>[K],
    owners?: EventOwner[] | null,
    once?: boolean,
}

export type HtmlEventMapElement = Window | Document | HTMLVideoElement | HTMLElement;

export type HtmlEventMap<T> =
    T extends Window ? WindowEventMap :
    T extends Document ? DocumentEventMap :
    T extends HTMLVideoElement ? HTMLVideoElementEventMap :
    T extends HTMLElement ? HTMLElementEventMap :
    never;

/**
 * A single-callback event that triggers after a specified timeout.
 */
export class HtmlListener<T extends HtmlEventMapElement, K extends keyof HtmlEventMap<T>> {
    private _private: HtmlListenerPrivate<T, K>;
    constructor(
        element: T,
        name: K,
        callback: (this: T, ev: HtmlEventMap<T>[K]) => any,
        ...args: (HtmlListenerSettings<T, K> | EventOwner | null)[]
    ) {
        this._private = new HtmlListenerPrivate(this, element, name, callback, ...args);
    }

    public isConnected() {
        return !this._private.disconnected;
    }

    /**
     * Disables this timeout event and removes it from any associated event owners.
     */
    public disconnect(): void {
        this._private.disconnected = true;
        this._private.element.removeEventListener(this._private.name as string, this._private.callback as any);
        for(const v of this._private.owners) {
            EventOwnerPrivate.get(v)!.resources.delete(this);
        }
        this._private.owners.clear();
    }
}