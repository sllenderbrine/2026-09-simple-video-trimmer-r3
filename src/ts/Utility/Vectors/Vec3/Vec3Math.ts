import { MathUtility } from "../../MathUtility.js";
import { Vec3 } from "./Vec3.js";

const tempVectors: Vec3Math.AnyVec3[] = [];
const tempVectorCount = 32;
let internalTempVectorIndex = 0;

for(let i=0; i<tempVectorCount; i++) {
    tempVectors.push({ x: 0, y: 0, z: 0 });
}

function newTemp(): Vec3Math.AnyVec3 {
    if(++internalTempVectorIndex >= tempVectorCount) internalTempVectorIndex = 0;
    return tempVectors[internalTempVectorIndex]!;
}

export namespace Vec3Math {
    export type AnyVec3 = {
        x: number;
        y: number;
        z: number;
    };
    //// A
    export function abs<T extends AnyVec3 = Vec3>(v: AnyVec3, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        out.x = Math.abs(v.x);
        out.y = Math.abs(v.y);
        out.z = Math.abs(v.z);
        return out;
    }
    export function add<T extends AnyVec3 = Vec3>(a: AnyVec3, b: AnyVec3, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        out.x = a.x + b.x;
        out.y = a.y + b.y;
        out.z = a.z + b.z;
        return out;
    }
    export function addScalar<T extends AnyVec3 = Vec3>(a: AnyVec3, b: number, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        out.x = a.x + b;
        out.y = a.y + b;
        out.z = a.z + b;
        return out;
    }
    export function addScaled<T extends AnyVec3 = Vec3>(a: AnyVec3, b: AnyVec3, scalar: number, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        out.x = a.x + b.x * scalar;
        out.y = a.y + b.y * scalar;
        out.z = a.z + b.z * scalar;
        return out;
    }
    /**
     * Let `dN` = `norm(direction)`\
     * Solves for `t` such that `dot(a + dN * t, b) = targetDot`,\
     * and returns `a + dN * t`.
     * @note If `dot(dN, b) === 0`, the function returns `a`.
     */
    export function addTargetDot<T extends AnyVec3 = Vec3>(a: AnyVec3, b: AnyVec3, direction: AnyVec3, targetDot: number, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        /*
            dot(a + dN * t, b) = targetDot

            (ax+dNx*t)*bx  +  (ay+dNy*t)*by  +  (az+dNz*t)*bz  =  targetDot
            ax*bx+dNx*t*bx  +  ay*by+dNy*t*by  +  az*bz+dNz*t*bz  =  targetDot
            dNx*t*bx  +  dNy*t*by  +  dNz*t*bz  =  targetDot  -  ax*bx  -  ay*by  -  az*bz
            t  *  (dNx*bx  +  dNy*by  +  dNz*bz)  =  targetDot  -  ax*bx  -  ay*by  -  az*bz
            t  =  (targetDot  -  ax*bx  -  ay*by  -  az*bz)  /  (dNx*bx  +  dNy*by  +  dNz*bz)
        */
        const dN = norm(direction, newTemp());
        const dirBDot = dN.x * b.x + dN.y * b.y + dN.z * b.z;
        if(dirBDot === 0) {
            out.x = a.x;
            out.y = a.y;
            out.z = a.z;
            return out;
        }
        const abDot = a.x * b.x + a.y * b.y + a.z * b.z;
        const t = (targetDot - abDot) / dirBDot;
        out.x = a.x + dN.x * t;
        out.y = a.y + dN.y * t;
        out.z = a.z + dN.z * t;
        return out;
    }
    /**
     * Let `aN` = `norm(a)`\
     * Let `dN` = `norm(direction)`\
     * Let `bN` = `norm(b)`\
     * Let `normal` = `crossNorm(aN, dN)`\
     * Solves for `t` such that `dot(rotateAxis(aN, normal, t), bN)` is as close as possible to `targetDot`, or, if multiple\
     * solutions are found, `t` is of the smallest magnitude.\
     * Then returns `rotateAxis(aN, normal, t)`.
     */
    export function addTargetDotUnit<T extends AnyVec3 = Vec3>(a: AnyVec3, b: AnyVec3, direction: AnyVec3, targetDot: number, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        /*
            dot(rotateAxis(aN, normal, t), bN) = targetDot

            let
            crossR = cross(aN, normal)
            dotR = dot(aN, normal) = 0
            rotatedX = aN.x * cos(t) + crossR.x * sin(t) + normal.x * dotR * (1 - cos(t))
            rotatedY = aN.y * cos(t) + crossR.y * sin(t) + normal.y * dotR * (1 - cos(t))
            rotatedZ = aN.z * cos(t) + crossR.z * sin(t) + normal.z * dotR * (1 - cos(t))
            
            rotatedX = aN.x * cos(t) + crossR.x * sin(t)
            rotatedY = aN.y * cos(t) + crossR.y * sin(t)
            rotatedZ = aN.z * cos(t) + crossR.z * sin(t)

            (aN.x * cos(t) + crossR.x * sin(t)) * bN.x
            + (aN.y * cos(t) + crossR.y * sin(t)) * bN.y
            + (aN.z * cos(t) + crossR.z * sin(t)) * bN.z
            = targetDot

            aN.x * cos(t) * bN.x + crossR.x * sin(t) * bN.x
            + aN.y * cos(t) * bN.y + crossR.y * sin(t) * bN.y
            + aN.z * cos(t) * bN.z + crossR.z * sin(t) * bN.z
            = targetDot

            cos(t) * (aN.x * bN.x + aN.y * bN.y + aN.z * bN.z)
            + sin(t) * (crossR.x * bN.x + crossR.y * bN.y + crossR.z * bN.z)
            = targetDot

            let
            CX = aN.x * bN.x + aN.y * bN.y + aN.z * bN.z
            SX = crossR.x * bN.x + crossR.y * bN.y + crossR.z * bN.z
            R = sqrt(CX^2 + SX^2)
            P = atan2(SX, CX)

            CX*cos(t) + SX*sin(t) = R * cos(t - P) // trig identity
            targetDot = R * cos(t - P)
            cos(t - P) = targetDot / R
            t - P = arccos(targetDot / R)
            t = arccos(targetDot / R) + P
        */
       const aN = norm(a, newTemp());
       const bN = norm(b, newTemp());
       const dN = norm(direction, newTemp());
       const normal = crossNorm(aN, dN, newTemp());
       const crossR = cross(aN, normal, newTemp());
       const CX = aN.x * bN.x + aN.y * bN.y + aN.z * bN.z;
       const SX = crossR.x * bN.x + crossR.y * bN.y + crossR.z * bN.z;
       const R = Math.sqrt(CX * CX + SX * SX);
       if (R === 0) {
            clone(aN, out);
            return out;
        }
       targetDot = Math.min(Math.max(targetDot, -R), R);
       const P = Math.atan2(SX, CX);
       const offset = Math.acos(targetDot / R);
       let t1 = MathUtility.convertRadiansToSmallestMagnitude(P + offset);
       let t2 = MathUtility.convertRadiansToSmallestMagnitude(P - offset);
       const t = Math.abs(t1) < Math.abs(t2) ? t1 : t2;
       rotateAxis(aN, normal, t, out);
       return out;
    }
    export function angleBetween(a: AnyVec3, b: AnyVec3): number {
        const lenSqA = a.x * a.x + a.y * a.y + a.z * a.z;
        const lenSqB = b.x * b.x + b.y * b.y + b.z * b.z;
        if(lenSqA === 0 || lenSqB === 0) return 0;
        const dot = a.x * b.x + a.y * b.y + a.z * b.z;
        return Math.acos(Math.min(Math.max(dot / Math.sqrt(lenSqA * lenSqB), -1), 1));
    }
    export function average<T extends AnyVec3 = Vec3>(a: AnyVec3, b: AnyVec3, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        out.x = (a.x + b.x) / 2;
        out.y = (a.y + b.y) / 2;
        out.z = (a.z + b.z) / 2;
        return out;
    }
    //// C
    export function ceil<T extends AnyVec3 = Vec3>(v: AnyVec3, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        out.x = Math.ceil(v.x);
        out.y = Math.ceil(v.y);
        out.z = Math.ceil(v.z);
        return out;
    }
    /**
     * @note Expects component-wise `min <= max`
     */
    export function clampComponents<T extends AnyVec3 = Vec3>(v: AnyVec3, min: AnyVec3, max: AnyVec3, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        out.x = Math.max(min.x, Math.min(max.x, v.x));
        out.y = Math.max(min.y, Math.min(max.y, v.y));
        out.z = Math.max(min.z, Math.min(max.z, v.z));
        return out;
    }
    /**
     * @note Expects `length(min) <= length(max)`
     */
    export function clampLength<T extends AnyVec3 = Vec3>(v: AnyVec3, min: AnyVec3, max: AnyVec3, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        const len = length(v);
        if(len === 0) {
            out.x = 0;
            out.y = 0;
            out.z = 0;
            return out;
        }
        rescale(v, Math.max(length(min), Math.min(length(max), len)), out);
        return out;
    }
    /**
     * @note Expects `min <= max`
     * @note Expects `min >= 0` and `max >= 0`
     */
    export function clampLengthScalar<T extends AnyVec3 = Vec3>(v: AnyVec3, min: number, max: number, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        const len = length(v);
        if(len === 0) {
            out.x = 0;
            out.y = 0;
            out.z = 0;
            return out;
        }
        rescale(v, Math.max(min, Math.min(max, len)), out);
        return out;
    }
    /**
     * @note Expects `min <= max`
     */
    export function clampComponentsScalar<T extends AnyVec3 = Vec3>(v: AnyVec3, min: number, max: number, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        out.x = Math.max(min, Math.min(max, v.x));
        out.y = Math.max(min, Math.min(max, v.y));
        out.z = Math.max(min, Math.min(max, v.z));
        return out;
    }
    export function clone<T extends AnyVec3 = Vec3>(v: AnyVec3, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        out.x = v.x;
        out.y = v.y;
        out.z = v.z;
        return out;
    }
    /**
     * @note Expects `epsilon >= 0`
     * @param epsilon The tolerance for equivalence represented by a return value of zero (default is 1e-6)
     */
    export function compareLength(a: AnyVec3, b: AnyVec3, epsilon: number = 1e-6): number {
        const aLen = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
        const bLen = Math.sqrt(b.x * b.x + b.y * b.y + b.z * b.z);
        if(Math.abs(aLen - bLen) <= epsilon) return 0;
        return aLen - bLen;
    }
    export function componentProduct(v: AnyVec3): number {
        return v.x * v.y * v.z;
    }
    export function componentSum(v: AnyVec3): number {
        return v.x + v.y + v.z;
    }
    export function cross<T extends AnyVec3 = Vec3>(a: AnyVec3, b: AnyVec3, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        out.x = a.y * b.z - a.z * b.y;
        out.y = a.z * b.x - a.x * b.z;
        out.z = a.x * b.y - a.y * b.x;
        return out;
    }
    export function crossNorm<T extends AnyVec3 = Vec3>(a: AnyVec3, b: AnyVec3, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        cross(a, b, out);
        norm(out, out);
        return out;
    }
    //// D
    export function dist(a: AnyVec3, b: AnyVec3): number {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dz = a.z - b.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
    export function distSq(a: AnyVec3, b: AnyVec3): number {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dz = a.z - b.z;
        return dx * dx + dy * dy + dz * dz;
    }
    export function div<T extends AnyVec3 = Vec3>(a: AnyVec3, b: AnyVec3, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        out.x = a.x / b.x;
        out.y = a.y / b.y;
        out.z = a.z / b.z;
        return out;
    }
    export function divScalar<T extends AnyVec3 = Vec3>(a: AnyVec3, b: number, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        out.x = a.x / b;
        out.y = a.y / b;
        out.z = a.z / b;
        return out;
    }
    export function dot(a: AnyVec3, b: AnyVec3): number {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }
    //// F
    export function floor<T extends AnyVec3 = Vec3>(v: AnyVec3, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        out.x = Math.floor(v.x);
        out.y = Math.floor(v.y);
        out.z = Math.floor(v.z);
        return out;
    }
    export function forEach<T extends AnyVec3>(a: T, callback: (value: number, index: number, vector: T) => void): T {
        callback(a.x, 0, a);
        callback(a.y, 1, a);
        callback(a.z, 2, a);
        return a;
    }
    export function fract<T extends AnyVec3 = Vec3>(v: AnyVec3, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        out.x = v.x - Math.floor(v.x);
        out.y = v.y - Math.floor(v.y);
        out.z = v.z - Math.floor(v.z);
        return out;
    }
    export function fromArray<T extends AnyVec3 = Vec3>(arr: [number, number, number], out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        out.x = arr[0];
        out.y = arr[1];
        out.z = arr[2];
        return out;
    }
    export function fromObject<T extends AnyVec3 = Vec3>(obj: { x: number, y: number, z: number }, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        out.x = obj.x;
        out.y = obj.y;
        out.z = obj.z;
        return out;
    }
    //// I
    export function isEqual(a: AnyVec3, b: AnyVec3): boolean {
        return a.x === b.x && a.y === b.y && a.z === b.z;
    }
    export function isEqualScalar(a: AnyVec3, scalar: number): boolean {
        return a.x === scalar && a.y === scalar && a.z === scalar;
    }
    export function isFinite(a: AnyVec3): boolean {
        return Number.isFinite(a.x) && Number.isFinite(a.y) && Number.isFinite(a.z);
    }
    export function isGreaterThan(a: AnyVec3, b: AnyVec3): boolean {
        return a.x > b.x && a.y > b.y && a.z > b.z;
    }
    export function isGreaterThanScalar(a: AnyVec3, scalar: number): boolean {
        return a.x > scalar && a.y > scalar && a.z > scalar;
    }
    export function isInteger(a: AnyVec3): boolean {
        return Number.isInteger(a.x) && Number.isInteger(a.y) && Number.isInteger(a.z);
    }
    export function isLessThan(a: AnyVec3, b: AnyVec3): boolean {
        return a.x < b.x && a.y < b.y && a.z < b.z;
    }
    export function isLessThanScalar(a: AnyVec3, scalar: number): boolean {
        return a.x < scalar && a.y < scalar && a.z < scalar;
    }
    export function isParallel(a: AnyVec3, b: AnyVec3, epsilon: number = 1e-6): boolean {
        if(isZero(a) || isZero(b))
            return false;
        const aN = norm(a, newTemp());
        const bN = norm(b, newTemp());
        return Math.abs(dot(aN, bN)) >= 1 - epsilon;
    }
    export function isPerpendicular(a: AnyVec3, b: AnyVec3, epsilon: number = 1e-6): boolean {
        if(isZero(a) || isZero(b))
            return false;
        const aN = norm(a, newTemp());
        const bN = norm(b, newTemp());
        return Math.abs(dot(aN, bN)) <= epsilon;
    }
    export function isNaN(a: AnyVec3): boolean {
        return Number.isNaN(a.x) || Number.isNaN(a.y) || Number.isNaN(a.z);
    }
    /**
     * ⚠️ Expects `epsilon` >= 0
     * @param epsilon The tolerance for similarity (default is 1e-6)
     * */
    export function isSimilar(a: AnyVec3, b: AnyVec3, epsilon: number = 1e-6): boolean {
        return Math.abs(a.x - b.x) <= epsilon && Math.abs(a.y - b.y) <= epsilon && Math.abs(a.z - b.z) <= epsilon;
    }
    /**
     * ⚠️ Expects `epsilon` >= 0
     * @param epsilon The tolerance for similarity (default is 1e-6)
     * */
    export function isSimilarScalar(a: AnyVec3, scalar: number, epsilon: number = 1e-6): boolean {
        return Math.abs(a.x - scalar) <= epsilon && Math.abs(a.y - scalar) <= epsilon && Math.abs(a.z - scalar) <= epsilon;
    }
    /**
     * ⚠️ Expects `epsilon` >= 0
     * @param epsilon The tolerance for similarity (default is 1e-6)
     * */
    export function isSimilarZero(a: AnyVec3, epsilon: number = 1e-6): boolean {
        return Math.abs(a.x) <= epsilon && Math.abs(a.y) <= epsilon && Math.abs(a.z) <= epsilon;
    }
    export function isUnit(v: AnyVec3, epsilon: number = 1e-6): boolean {
        const len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
        return Math.abs(len - 1) <= epsilon;
    }
    export function isZero(a: AnyVec3): boolean {
        return a.x === 0 && a.y === 0 && a.z === 0;
    }
    //// L
    export function length(v: AnyVec3): number {
        return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    }
    export function lengthSq(v: AnyVec3): number {
        return v.x * v.x + v.y * v.y + v.z * v.z;
    }
    /** ⚠️ Expects 0 <= `t` <= 1 */
    export function lerp<T extends AnyVec3 = Vec3>(a: AnyVec3, b: AnyVec3, t: number, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        out.x = a.x + (b.x - a.x) * t;
        out.y = a.y + (b.y - a.y) * t;
        out.z = a.z + (b.z - a.z) * t;
        return out;
    }
    export function look<T extends AnyVec3 = Vec3>(a: AnyVec3, b: AnyVec3, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        sub(b, a, out);
        norm(out, out);
        return out;
    }
    //// M
    export function manhattanDist(a: AnyVec3, b: AnyVec3): number {
        const dx = Math.abs(a.x - b.x);
        const dy = Math.abs(a.y - b.y);
        const dz = Math.abs(a.z - b.z);
        return dx + dy + dz;
    }
    export function manhattanLength(v: AnyVec3): number {
        return Math.abs(v.x) + Math.abs(v.y) + Math.abs(v.z);
    }
    export function map<T extends AnyVec3 = Vec3>(a: T, callback: (value: number, index: number, vector: T) => number, out: AnyVec3) {
        out.x = callback(a.x, 0, a);
        out.y = callback(a.y, 1, a);
        out.z = callback(a.z, 2, a);
        return out;
    }
    export function max<T extends AnyVec3 = Vec3>(a: AnyVec3, b: AnyVec3, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        out.x = Math.max(a.x, b.x);
        out.y = Math.max(a.y, b.y);
        out.z = Math.max(a.z, b.z);
        return out;
    }
    /** ⚠️ Expects `max` >= 0 */
    export function maxLength<T extends AnyVec3 = Vec3>(v: AnyVec3, max: number, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        const len = length(v);
        if(len === 0) {
            out.x = 0;
            out.y = 0;
            out.z = 0;
            return out;
        }
        rescale(v, Math.min(max, len), out);
        return out;
    }
    export function maxScalar<T extends AnyVec3 = Vec3>(v: AnyVec3, max: number, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        out.x = Math.min(max, v.x);
        out.y = Math.min(max, v.y);
        out.z = Math.min(max, v.z);
        return out;
    }
    export function min<T extends AnyVec3 = Vec3>(a: AnyVec3, b: AnyVec3, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        out.x = Math.min(a.x, b.x);
        out.y = Math.min(a.y, b.y);
        out.z = Math.min(a.z, b.z);
        return out;
    }
    /** ⚠️ Expects `min` >= 0 */
    export function minLength<T extends AnyVec3 = Vec3>(v: AnyVec3, min: number, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        const len = length(v);
        if(len === 0) {
            out.x = 0;
            out.y = 0;
            out.z = 0;
            return out;
        }
        rescale(v, Math.max(min, len), out);
        return out;
    }
    export function minScalar<T extends AnyVec3 = Vec3>(v: AnyVec3, min: number, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        out.x = Math.max(min, v.x);
        out.y = Math.max(min, v.y);
        out.z = Math.max(min, v.z);
        return out;
    }
    export function mul<T extends AnyVec3 = Vec3>(a: AnyVec3, b: AnyVec3, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        out.x = a.x * b.x;
        out.y = a.y * b.y;
        out.z = a.z * b.z;
        return out;
    }
    export function mulScalar<T extends AnyVec3 = Vec3>(a: AnyVec3, b: number, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        out.x = a.x * b;
        out.y = a.y * b;
        out.z = a.z * b;
        return out;
    }
    //// N
    export function negate<T extends AnyVec3 = Vec3>(v: AnyVec3, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        out.x = -v.x;
        out.y = -v.y;
        out.z = -v.z;
        return out;
    }
    export function norm<T extends AnyVec3 = Vec3>(v: AnyVec3, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        const len = length(v);
        if(len === 0) {
            out.x = 0;
            out.y = 0;
            out.z = 0;
            return out;
        }
        out.x = v.x / len;
        out.y = v.y / len;
        out.z = v.z / len;
        return out;
    }
    //// P
    export function pitch(v: AnyVec3): number {
        return Math.asin(v.y);
    }
    export function pow<T extends AnyVec3 = Vec3>(v: AnyVec3, exponent: number, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        out.x = Math.pow(v.x, exponent);
        out.y = Math.pow(v.y, exponent);
        out.z = Math.pow(v.z, exponent);
        return out;
    }
    export function project<T extends AnyVec3 = Vec3>(a: AnyVec3, b: AnyVec3, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        const bLenSq = b.x * b.x + b.y * b.y + b.z * b.z;
        if(bLenSq === 0) {
            out.x = 0;
            out.y = 0;
            out.z = 0;
            return out;
        }
        const scalar = (a.x * b.x + a.y * b.y + a.z * b.z) / bLenSq;
        out.x = b.x * scalar;
        out.y = b.y * scalar;
        out.z = b.z * scalar;
        return out;
    }
    //// R
    export function randomPerpendicularUnit<T extends AnyVec3 = Vec3>(v: AnyVec3, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        if(isZero(v)) {
            out.x = 0;
            out.y = 0;
            out.z = 0;
            return out;
        }
        const nonParallel = newTemp();
        const absX = Math.abs(v.x);
        const absY = Math.abs(v.y);
        const absZ = Math.abs(v.z);
        if(absX <= absY && absX <= absZ) {
            nonParallel.x = 1;
            nonParallel.y = 0;
            nonParallel.z = 0;
        } else if(absY <= absX && absY <= absZ) {
            nonParallel.x = 0;
            nonParallel.y = 1;
            nonParallel.z = 0;
        } else {
            nonParallel.x = 0;
            nonParallel.y = 0;
            nonParallel.z = 1;
        }
        const vN = norm(v, newTemp());
        const axis = crossNorm(vN, nonParallel, newTemp());
        return rotateAxis(vN, axis, Math.random() * 2 * Math.PI, out);
    }
    export function randomUnit<T extends AnyVec3 = Vec3>(out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        const z = Math.random() * 2 - 1;
        const t = Math.random() * 2 * Math.PI;
        const m = Math.sqrt(Math.max(0, 1 - z * z));
        out.x = m * Math.cos(t);
        out.y = m * Math.sin(t);
        out.z = z;
        return out;
    }
    export function randomUnitRotation<T extends AnyVec3 = Vec3>(out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        const unit = randomUnit(newTemp());
        out.x = pitch(unit);
        out.y = yaw(unit);
        out.z = Math.random() * 2 * Math.PI;
        return out;
    }
    export function rdivScalar<T extends AnyVec3 = Vec3>(a: AnyVec3, b: number, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        out.x = b / a.x;
        out.y = b / a.y;
        out.z = b / a.z;
        return out;
    }
    export function reciprocal<T extends AnyVec3 = Vec3>(v: AnyVec3, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        out.x = 1 / v.x;
        out.y = 1 / v.y;
        out.z = 1 / v.z;
        return out;
    }
    export function reduce<T extends AnyVec3, V>(a: T, callback: (previous: V, value: number, index: number, vector: T) => V, initial: V): V;
    export function reduce<T extends AnyVec3 = Vec3>(a: T, callback: (previous: number, value: number, index: number, vector: T) => number): number;
    export function reduce<T extends AnyVec3, V>(
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
            v = callback(v, a.z, 2, a);
            return v;
        }
        const [a, callback] = args;
        let v = callback(a.x, a.y, 1, a);
        v = callback(v, a.z, 2, a);
        return v;
    }
    /** ⚠️ Expects `normal` to be an already normalized vector */
    export function reflect<T extends AnyVec3 = Vec3>(v: AnyVec3, normal: AnyVec3, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        const dot = v.x * normal.x + v.y * normal.y + v.z * normal.z;
        out.x = v.x - 2 * dot * normal.x;
        out.y = v.y - 2 * dot * normal.y;
        out.z = v.z - 2 * dot * normal.z;
        return out;
    }
    export function rescale<T extends AnyVec3 = Vec3>(v: AnyVec3, len: number, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        const currentLen = length(v);
        if(currentLen === 0) {
            out.x = 0;
            out.y = 0;
            out.z = 0;
            return out;
        }
        out.x = v.x / currentLen * len;
        out.y = v.y / currentLen * len;
        out.z = v.z / currentLen * len;
        return out;
    }
    /**
     * Let `axisN` = `norm(axis)`.\
     * Rotates `v` around `axisN` by `angle` radians.
     */
    export function rotateAxis<T extends AnyVec3 = Vec3>(v: AnyVec3, axis: AnyVec3, angle: number, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        const axisN = norm(axis, newTemp());
        const sinAngle = Math.sin(angle);
        const cosAngle = Math.cos(angle);
        const crossVN = cross(v, axisN, newTemp());
        const dotVN = dot(v, axisN);
        out.x = v.x * cosAngle + crossVN.x * sinAngle + axisN.x * dotVN * (1 - cosAngle);
        out.y = v.y * cosAngle + crossVN.y * sinAngle + axisN.y * dotVN * (1 - cosAngle);
        out.z = v.z * cosAngle + crossVN.z * sinAngle + axisN.z * dotVN * (1 - cosAngle);
        return out;
    }
    export function rotateLerp<T extends AnyVec3 = Vec3>(a: AnyVec3, b: AnyVec3, normal: AnyVec3, t: number, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        const axis = cross(a, b, newTemp());
        const angle = signedAngleBetween(a, b, normal);
        rotateAxis(a, axis, angle * t, out);
        return out;
    }
    /**
     * Let `axis` be the axis perpendicular to `a` and `b`.\
     * Rotates `a` around `axis` in the direction of `b` by at most `angle` radians.
     * @note The rotation angle may be capped to prevent overshooting `b`. 
    */
    export function rotateTowards<T extends AnyVec3 = Vec3>(a: AnyVec3, b: AnyVec3, normal: AnyVec3, angle: number, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        const axis = cross(a, b, newTemp());
        const angleOffset = signedAngleBetween(a, b, normal);
        let stepAngle = Math.sign(angleOffset) * angle;
        if(angleOffset < 0) stepAngle = Math.min(Math.max(stepAngle, angleOffset), Math.PI * 2 + angleOffset);
        else stepAngle = Math.min(Math.max(stepAngle, angleOffset - Math.PI * 2), angleOffset);
        rotateAxis(a, axis, stepAngle, out);
        return out;
    }
    export function rotateX<T extends AnyVec3 = Vec3>(v: AnyVec3, angle: number, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        const sinAngle = Math.sin(angle);
        const cosAngle = Math.cos(angle);
        const tempY = v.y;
        out.x = v.x;
        out.y = v.y * cosAngle - v.z * sinAngle;
        out.z = tempY * sinAngle + v.z * cosAngle;
        return out;
    }
    export function rotateXyz<T extends AnyVec3 = Vec3>(v: AnyVec3, rotation: AnyVec3, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        rotateX(v, rotation.x, out);
        rotateY(out, rotation.y, out);
        rotateZ(out, rotation.z, out);
        return out;
    }
    export function rotateXyzAround<T extends AnyVec3 = Vec3>(v: AnyVec3, origin: AnyVec3, rotation: AnyVec3, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        sub(v, origin, out);
        rotateXyz(out, rotation, out);
        add(out, origin, out);
        return out;
    }
    export function rotateY<T extends AnyVec3 = Vec3>(v: AnyVec3, angle: number, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        const sinAngle = Math.sin(angle);
        const cosAngle = Math.cos(angle);
        const tempX = v.x;
        out.x = v.x * cosAngle + v.z * sinAngle;
        out.y = v.y;
        out.z = v.z * cosAngle - tempX * sinAngle;
        return out;
    }
    export function rotateZ<T extends AnyVec3 = Vec3>(v: AnyVec3, angle: number, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        const sinAngle = Math.sin(angle);
        const cosAngle = Math.cos(angle);
        const tempX = v.x;
        out.x = v.x * cosAngle - v.y * sinAngle;
        out.y = tempX * sinAngle + v.y * cosAngle;
        out.z = v.z;
        return out;
    }
    export function rotateZyx<T extends AnyVec3 = Vec3>(v: AnyVec3, rotation: AnyVec3, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        rotateZ(v, rotation.z, out);
        rotateY(out, rotation.y, out);
        rotateX(out, rotation.x, out);
        return out;
    }
    export function rotateZyxAround<T extends AnyVec3 = Vec3>(v: AnyVec3, origin: AnyVec3, rotation: AnyVec3, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        sub(v, origin, out);
        rotateZyx(out, rotation, out);
        add(out, origin, out);
        return out;
    }
    export function round<T extends AnyVec3 = Vec3>(v: AnyVec3, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        out.x = Math.round(v.x);
        out.y = Math.round(v.y);
        out.z = Math.round(v.z);
        return out;
    }
    export function rsubScalar<T extends AnyVec3 = Vec3>(a: AnyVec3, b: number, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        out.x = b - a.x;
        out.y = b - a.y;
        out.z = b - a.z;
        return out;
    }
    //// S
    export function sign<T extends AnyVec3 = Vec3>(v: AnyVec3, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        out.x = Math.sign(v.x);
        out.y = Math.sign(v.y);
        out.z = Math.sign(v.z);
        return out;
    }
    export function signedAngleBetween(a: AnyVec3, b: AnyVec3, normal: AnyVec3): number {
        return Math.atan2(dot(cross(a, b, newTemp()), normal), dot(a, b));
    }
    export function step<T extends AnyVec3 = Vec3>(a: AnyVec3, b: AnyVec3, step: number, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dz = b.z - a.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if(dist === 0) {
            out.x = a.x;
            out.y = a.y;
            out.z = a.z;
            return out;
        }
        const t = Math.min(step / dist, 1);
        out.x = a.x + dx * t;
        out.y = a.y + dy * t;
        out.z = a.z + dz * t;
        return out;
    }
    export function stepComponent<T extends AnyVec3 = Vec3>(a: AnyVec3, b: AnyVec3, step: number, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        const minX = Math.min(a.x, b.x);
        const maxX = Math.max(a.x, b.x);
        const minY = Math.min(a.y, b.y);
        const maxY = Math.max(a.y, b.y);
        const minZ = Math.min(a.z, b.z);
        const maxZ = Math.max(a.z, b.z);
        out.x = Math.min(Math.max(a.x + Math.sign(b.x - a.x) * step, minX), maxX);
        out.y = Math.min(Math.max(a.y + Math.sign(b.y - a.y) * step, minY), maxY);
        out.z = Math.min(Math.max(a.z + Math.sign(b.z - a.z) * step, minZ), maxZ);
        return out;
    }
    export function sub<T extends AnyVec3 = Vec3>(a: AnyVec3, b: AnyVec3, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        out.x = a.x - b.x;
        out.y = a.y - b.y;
        out.z = a.z - b.z;
        return out;
    }
    export function subScalar<T extends AnyVec3 = Vec3>(a: AnyVec3, b: number, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        out.x = a.x - b;
        out.y = a.y - b;
        out.z = a.z - b;
        return out;
    }
    //// T
    export function toArray(a: AnyVec3): [number, number, number] {
        return [a.x, a.y, a.z];
    }
    export function toKey(a: AnyVec3) {
        return `${a.x} ${a.y} ${a.z}`;
    }
    export function toObject(a: AnyVec3): AnyVec3 {
        return { x: a.x, y: a.y, z: a.z };
    }
    export function toString(a: AnyVec3) {
        return `<${a.x}, ${a.y}, ${a.z}>`;
    }
    export function trunc<T extends AnyVec3 = Vec3>(v: AnyVec3, out?: T): T {
        out = (out ?? Vec3.zero()) as T;
        out.x = Math.trunc(v.x);
        out.y = Math.trunc(v.y);
        out.z = Math.trunc(v.z);
        return out;
    }
    //// U
    export function unitDot(a: AnyVec3, b: AnyVec3) {
        const aLen = length(a);
        const bLen = length(b);
        if(aLen === 0 || bLen === 0)
            return 0;
        return (a.x * b.x + a.y * b.y + a.z * b.z) / (aLen * bLen);
    }
    //// Y
    export function yaw(v: AnyVec3): number {
        return Math.atan2(-v.x, -v.z);
    }
}