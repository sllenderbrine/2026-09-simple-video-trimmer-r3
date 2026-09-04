import { ConnectionOwner } from "../EventSignals/ConnectionOwner.js";
import { HtmlConnection } from "../EventSignals/HtmlConnection.js";
import { ObservedValue } from "../EventSignals/ObservedValue.js";
import { delay } from "./PromiseUtility.js";

export function maintainAspectFitContain(
    containerWidth: number,
    containerHeight: number,
    aspectRatio: number,
): [number, number] {
    const cAspect = containerWidth / containerHeight;
    if(aspectRatio > cAspect) {
        return [
            containerWidth,
            containerWidth / aspectRatio,
        ];
    } else {
        return [
            containerHeight * aspectRatio,
            containerHeight,
        ];
    }
}

export function maintainAspectFitCover(
    containerWidth: number,
    containerHeight: number,
    aspectRatio: number,
): [number, number] {
    const cAspect = containerWidth / containerHeight;
    if(aspectRatio > cAspect) {
        return [
            containerHeight * aspectRatio,
            containerHeight,
        ];
    } else {
        return [
            containerWidth,
            containerWidth / aspectRatio,
        ];
    }
}
export function maintainAspectCropContain(
    sourceWidth: number,
    sourceHeight: number,
    aspectRatio: number,
): [number, number] {
    const sAspect = sourceWidth / sourceHeight;
    if(aspectRatio > sAspect) {
        return [
            sourceHeight * aspectRatio,
            sourceHeight,
        ];
    } else {
        return [
            sourceWidth,
            sourceWidth / aspectRatio,
        ];
    }
}

export function maintainAspectCropCover(
    sourceWidth: number,
    sourceHeight: number,
    aspectRatio: number,
): [number, number] {
    const sAspect = sourceWidth / sourceHeight;
    if(aspectRatio > sAspect) {
        return [
            sourceWidth,
            sourceWidth / aspectRatio,
        ];
    } else {
        return [
            sourceHeight * aspectRatio,
            sourceHeight,
        ];
    }
}

export async function waitForHtmlEvent(
    el: Element,
    events: string | string[],
    predicate?: null | ((...args: any) => boolean),
    after?: null | (() => void),
    before?: null | (() => void),
) {
    await new Promise<void>(res => {
        if(before)
            before();
        const connections = new ConnectionOwner();
        if(!Array.isArray(events))
            events = [events];
        for(let eventName of events) {
            new HtmlConnection(el, eventName, (...args: any[]) => {
                if(predicate == null || predicate(...args)) {
                    connections.disconnectAll();
                    res();
                }
            }, { owners: [ connections, ], });
        }
        if(after)
            after();
    });
}

export class BusyProcess<T extends any > {
    private _active: boolean = false;
    private _activeNext: boolean = false;
    private _activeNextValue: T | null = null;
    private _value: T | null = null;
    constructor() {

    }

    getValue(): T | null {
        return this._value;
    }

    setActive(v: boolean) {
        this._active = v;
    }

    isActive() {
        return this._active || this._activeNext;
    }

    async waitForTurn(value: T): Promise<boolean> {
        if(this._active) {
            this._activeNextValue = value;
            if(this._activeNext)
                return false;
            this._activeNext = true;
            return await new Promise<boolean>(async res => {
                while(this._active)
                    await delay(50);
                this._activeNext = false;
                if(this._activeNextValue != null) {
                    this._value = this._activeNextValue;
                    this._activeNextValue = null;
                    return res(true)
                }
                this._activeNextValue = null;
                return res(false);
            });
        } else {
            this._value = value;
            return true;
        }
    }
}