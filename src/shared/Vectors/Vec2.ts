export class Vec2 {
    constructor(public x: number, public y: number) {
 
    }
    //// Constructors ////
    static zero(out?: Vec2): Vec2 {
        if(out === undefined)
            return new Vec2(0, 0);
        out.x = 0;
        out.y = 0;
        return out;
    }
    static copy(other: Vec2, out: Vec2 = Vec2.zero()): Vec2 {
        out.x = other.x;
        out.y = other.y;
        return out;
    }
    static fromComponents(x: number, y: number, out: Vec2 = Vec2.zero()): Vec2 {
        out.x = x;
        out.y = y;
        return out;
    }
    static fromScalar(s: number, out: Vec2 = Vec2.zero()): Vec2 {
        return Vec2.fromComponents(s, s, out);
    }
    static fromArray(arr: [number, number], out: Vec2 = Vec2.zero()): Vec2 {
        return Vec2.fromComponents(arr[0], arr[1], out);
    }
    static fromRandomUnit(out: Vec2 = Vec2.zero()): Vec2 {
        const a = Math.random() * 2 * Math.PI;
        return Vec2.fromComponents(Math.cos(a), Math.sin(a), out);
    }
    //// Constants ////
    static ZERO = Object.freeze(Vec2.fromScalar(0));
    static ONE = Object.freeze(Vec2.fromScalar(1));
    static X_AXIS = Object.freeze(Vec2.fromComponents(1, 0));
    static Y_AXIS = Object.freeze(Vec2.fromComponents(0, 1));
    static NX_AXIS = Object.freeze(Vec2.negate(Vec2.X_AXIS));
    static NY_AXIS = Object.freeze(Vec2.negate(Vec2.Y_AXIS));
    static UP = Object.freeze(Vec2.fromComponents(0, 1));
    static RIGHT = Object.freeze(Vec2.fromComponents(1, 0));
    static DOWN = Object.freeze(Vec2.negate(Vec2.UP));
    static LEFT = Object.freeze(Vec2.negate(Vec2.RIGHT));
    //// Conversions ////
    static clone(a: Vec2): Vec2 {
        return Vec2.copy(a);
    }
    static toArray(a: Vec2): [number, number] {
        return [a.x, a.y];
    }
    static toString(a: Vec2): string {
        return `<${a.x}, ${a.y}>`;
    }
    static toKeyString(a: Vec2): string {
        return a.x + " " + a.y;
    }
    //// Calculations ////
    static getLengthSq(a: Vec2): number {
        return a.x * a.x + a.y * a.y;
    }
    static getLength(a: Vec2): number {
        return Math.sqrt(a.x * a.x + a.y * a.y);
    }
    static getRoll(a: Vec2): number {
        return Math.atan2(a.y, a.x);
    }
    static getIsClose(a: Vec2, b: Vec2, e = 1e-6) {
        return Math.abs(a.x - b.x) < e && Math.abs(a.y - b.y) < e;
    }
    static getIsZero(a: Vec2, e = 1e-6) {
        return Math.abs(a.x) < e && Math.abs(a.y) < e;
    }
    static getIsNaN(a: Vec2) {
        return Number.isNaN(a.x) || Number.isNaN(a.y);
    }
    static getIsFinite(a: Vec2) {
        return Number.isFinite(a.x) && Number.isFinite(a.y);
    }
    static getDistSq(a: Vec2, b: Vec2): number {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        return dx * dx + dy * dy;
    }
    static getDist(a: Vec2, b: Vec2): number {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    static getDot(a: Vec2, b: Vec2): number {
        return a.x * b.x + a.y * b.y;
    }
    static getAngle(a: Vec2, b: Vec2): number {
        const d = Math.sqrt(Vec2.getLengthSq(a) * Vec2.getDot(b, b));
        if(d === 0) return 0;
        return Math.acos(Math.min(Math.max(Vec2.getDot(a, b) / d, -1), 1));
    }
    static strictEquals(a: Vec2, b: Vec2): boolean {
        return a.x === b.x && a.y === b.y;
    }
    //// Operations ////
    static add(a: Vec2, b: Vec2, out: Vec2 = Vec2.zero()): Vec2 {
        out.x = a.x + b.x;
        out.y = a.y + b.y;
        return out;
    }
    static addScalar(a: Vec2, s: number, out: Vec2 = Vec2.zero()): Vec2 {
        out.x = a.x + s;
        out.y = a.y + s;
        return out;
    }
    static addScaled(a: Vec2, b: Vec2, t: number, out: Vec2 = Vec2.zero()): Vec2 {
        out.x = a.x + b.x * t;
        out.y = a.y + b.y * t;
        return out;
    }
    static sub(a: Vec2, b: Vec2, out: Vec2 = Vec2.zero()): Vec2 {
        out.x = a.x - b.x;
        out.y = a.y - b.y;
        return out;
    }
    static subScalar(a: Vec2, s: number, out: Vec2 = Vec2.zero()): Vec2 {
        out.x = a.x - s;
        out.y = a.y - s;
        return out;
    }
    static rsubScalar(a: Vec2, s: number, out: Vec2 = Vec2.zero()): Vec2 {
        out.x = s - a.x;
        out.y = s - a.y;
        return out;
    }
    static mul(a: Vec2, b: Vec2, out: Vec2 = Vec2.zero()): Vec2 {
        out.x = a.x * b.x;
        out.y = a.y * b.y;
        return out;
    }
    static mulScalar(a: Vec2, s: number, out: Vec2 = Vec2.zero()): Vec2 {
        out.x = a.x * s;
        out.y = a.y * s;
        return out;
    }
    static div(a: Vec2, b: Vec2, out: Vec2 = Vec2.zero()): Vec2 {
        out.x = a.x / b.x;
        out.y = a.y / b.y;
        return out;
    }
    static divScalar(a: Vec2, s: number, out: Vec2 = Vec2.zero()): Vec2 {
        out.x = a.x / s;
        out.y = a.y / s;
        return out;
    }
    static rdivScalar(a: Vec2, s: number, out: Vec2 = Vec2.zero()): Vec2 {
        out.x = s / a.x;
        out.y = s / a.y;
        return out;
    }
    static negate(a: Vec2, out: Vec2 = Vec2.zero()): Vec2 {
        out.x = -a.x;
        out.y = -a.y;
        return out;
    }
    static norm(a: Vec2, out: Vec2 = Vec2.zero()): Vec2 {
        const len = Vec2.getLength(a);
        if(len === 0) return Vec2.copy(a, out);
        out.x = a.x / len;
        out.y = a.y / len;
        return out;
    }
    static lerp(a: Vec2, b: Vec2, t: number, out: Vec2 = Vec2.zero()): Vec2 {
        out.x = a.x + (b.x - a.x) * t;
        out.y = a.y + (b.y - a.y) * t;
        return out;
    }
    static lerpClamped(a: Vec2, b: Vec2, t: number, out: Vec2 = Vec2.zero()): Vec2 {
        t = Math.min(Math.max(t, 0), 1);
        out.x = a.x + (b.x - a.x) * t;
        out.y = a.y + (b.y - a.y) * t;
        return out;
    }
    static look(a: Vec2, b: Vec2, out: Vec2 = Vec2.zero()): Vec2 {
        return Vec2.norm(Vec2.sub(b, a, out), out);
    }
    static rescale(a: Vec2, s: number, out: Vec2 = Vec2.zero()): Vec2 {
        return Vec2.mulScalar(Vec2.norm(a, out), s, out);
    }
    static map(a: Vec2, callback: (v: number, i: number) => number, out: Vec2 = Vec2.zero()): Vec2 {
        out.x = callback(a.x, 0);
        out.y = callback(a.y, 1);
        return out;
    }
    static floor(a: Vec2, out: Vec2 = Vec2.zero()): Vec2 {
        out.x = Math.floor(a.x);
        out.y = Math.floor(a.y);
        return out;
    }
    static round(a: Vec2, out: Vec2 = Vec2.zero()): Vec2 {
        out.x = Math.round(a.x);
        out.y = Math.round(a.y);
        return out;
    }
    static ceil(a: Vec2, out: Vec2 = Vec2.zero()): Vec2 {
        out.x = Math.ceil(a.x);
        out.y = Math.ceil(a.y);
        return out;
    }
    static addScaledTargetDot(a: Vec2, b: Vec2, target: number, out: Vec2 = Vec2.zero()): Vec2 {
        const d = Vec2.getLengthSq(b);
        if(d === 0) return Vec2.copy(b, out);
        const t = (target - Vec2.getDot(a, b)) / d;
        out.x = a.x + b.x * t;
        out.y = a.y + b.y * t;
        return out;
    }
    static clampLength(a: Vec2, min: number, max: number, out: Vec2 = Vec2.zero()): Vec2 {
        const len = Vec2.getLength(a);
        if(len < min) return Vec2.rescale(a, min, out);
        else if(len > max) return Vec2.rescale(a, max, out);
        return Vec2.copy(a, out);
    }
    static applyMatrix(a: Vec2, b: Float32Array, out: Vec2 = Vec2.zero()): Vec2 {
        const x = a.x;
        const y = a.y;
        out.x = b[0]!*x + b[3]!*y + b[6]!;
        out.y = b[1]!*x + b[4]!*y + b[7]!;
        return out;
    }
    static applyProjection(a: Vec2, b: Float32Array, out: Vec2 = Vec2.zero()): Vec2 {
        const x = a.x;
        const y = a.y;
        const w = b[2]! * x + b[5]! * y + b[8]!;
        out.x = (b[0]!*x + b[3]!*y + b[6]!) / w;
        out.y = (b[1]!*x + b[4]!*y + b[7]!) / w;
        return out;
    }
    static rotate(a: Vec2, t: number, out: Vec2 = Vec2.zero()): Vec2 {
        const s = Math.sin(t);
        const c = Math.cos(t);
        return Vec2.fromComponents(
            a.x * c - a.y * s,
            a.x * s + a.y * c,
            out
        );
    }
    //// Non-static constructors ////
    zero() {
        return Vec2.zero(this);
    }
    copy(other: Vec2) {
        return Vec2.copy(other, this);
    }
    fromComponents(x: number, y: number) {
        return Vec2.fromComponents(x, y, this);
    }
    fromScalar(s: number) {
        return Vec2.fromScalar(s, this);
    }
    fromArray(arr: [number, number]) {
        return Vec2.fromArray(arr, this);
    }
    fromRandomUnit() {
        return Vec2.fromRandomUnit(this);
    }
    //// Non-static conversions ////
    clone(out?: Vec2) {
        return Vec2.copy(this, out);
    }
    toArray() {
        return Vec2.toArray(this);
    }
    toString() {
        return Vec2.toString(this);
    }
    toKeyString() {
        return Vec2.toKeyString(this);
    }
    //// Non-static calculations ////
    lengthSq() {
        return Vec2.getLengthSq(this);
    }
    length() {
        return Vec2.getLength(this);
    }
    roll() {
        return Vec2.getRoll(this);
    }
    isClose(other: Vec2, e = 1e-6) {
        return Vec2.getIsClose(this, other, e);
    }
    isZero(e = 1e-6) {
        return Vec2.getIsZero(this, e);
    }
    isNaN() {
        return Vec2.getIsNaN(this);
    }
    isFinite() {
        return Vec2.getIsFinite(this);
    }
    distSq(other: Vec2) {
        return Vec2.getDistSq(this, other);
    }
    dist(other: Vec2) {
        return Vec2.getDist(this, other);
    }
    dot(other: Vec2) {
        return Vec2.getDot(this, other);
    }
    angle(other: Vec2) {
        return Vec2.getAngle(this, other);
    }
    strictEquals(other: Vec2) {
        return Vec2.strictEquals(this, other);
    }
    //// Non-static operations ////
    add(other: Vec2, out?: Vec2) {
        return Vec2.add(this, other, out);
    }
    addScalar(s: number, out?: Vec2) {
        return Vec2.addScalar(this, s, out);
    }
    addScaled(other: Vec2, s: number, out?: Vec2) {
        return Vec2.addScaled(this, other, s, out);
    }
    sub(other: Vec2, out?: Vec2) {
        return Vec2.sub(this, other, out);
    }
    subScalar(s: number, out?: Vec2) {
        return Vec2.subScalar(this, s, out);
    }
    rsub(other: Vec2, out?: Vec2) {
        return Vec2.sub(other, this, out);
    }
    rsubScalar(s: number, out?: Vec2) {
        return Vec2.rsubScalar(this, s, out);
    }
    mul(other: Vec2, out?: Vec2) {
        return Vec2.mul(this, other, out);
    }
    mulScalar(s: number, out?: Vec2) {
        return Vec2.mulScalar(this, s, out);
    }
    div(other: Vec2, out?: Vec2) {
        return Vec2.div(this, other, out);
    }
    divScalar(s: number, out?: Vec2) {
        return Vec2.divScalar(this, s, out);
    }
    rdiv(other: Vec2, out?: Vec2) {
        return Vec2.div(other, this, out);
    }
    rdivScalar(s: number, out?: Vec2) {
        return Vec2.rdivScalar(this, s, out);
    }
    negate(out?: Vec2) {
        return Vec2.negate(this, out);
    }
    norm(out?: Vec2) {
        return Vec2.norm(this, out);
    }
    lerp(other: Vec2, t: number, out?: Vec2) {
        return Vec2.lerp(this, other, t, out);
    }
    lerpClamped(other: Vec2, t: number, out?: Vec2) {
        return Vec2.lerpClamped(this, other, t, out);
    }
    look(other: Vec2, out?: Vec2) {
        return Vec2.look(this, other, out);
    }
    rescale(s: number, out?: Vec2) {
        return Vec2.rescale(this, s, out);
    }
    map(callback: (v: number, i: number) => number, out?: Vec2) {
        return Vec2.map(this, callback, out);
    }
    floor(out?: Vec2) {
        return Vec2.floor(this, out);
    }
    round(out?: Vec2) {
        return Vec2.round(this, out);
    }
    ceil(out?: Vec2) {
        return Vec2.ceil(this, out);
    }
    addScaledTargetDot(other: Vec2, target: number, out?: Vec2) {
        return Vec2.addScaledTargetDot(this, other, target, out);
    }
    clampLength(min: number, max: number, out?: Vec2) {
        return Vec2.clampLength(this, min, max, out);
    }
    applyMatrix(m: Float32Array, out?: Vec2) {
        return Vec2.applyMatrix(this, m, out);
    }
    applyProjection(m: Float32Array, out?: Vec2) {
        return Vec2.applyProjection(this, m, out);
    }
    rotate(t: number, out?: Vec2) {
        return Vec2.rotate(this, t, out);
    }
    //// Non-static self-operations ////
    addSelf(other: Vec2) {
        return Vec2.add(this, other, this);
    }
    addScalarSelf(s: number) {
        return Vec2.addScalar(this, s, this);
    }
    addScaledSelf(other: Vec2, s: number) {
        return Vec2.addScaled(this, other, s, this);
    }
    subSelf(other: Vec2) {
        return Vec2.sub(this, other, this);
    }
    subScalarSelf(s: number) {
        return Vec2.subScalar(this, s, this);
    }
    rsubSelf(other: Vec2) {
        return Vec2.sub(other, this, this);
    }
    rsubScalarSelf(s: number) {
        return Vec2.rsubScalar(this, s, this);
    }
    mulSelf(other: Vec2) {
        return Vec2.mul(this, other, this);
    }
    mulScalarSelf(s: number) {
        return Vec2.mulScalar(this, s, this);
    }
    divSelf(other: Vec2) {
        return Vec2.div(this, other, this);
    }
    divScalarSelf(s: number) {
        return Vec2.divScalar(this, s, this);
    }
    rdivSelf(other: Vec2) {
        return Vec2.div(other, this, this);
    }
    rdivScalarSelf(s: number) {
        return Vec2.rdivScalar(this, s, this);
    }
    negateSelf() {
        return Vec2.negate(this, this);
    }
    normSelf() {
        return Vec2.norm(this, this);
    }
    lerpSelf(other: Vec2, t: number) {
        return Vec2.lerp(this, other, t, this);
    }
    lerpClampedSelf(other: Vec2, t: number) {
        return Vec2.lerpClamped(this, other, t, this);
    }
    lookSelf(other: Vec2) {
        return Vec2.look(this, other, this);
    }
    rescaleSelf(s: number) {
        return Vec2.rescale(this, s, this);
    }
    mapSelf(callback: (v: number, i: number) => number) {
        return Vec2.map(this, callback, this);
    }
    floorSelf() {
        return Vec2.floor(this, this);
    }
    roundSelf() {
        return Vec2.round(this, this);
    }
    ceilSelf() {
        return Vec2.ceil(this, this);
    }
    addScaledTargetDotSelf(other: Vec2, target: number) {
        return Vec2.addScaledTargetDot(this, other, target, this);
    }
    clampLengthSelf(min: number, max: number) {
        return Vec2.clampLength(this, min, max, this);
    }
    applyMatrixSelf(m: Float32Array) {
        return Vec2.applyMatrix(this, m, this);
    }
    applyProjectionSelf(m: Float32Array) {
        return Vec2.applyProjection(this, m, this);
    }
    rotateSelf(t: number) {
        return Vec2.rotate(this, t, this);
    }
}