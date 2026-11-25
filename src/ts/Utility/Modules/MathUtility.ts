export namespace MathUtility {
    //// A*
    //// B*
    //// C*
    export function clamp(x: number, a: number, b: number): number {
        return Math.min(Math.max(x, a), b);
    }
    /**
     * @example
     * let angleDegrees = 320; // Angles wrap at an interval of 360
     * angleDegrees = MathUtils.convertWrappedValueToSmallestMagnitude(angleDegrees, 360); // Converts to range [-180, 180)
     * console.log(angleDegrees); // Outputs -40 (smaller magnitude and an equivalent angle)
     */
    export function convertWrappedValueToSmallestMagnitude(value: number, wrapInterval: number): number {
        const halfInterval = wrapInterval / 2;
        return pmod(value + halfInterval, wrapInterval) - halfInterval;
    }
    export function convertRadiansToSmallestMagnitude(angleRad: number): number {
        return convertWrappedValueToSmallestMagnitude(angleRad, RADIANS_FULL);
    }
    //// D*
    /** A full rotation in degrees = 360 */
    export const DEGREES_FULL = 360;
    /** Half a rotation in degrees = 180 */
    export const DEGREES_HALF = 180;
    export function degreesToRadians(x: number): number {
        return x * RADIANS_FULL / DEGREES_FULL;
    }
    //// E*
    /** Mixes linear interpolation and fixed stepping to reach a target value */
    export function easeAnimation(x: number, target: number, lerpT: number, stepT: number): number {
        return step(lerp(x, target, Math.min(lerpT, 1)), target, stepT);
    }
    export const EPSILON = 1e-7;
    //// F*
    //// G*
    export function getShortestWrappedDistance(from: number, to: number, interval: number): number {
        return convertWrappedValueToSmallestMagnitude(to - from, interval);
    }
    export function getShortestRadiansDistance(fromRad: number, toRad: number): number {
        return getShortestWrappedDistance(fromRad, toRad, RADIANS_FULL);
    }
    //// H*
    //// I*
    /** Returns true if two numbers are within distance `epsilon` of each other */
    export function isClose(a: number, b: number, epsilon: number = EPSILON) {
        return Math.abs(a - b) <= epsilon;
    }
    /** Returns true if within distance `epsilon` to zero */
    export function isZero(a: number, epsilon: number = EPSILON) {
        return Math.abs(a) <= epsilon;
    }
    //// J*
    //// K*
    //// L*
    export function lerp(a: number, b: number, t: number): number {
        return a + (b - a) * t;
    }
    /** Interpolates linearly between angles `a` and `b` in radians, taking the shortest circular path. */
    export function lerpRadians(a: number, b: number, t: number) {
        return lerpWrapped(a, b, RADIANS_FULL, t);
    }
    /** Interpolates linearly between angles `a` and `b` in degrees, taking the shortest circular path. */
    export function lerpDegrees(a: number, b: number, t: number) {
        return lerpWrapped(a, b, DEGREES_FULL, t);
    }
    /** Interpolates linearly between `a` and `b` in wrapped/circular space, taking the shortest path. */
    export function lerpWrapped(a: number, b: number, interval: number, t: number) {
        return a + getShortestWrappedDistance(a, b, interval) * t;
    }
    //// M*
    //// N*
    //// O*
    //// P*
    /** Modulo operation that always returns a positive number */
    export function pmod(x: number, n: number): number {
        return ((x % n) + n) % n;
    }
    //// Q*
    //// R*
    /** A full rotation in radians ≈ 6.28319 */
    export const RADIANS_FULL = 2 * Math.PI;
    /** Half a rotation in radians ≈ 3.14159 */
    export const RADIANS_HALF = Math.PI;
    export function radiansToDegrees(x: number): number {
        return x * DEGREES_FULL / RADIANS_FULL;
    }
    /** Generates a uniformly distributed random number in the specified range */
    export function random(a = 0, b = 1): number {
        return Math.random() * (b - a) + a;
    }
    /** Generates a random number following a bell-curve distribution, around the specified center.\
     * `stddev` is the average distance between a result and the center.
     */
    export function randomGaussian(center = 0, stddev = 1): number {
        const u1 = 1 - Math.random(); // (0, 1]
        const u2 = 1 - Math.random(); // (0, 1]
        const stdnorm = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        return center + stddev * stdnorm;
    }
    export function roundDecimals(x: number, decimals: number) {
        const p10 = Math.pow(10, decimals);
        return Math.round(x * p10) / p10;
    }
    //// S*
    /** Steps towards target b with a fixed step size of t, without overshooting the target */
    export function step(a: number, b: number, t: number): number {
        let d = Math.sign(b - a);
        return a + d * Math.min(t, Math.abs(b - a));
    }
    //// T*
    //// U*
    //// V*
    //// W*
    //// X*
    //// Y*
    //// Z*
}