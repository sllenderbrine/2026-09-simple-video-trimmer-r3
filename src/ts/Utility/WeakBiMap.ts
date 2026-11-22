/**
 * A single entry in the WeakBiMap, containing weak references to both paired values.
 */
export interface WeakBiMapEntry<T1 extends object, T2 extends object> {
    a: WeakRef<T1 | T2>;
    b: WeakRef<T1 | T2>;
    token: {};
    removed: boolean;
}

/**
 * A bidirectional map using weak references. Garbage collection removes entries automatically.
 * @example
 * const map = new WeakBiMap<object, object>();
 * const a = {};
 * const b = {};
 * map.join(a, b);
 * 
 * console.log(map.get(a) === b); // true
 * console.log(map.get(b) === a); // true
 * console.log(map.size); // 1
 * 
 * map.remove(a);
 * 
 * console.log(map.get(a)); // undefined
 * console.log(map.get(b)); // undefined
 * console.log(map.size); // 0
 */
export class WeakBiMap<T1 extends object, T2 extends object> {
    private _map = new WeakMap<T1 | T2, WeakBiMapEntry<T1, T2>>();
    private _registry = new FinalizationRegistry<WeakBiMapEntry<T1, T2>>((entry) => {
        if(entry.removed)
            return;
        entry.removed = true;
        this._size--;
        const aV = entry.a.deref();
        const bV = entry.b.deref();
        if(aV != null) this._map.delete(aV);
        if(bV != null) this._map.delete(bV);
        this._registry.unregister(entry.token);
    });
    private _size: number = 0;
    constructor() {

    }

    public get size() {
        return this._size;
    }

    public join(a: T1, b: T2): void;
    public join(a: T2, b: T1): void;
    public join(a: T1 | T2, b: T1 | T2) {
        this.remove(a);
        this.remove(b);
        const entry: WeakBiMapEntry<T1, T2> = { a: new WeakRef(a), b: new WeakRef(b), token: {}, removed: false };
        this._map.set(a, entry);
        this._map.set(b, entry);
        this._registry.register(a, entry, entry.token);
        this._registry.register(b, entry, entry.token);
        this._size++;
    }

    public get(v: T1): T2 | undefined;
    public get(v: T2): T1 | undefined;
    public get(v: T1 | T2): T1 | T2 | undefined;
    public get(v: T1 | T2): T1 | T2 | undefined {
        const pair = this._map.get(v);
        if(pair == null)
            return;
        const aV = pair.a.deref();
        return aV === v ? pair.b.deref() : aV;
    }

    public has(v: T1 | T2): boolean {
        return this._map.has(v);
    }

    public remove(v: T1 | T2): void {
        const entry = this._map.get(v);
        if(entry == null)
            return;
        if(entry.removed)
            return;
        entry.removed = true;
        this._size--;
        const aV = entry.a.deref();
        const bV = entry.b.deref();
        if(aV != null) this._map.delete(aV);
        if(bV != null) this._map.delete(bV);
        this._registry.unregister(entry.token);
    }
}