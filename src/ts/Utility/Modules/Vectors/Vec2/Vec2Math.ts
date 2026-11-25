import { Vec2 } from "./Vec2.js";

const tempVectors: Vec2Math.AnyVec2[] = [];
const tempVectorCount = 8;
let internalTempVectorIndex = 0;

for(let i=0; i<tempVectorCount; i++) {
    tempVectors.push({ x: 0, y: 0 });
}

function newTemp(): Vec2Math.AnyVec2 {
    if(++internalTempVectorIndex >= tempVectorCount) internalTempVectorIndex = 0;
    return tempVectors[internalTempVectorIndex]!;
}

export namespace Vec2Math {
    export type AnyVec2 = {
        x: number;
        y: number;
    };
    //// A
    export function abs<T extends AnyVec2 = Vec2>(v: AnyVec2, out?: T): T {
        out = (out ?? Vec2.zero()) as T;
        out.x = Math.abs(v.x);
        out.y = Math.abs(v.y);
        return out;
    }
    export function add<T extends AnyVec2 = Vec2>(a: AnyVec2, b: AnyVec2, out?: T): T {
        out = (out ?? Vec2.zero()) as T;
        out.x = a.x + b.x;
        out.y = a.y + b.y;
        return out;
    }
    export function addScalar<T extends AnyVec2 = Vec2>(a: AnyVec2, b: number, out?: T): T {
        out = (out ?? Vec2.zero()) as T;
        out.x = a.x + b;
        out.y = a.y + b;
        return out;
    }
    export function addScaled<T extends AnyVec2 = Vec2>(a: AnyVec2, b: AnyVec2, scalar: number, out?: T): T {
        out = (out ?? Vec2.zero()) as T;
        out.x = a.x + b.x * scalar;
        out.y = a.y + b.y * scalar;
        return out;
    }
    export function angle(v: AnyVec2): number {
        return Math.atan2(v.y, v.x);
    }
    export function angleBetween(a: AnyVec2, b: AnyVec2): number {
        const lenSqA = a.x * a.x + a.y * a.y;
        const lenSqB = b.x * b.x + b.y * b.y;
        if(lenSqA === 0 || lenSqB === 0) return 0;
        const dot = a.x * b.x + a.y * b.y;
        return Math.acos(Math.min(Math.max(dot / Math.sqrt(lenSqA * lenSqB), -1), 1));
    }
    export function angleOfLook(a: AnyVec2, b: AnyVec2): number {
        return Math.atan2(b.y - a.y, b.x - a.x);
    }
    export function average<T extends AnyVec2 = Vec2>(a: AnyVec2, b: AnyVec2, out?: T): T {
        out = (out ?? Vec2.zero()) as T;
        out.x = (a.x + b.x) / 2;
        out.y = (a.y + b.y) / 2;
        return out;
    }
    //// C
    export function ceil<T extends AnyVec2 = Vec2>(v: AnyVec2, out?: T): T {
        out = (out ?? Vec2.zero()) as T;
        out.x = Math.ceil(v.x);
        out.y = Math.ceil(v.y);
        return out;
    }
    /**
     * @note Expects component-wise `min <= max`
     */
    export function clampComponents<T extends AnyVec2 = Vec2>(v: AnyVec2, min: AnyVec2, max: AnyVec2, out?: T): T {
        out = (out ?? Vec2.zero()) as T;
        out.x = Math.max(min.x, Math.min(max.x, v.x));
        out.y = Math.max(min.y, Math.min(max.y, v.y));
        return out;
    }
    /**
     * @note Expects `length(min) <= length(max)`
     */
    export function clampLength<T extends AnyVec2 = Vec2>(v: AnyVec2, min: AnyVec2, max: AnyVec2, out?: T): T {
        out = (out ?? Vec2.zero()) as T;
        const len = length(v);
        if(len === 0) {
            out.x = 0;
            out.y = 0;
            return out;
        }
        rescale(v, Math.max(length(min), Math.min(length(max), len)), out);
        return out;
    }
    /**
     * @note Expects `min <= max`
     * @note Expects `min >= 0` and `max >= 0`
     */
    export function clampLengthScalar<T extends AnyVec2 = Vec2>(v: AnyVec2, min: number, max: number, out?: T): T {
        out = (out ?? Vec2.zero()) as T;
        const len = length(v);
        if(len === 0) {
            out.x = 0;
            out.y = 0;
            return out;
        }
        rescale(v, Math.max(min, Math.min(max, len)), out);
        return out;
    }
    /**
     * @note Expects `min <= max`
     */
    export function clampComponentsScalar<T extends AnyVec2 = Vec2>(v: AnyVec2, min: number, max: number, out?: T): T {
        out = (out ?? Vec2.zero()) as T;
        out.x = Math.max(min, Math.min(max, v.x));
        out.y = Math.max(min, Math.min(max, v.y));
        return out;
    }
    export function clone<T extends AnyVec2 = Vec2>(v: AnyVec2, out?: T): T {
        out = (out ?? Vec2.zero()) as T;
        out.x = v.x;
        out.y = v.y;
        return out;
    }
    /**
     * @note Expects `epsilon >= 0`
     * @param epsilon The tolerance for equivalence represented by a return value of zero (default is 1e-6)
     * */
    export function compareLength(a: AnyVec2, b: AnyVec2, epsilon: number = 1e-6): number {
        const aLen = Math.sqrt(a.x * a.x + a.y * a.y);
        const bLen = Math.sqrt(b.x * b.x + b.y * b.y);
        if(Math.abs(aLen - bLen) <= epsilon) return 0;
        return aLen - bLen;
    }
    export function componentProduct(v: AnyVec2): number {
        return v.x * v.y;
    }
    export function componentSum(v: AnyVec2): number {
        return v.x + v.y;
    }
    export function cross(a: AnyVec2, b: AnyVec2): number {
        return a.x * b.y - a.y * b.x;
    }
    //// D
    export function dist(a: AnyVec2, b: AnyVec2): number {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    export function distSq(a: AnyVec2, b: AnyVec2): number {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        return dx * dx + dy * dy;
    }
    export function div<T extends AnyVec2 = Vec2>(a: AnyVec2, b: AnyVec2, out?: T): T {
        out = (out ?? Vec2.zero()) as T;
        out.x = a.x / b.x;
        out.y = a.y / b.y;
        return out;
    }
    export function divScalar<T extends AnyVec2 = Vec2>(a: AnyVec2, b: number, out?: T): T {
        out = (out ?? Vec2.zero()) as T;
        out.x = a.x / b;
        out.y = a.y / b;
        return out;
    }
    export function dot(a: AnyVec2, b: AnyVec2): number {
        return a.x * b.x + a.y * b.y;
    }
    //// F
    export function floor<T extends AnyVec2 = Vec2>(v: AnyVec2, out?: T): T {
        out = (out ?? Vec2.zero()) as T;
        out.x = Math.floor(v.x);
        out.y = Math.floor(v.y);
        return out;
    }
    export function forEach<T extends AnyVec2 = Vec2>(a: T, callback: (value: number, index: number, vector: T) => void): T {
        callback(a.x, 0, a);
        callback(a.y, 1, a);
        return a;
    }
    export function fract<T extends AnyVec2 = Vec2>(v: AnyVec2, out?: T): T {
        out = (out ?? Vec2.zero()) as T;
        out.x = v.x - Math.floor(v.x);
        out.y = v.y - Math.floor(v.y);
        return out;
    }
    export function fromAngle<T extends AnyVec2 = Vec2>(angle: number, length: number, out?: T): T {
        out = (out ?? Vec2.zero()) as T;
        out.x = Math.cos(angle) * length;
        out.y = Math.sin(angle) * length;
        return out;
    }
    export function fromArray<T extends AnyVec2 = Vec2>(arr: [number, number], out?: T): T {
        out = (out ?? Vec2.zero()) as T;
        out.x = arr[0];
        out.y = arr[1];
        return out;
    }
    export function fromObject<T extends AnyVec2 = Vec2>(obj: { x: number, y: number }, out?: T): T {
        out = (out ?? Vec2.zero()) as T;
        out.x = obj.x;
        out.y = obj.y;
        return out;
    }
    //// I
    export function isEqual(a: AnyVec2, b: AnyVec2): boolean {
        return a.x === b.x && a.y === b.y;
    }
    export function isEqualScalar(a: AnyVec2, scalar: number): boolean {
        return a.x === scalar && a.y === scalar;
    }
    export function isFinite(a: AnyVec2): boolean {
        return Number.isFinite(a.x) && Number.isFinite(a.y);
    }
    export function isGreaterThan(a: AnyVec2, b: AnyVec2): boolean {
        return a.x > b.x && a.y > b.y;
    }
    export function isGreaterThanScalar(a: AnyVec2, scalar: number): boolean {
        return a.x > scalar && a.y > scalar;
    }
    export function isInteger(a: AnyVec2): boolean {
        return Number.isInteger(a.x) && Number.isInteger(a.y);
    }
    export function isLessThan(a: AnyVec2, b: AnyVec2): boolean {
        return a.x < b.x && a.y < b.y;
    }
    export function isLessThanScalar(a: AnyVec2, scalar: number): boolean {
        return a.x < scalar && a.y < scalar;
    }
    export function isParallel(a: AnyVec2, b: AnyVec2, epsilon: number = 1e-6): boolean {
        if(isZero(a) || isZero(b))
            return false;
        a = norm(a, newTemp());
        b = norm(b, newTemp());
        return Math.abs(dot(a, b)) >= 1 - epsilon;
    }
    export function isPerpendicular(a: AnyVec2, b: AnyVec2, epsilon: number = 1e-6): boolean {
        if(isZero(a) || isZero(b))
            return false;
        a = norm(a, newTemp());
        b = norm(b, newTemp());
        return Math.abs(dot(a, b)) <= epsilon;
    }
    export function isNaN(a: AnyVec2): boolean {
        return Number.isNaN(a.x) || Number.isNaN(a.y);
    }
    /**
     * ⚠️ Expects `epsilon` >= 0
     * @param epsilon The tolerance for similarity (default is 1e-6)
     * */
    export function isSimilar(a: AnyVec2, b: AnyVec2, epsilon: number = 1e-6): boolean {
        return Math.abs(a.x - b.x) <= epsilon && Math.abs(a.y - b.y) <= epsilon;
    }
    /**
     * ⚠️ Expects `epsilon` >= 0
     * @param epsilon The tolerance for similarity (default is 1e-6)
     * */
    export function isSimilarScalar(a: AnyVec2, scalar: number, epsilon: number = 1e-6): boolean {
        return Math.abs(a.x - scalar) <= epsilon && Math.abs(a.y - scalar) <= epsilon;
    }
    /**
     * ⚠️ Expects `epsilon` >= 0
     * @param epsilon The tolerance for similarity (default is 1e-6)
     * */
    export function isSimilarZero(a: AnyVec2, epsilon: number = 1e-6): boolean {
        return Math.abs(a.x) <= epsilon && Math.abs(a.y) <= epsilon;
    }
    export function isUnit(v: AnyVec2, epsilon: number = 1e-6): boolean {
        const len = Math.sqrt(v.x * v.x + v.y * v.y);
        return Math.abs(len - 1) <= epsilon;
    }
    export function isZero(a: AnyVec2): boolean {
        return a.x === 0 && a.y === 0;
    }
    //// L
    export function length(v: AnyVec2): number {
        return Math.sqrt(v.x * v.x + v.y * v.y);
    }
    export function lengthSq(v: AnyVec2): number {
        return v.x * v.x + v.y * v.y;
    }
    /** ⚠️ Expects 0 <= `t` <= 1 */
    export function lerp<T extends AnyVec2 = Vec2>(a: AnyVec2, b: AnyVec2, t: number, out?: T): T {
        out = (out ?? Vec2.zero()) as T;
        out.x = a.x + (b.x - a.x) * t;
        out.y = a.y + (b.y - a.y) * t;
        return out;
    }
    export function look<T extends AnyVec2 = Vec2>(a: AnyVec2, b: AnyVec2, out?: T): T {
        out = (out ?? Vec2.zero()) as T;
        sub(b, a, out);
        norm(out, out);
        return out;
    }
    //// M
    export function manhattanDist(a: AnyVec2, b: AnyVec2): number {
        const dx = Math.abs(a.x - b.x);
        const dy = Math.abs(a.y - b.y);
        return dx + dy;
    }
    export function manhattanLength(v: AnyVec2): number {
        return Math.abs(v.x) + Math.abs(v.y);
    }
    export function map<T extends AnyVec2 = Vec2>(a: T, callback: (value: number, index: number, vector: T) => number, out: AnyVec2) {
        out.x = callback(a.x, 0, a);
        out.y = callback(a.y, 1, a);
        return out;
    }
    export function max<T extends AnyVec2 = Vec2>(a: AnyVec2, b: AnyVec2, out?: T): T {
        out = (out ?? Vec2.zero()) as T;
        out.x = Math.max(a.x, b.x);
        out.y = Math.max(a.y, b.y);
        return out;
    }
    /** ⚠️ Expects `max` >= 0 */
    export function maxLength<T extends AnyVec2 = Vec2>(v: AnyVec2, max: number, out?: T): T {
        out = (out ?? Vec2.zero()) as T;
        const len = length(v);
        if(len === 0) {
            out.x = 0;
            out.y = 0;
            return out;
        }
        rescale(v, Math.min(max, len), out);
        return out;
    }
    export function maxScalar<T extends AnyVec2 = Vec2>(v: AnyVec2, max: number, out?: T): T {
        out = (out ?? Vec2.zero()) as T;
        out.x = Math.min(max, v.x);
        out.y = Math.min(max, v.y);
        return out;
    }
    export function min<T extends AnyVec2 = Vec2>(a: AnyVec2, b: AnyVec2, out?: T): T {
        out = (out ?? Vec2.zero()) as T;
        out.x = Math.min(a.x, b.x);
        out.y = Math.min(a.y, b.y);
        return out;
    }
    /** ⚠️ Expects `min` >= 0 */
    export function minLength<T extends AnyVec2 = Vec2>(v: AnyVec2, min: number, out?: T): T {
        out = (out ?? Vec2.zero()) as T;
        const len = length(v);
        if(len === 0) {
            out.x = 0;
            out.y = 0;
            return out;
        }
        rescale(v, Math.max(min, len), out);
        return out;
    }
    export function minScalar<T extends AnyVec2 = Vec2>(v: AnyVec2, min: number, out?: T): T {
        out = (out ?? Vec2.zero()) as T;
        out.x = Math.max(min, v.x);
        out.y = Math.max(min, v.y);
        return out;
    }
    export function mul<T extends AnyVec2 = Vec2>(a: AnyVec2, b: AnyVec2, out?: T): T {
        out = (out ?? Vec2.zero()) as T;
        out.x = a.x * b.x;
        out.y = a.y * b.y;
        return out;
    }
    export function mulScalar<T extends AnyVec2 = Vec2>(a: AnyVec2, b: number, out?: T): T {
        out = (out ?? Vec2.zero()) as T;
        out.x = a.x * b;
        out.y = a.y * b;
        return out;
    }
    //// N
    export function negate<T extends AnyVec2 = Vec2>(v: AnyVec2, out?: T): T {
        out = (out ?? Vec2.zero()) as T;
        out.x = -v.x;
        out.y = -v.y;
        return out;
    }
    export function norm<T extends AnyVec2 = Vec2>(v: AnyVec2, out?: T): T {
        out = (out ?? Vec2.zero()) as T;
        const len = length(v);
        if(len === 0) {
            out.x = 0;
            out.y = 0;
            return out;
        }
        out.x = v.x / len;
        out.y = v.y / len;
        return out;
    }
    //// P
    export function perpendicular<T extends AnyVec2 = Vec2>(v: AnyVec2, out?: T): T {
        out = (out ?? Vec2.zero()) as T;
        out.x = -v.y;
        out.y = v.x;
        return out;
    }
    export function perpendicularCW<T extends AnyVec2 = Vec2>(v: AnyVec2, out?: T): T {
        out = (out ?? Vec2.zero()) as T;
        out.x = v.y;
        out.y = -v.x;
        return out;
    }
    export function pow<T extends AnyVec2 = Vec2>(v: AnyVec2, exponent: number, out?: T): T {
        out = (out ?? Vec2.zero()) as T;
        out.x = Math.pow(v.x, exponent);
        out.y = Math.pow(v.y, exponent);
        return out;
    }
    export function project<T extends AnyVec2 = Vec2>(a: AnyVec2, b: AnyVec2, out?: T): T {
        out = (out ?? Vec2.zero()) as T;
        const bLenSq = b.x * b.x + b.y * b.y;
        if(bLenSq === 0) {
            out.x = 0;
            out.y = 0;
            return out;
        }
        const scalar = (a.x * b.x + a.y * b.y) / bLenSq;
        out.x = b.x * scalar;
        out.y = b.y * scalar;
        return out;
    }
    //// R
    export function rdivScalar<T extends AnyVec2 = Vec2>(a: AnyVec2, b: number, out?: T): T {
        out = (out ?? Vec2.zero()) as T;
        out.x = b / a.x;
        out.y = b / a.y;
        return out;
    }
    export function reciprocal<T extends AnyVec2 = Vec2>(v: AnyVec2, out?: T): T {
        out = (out ?? Vec2.zero()) as T;
        out.x = 1 / v.x;
        out.y = 1 / v.y;
        return out;
    }
    export function reduce<T extends AnyVec2, V>(a: T, callback: (previous: V, value: number, index: number, vector: T) => V, initial: V): V;
    export function reduce<T extends AnyVec2 = Vec2>(a: T, callback: (previous: number, value: number, index: number, vector: T) => number): number;
    export function reduce<T extends AnyVec2, V>(
        ...args: ([
            a: T,
            callback: (previous: V, value: number, index: number, vector: T) => V,
            initial: V
        ]) | ([
            a: T,
            callback: (previous: number, value: number, index: number, vector: T) => number
        ])
    ): V | number {
        if(args.length === 3) {
            const [a, callback, initial] = args;
            let v = initial;
            v = callback(v, a.x, 0, a);
            v = callback(v, a.y, 1, a);
            return v;
        }
        const [a, callback] = args;
        return callback(a.x, a.y, 1, a);
    }
    /** ⚠️ Expects `normal` to be an already normd vector */
    export function reflect<T extends AnyVec2 = Vec2>(v: AnyVec2, normal: AnyVec2, out?: T): T {
        out = (out ?? Vec2.zero()) as T;
        const dot = v.x * normal.x + v.y * normal.y;
        out.x = v.x - 2 * dot * normal.x;
        out.y = v.y - 2 * dot * normal.y;
        return out;
    }
    export function rescale<T extends AnyVec2 = Vec2>(v: AnyVec2, len: number, out?: T): T {
        out = (out ?? Vec2.zero()) as T;
        const currentLen = length(v);
        if(currentLen === 0) {
            out.x = 0;
            out.y = 0;
            return out;
        }
        out.x = v.x / currentLen * len;
        out.y = v.y / currentLen * len;
        return out;
    }
    export function rotate<T extends AnyVec2 = Vec2>(v: AnyVec2, angle: number, out?: T): T {
        out = (out ?? Vec2.zero()) as T;
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        out.x = v.x * cosA - v.y * sinA;
        out.y = v.x * sinA + v.y * cosA;
        return out;
    }
    export function rotateAround<T extends AnyVec2 = Vec2>(v: AnyVec2, origin: AnyVec2, angle: number, out?: T): T {
        out = (out ?? Vec2.zero()) as T;
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        const dx = v.x - origin.x;
        const dy = v.y - origin.y;
        out.x = origin.x + dx * cosA - dy * sinA;
        out.y = origin.y + dx * sinA + dy * cosA;
        return out;
    }
    export function rotationLerp<T extends AnyVec2 = Vec2>(a: AnyVec2, b: AnyVec2, t: number, out?: T): T {
        out = (out ?? Vec2.zero()) as T;
        rotate(a, signedAngleBetween(a, b) * t, out);
        return out;
    }
    /** ⚠️ Expects `step` >= 0 */
    export function rotationStep<T extends AnyVec2 = Vec2>(a: AnyVec2, b: AnyVec2, step: number, out?: T): T {
        out = (out ?? Vec2.zero()) as T;
        const dA = signedAngleBetween(a, b);
        rotate(a, Math.sign(dA) * Math.min(Math.abs(dA), step), out);
        return out;
    }
    export function round<T extends AnyVec2 = Vec2>(v: AnyVec2, out?: T): T {
        out = (out ?? Vec2.zero()) as T;
        out.x = Math.round(v.x);
        out.y = Math.round(v.y);
        return out;
    }
    export function rsubScalar<T extends AnyVec2 = Vec2>(a: AnyVec2, b: number, out?: T): T {
        out = (out ?? Vec2.zero()) as T;
        out.x = b - a.x;
        out.y = b - a.y;
        return out;
    }
    //// S
    export function sign<T extends AnyVec2 = Vec2>(v: AnyVec2, out?: T): T {
        out = (out ?? Vec2.zero()) as T;
        out.x = Math.sign(v.x);
        out.y = Math.sign(v.y);
        return out;
    }
    export function signedAngleBetween(a: AnyVec2, b: AnyVec2): number {
        return Math.atan2(a.x * b.y - a.y * b.x, a.x * b.x + a.y * b.y);
    }
    export function step<T extends AnyVec2 = Vec2>(a: AnyVec2, b: AnyVec2, step: number, out?: T): T {
        out = (out ?? Vec2.zero()) as T;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if(dist === 0) {
            out.x = a.x;
            out.y = a.y;
            return out;
        }
        const t = Math.min(step / dist, 1);
        out.x = a.x + dx * t;
        out.y = a.y + dy * t;
        return out;
    }
    export function stepComponent<T extends AnyVec2 = Vec2>(a: AnyVec2, b: AnyVec2, step: number, out?: T): T {
        out = (out ?? Vec2.zero()) as T;
        const minX = Math.min(a.x, b.x);
        const maxX = Math.max(a.x, b.x);
        const minY = Math.min(a.y, b.y);
        const maxY = Math.max(a.y, b.y);
        out.x = Math.min(Math.max(a.x + Math.sign(b.x - a.x) * step, minX), maxX);
        out.y = Math.min(Math.max(a.y + Math.sign(b.y - a.y) * step, minY), maxY);
        return out;
    }
    export function sub<T extends AnyVec2 = Vec2>(a: AnyVec2, b: AnyVec2, out?: T): T {
        out = (out ?? Vec2.zero()) as T;
        out.x = a.x - b.x;
        out.y = a.y - b.y;
        return out;
    }
    export function subScalar<T extends AnyVec2 = Vec2>(a: AnyVec2, b: number, out?: T): T {
        out = (out ?? Vec2.zero()) as T;
        out.x = a.x - b;
        out.y = a.y - b;
        return out;
    }
    //// T
    export function toArray(a: AnyVec2): [number, number] {
        return [a.x, a.y];
    }
    export function toKey(a: AnyVec2): string {
        return `${a.x} ${a.y}`;
    }
    export function toObject(a: AnyVec2): { x: number, y: number } {
        return { x: a.x, y: a.y };
    }
    export function toString(a: AnyVec2): string {
        return `<${a.x}, ${a.y}>`;
    }
    export function trunc<T extends AnyVec2 = Vec2>(v: AnyVec2, out?: T): T {
        out = (out ?? Vec2.zero()) as T;
        out.x = Math.trunc(v.x);
        out.y = Math.trunc(v.y);
        return out;
    }
}