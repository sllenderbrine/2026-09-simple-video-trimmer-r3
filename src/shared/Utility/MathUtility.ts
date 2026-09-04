export const EPSILON = 1e-7;

export function degreesToRadians(x: number) {
    return x * Math.PI / 180;
}

export function clamp(x: number, minX: number, maxX: number) {
    return Math.min(Math.max(x, minX), maxX);
}

export function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
}

export function lerpClamped(a: number, b: number, t: number) {
    return a + (b - a) * clamp(t, 0, 1);
}

export function pmod(x: number, n: number) {
    return ((x % n) + n) % n;
}

export function roundDecimals(x: number, decimals: number) {
    const p10 = Math.pow(10, decimals);
    return Math.round(x * p10) / p10;
}

export function isClose(a: number, b: number, e: number = EPSILON) {
    return Math.abs(a - b) <= e;
}

export function isZero(a: number, e: number = EPSILON) {
    return Math.abs(a) <= e
}