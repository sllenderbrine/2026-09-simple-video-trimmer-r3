export class Vec3 {
    constructor(public x: number, public y: number, public z: number) {

    }
    //// Constructors ////
    static zero(out?: Vec3): Vec3 {
        if(out === undefined)
            return new Vec3(0, 0, 0);
        out.x = 0;
        out.y = 0;
        out.z = 0;
        return out;
    }
    static copy(other: Vec3, out: Vec3 = Vec3.zero()): Vec3 {
        out.x = other.x;
        out.y = other.y;
        out.z = other.z;
        return out;
    }
    static fromComponents(x: number, y: number, z: number, out: Vec3 = Vec3.zero()): Vec3 {
        out.x = x;
        out.y = y;
        out.z = z;
        return out;
    }
    static fromScalar(s: number, out: Vec3 = Vec3.zero()): Vec3 {
        return Vec3.fromComponents(s, s, s, out);
    }
    static fromArray(arr: [number, number, number], out: Vec3 = Vec3.zero()): Vec3 {
        return Vec3.fromComponents(arr[0], arr[1], arr[2], out);
    }
    static fromRandomUnit(out: Vec3 = Vec3.zero()): Vec3 {
        const z = Math.random() * 2 - 1;
        const t = Math.random() * 2 * Math.PI;
        const m = Math.sqrt(Math.max(0, 1 - z * z));
        return Vec3.fromComponents(m * Math.cos(t), m * Math.sin(t), z, out);
    }
    static fromRandomUnitRotation(out: Vec3 = Vec3.zero()): Vec3 {
        const a = Vec3.fromRandomUnit();
        return Vec3.fromComponents(Vec3.getPitch(a), Vec3.getYaw(a), Math.random() * 2 * Math.PI, out);
    }
    //// Constants ////
    static ZERO = Object.freeze(Vec3.fromScalar(0));
    static ONE = Object.freeze(Vec3.fromScalar(1));
    static X_AXIS = Object.freeze(Vec3.fromComponents(1, 0, 0));
    static Y_AXIS = Object.freeze(Vec3.fromComponents(0, 1, 0));
    static Z_AXIS = Object.freeze(Vec3.fromComponents(0, 0, 1));
    static NX_AXIS = Object.freeze(Vec3.negate(Vec3.X_AXIS));
    static NY_AXIS = Object.freeze(Vec3.negate(Vec3.Y_AXIS));
    static NZ_AXIS = Object.freeze(Vec3.negate(Vec3.Z_AXIS));
    static FORWARD = Object.freeze(Vec3.fromComponents(0, 0, -1));
    static UP = Object.freeze(Vec3.fromComponents(0, 1, 0));
    static RIGHT = Object.freeze(Vec3.fromComponents(1, 0, 0));
    static BACK = Object.freeze(Vec3.negate(Vec3.FORWARD));
    static DOWN = Object.freeze(Vec3.negate(Vec3.UP));
    static LEFT = Object.freeze(Vec3.negate(Vec3.RIGHT));
    //// Conversions ////
    static clone(a: Vec3): Vec3 {
        return Vec3.copy(a);
    }
    static toArray(a: Vec3): [number, number, number] {
        return [a.x, a.y, a.z];
    }
    static toString(a: Vec3): string {
        return `<${a.x}, ${a.y}, ${a.z}>`;
    }
    static toKeyString(a: Vec3): string {
        return a.x + " " + a.y + " " + a.z;
    }
    //// Calculations ////
    static getLengthSq(a: Vec3): number {
        return a.x * a.x + a.y * a.y + a.z * a.z;
    }
    static getManhattanDistance(a: Vec3): number {
        return Math.abs(a.x) + Math.abs(a.y) + Math.abs(a.z);
    }
    static getLength(a: Vec3): number {
        return Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
    }
    static getPitch(a: Vec3): number {
        return Math.asin(a.y);
    }
    static getYaw(a: Vec3): number {
        return Math.atan2(-a.x, -a.z);
    }
    static getIsClose(a: Vec3, b: Vec3, e = 1e-6) {
        return Math.abs(a.x - b.x) < e && Math.abs(a.y - b.y) < e && Math.abs(a.z - b.z) < e;
    }
    static getIsZero(a: Vec3, e = 1e-6) {
        return Math.abs(a.x) < e && Math.abs(a.y) < e && Math.abs(a.z) < e;
    }
    static getIsNaN(a: Vec3) {
        return Number.isNaN(a.x) || Number.isNaN(a.y) || Number.isNaN(a.z);
    }
    static getIsFinite(a: Vec3) {
        return Number.isFinite(a.x) && Number.isFinite(a.y) && Number.isFinite(a.z);
    }
    static getDistSq(a: Vec3, b: Vec3): number {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dz = a.z - b.z;
        return dx * dx + dy * dy + dz * dz;
    }
    static getDist(a: Vec3, b: Vec3): number {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dz = a.z - b.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
    static getFlatDistSq(a: Vec3, b: Vec3): number {
        const dx = a.x - b.x;
        const dz = a.z - b.z;
        return dx * dx + dz * dz;
    }
    static getFlatDist(a: Vec3, b: Vec3): number {
        const dx = a.x - b.x;
        const dz = a.z - b.z;
        return Math.sqrt(dx * dx + dz * dz);
    }
    static getDot(a: Vec3, b: Vec3): number {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }
    static getAngle(a: Vec3, b: Vec3): number {
        const d = Math.sqrt(Vec3.getLengthSq(a) * Vec3.getDot(b, b));
        if(d === 0) return 0;
        return Math.acos(Math.min(Math.max(Vec3.getDot(a, b) / d, -1), 1));
    }
    static getSignedAngle(a: Vec3, b: Vec3, normal: Vec3 = Vec3.UP): number {
        const cx = a.y * b.z - a.z * b.y;
        const cy = a.z * b.x - a.x * b.z;
        const cz = a.x * b.y - a.y * b.x;
        const crossLength = Math.sqrt(cx * cx + cy * cy + cz * cz);
        const dot = Vec3.getDot(a, b);
        const angle = Math.atan2(crossLength, dot);
        const crossNormalDot = cx * normal.x + cy * normal.y + cz * normal.z;
        return crossNormalDot < 0 ? -angle : angle;
    }
    static strictEquals(a: Vec3, b: Vec3): boolean {
        return a.x === b.x && a.y === b.y && a.z === b.z;
    }
    //// Operations ////
    static add(a: Vec3, b: Vec3, out: Vec3 = Vec3.zero()): Vec3 {
        out.x = a.x + b.x;
        out.y = a.y + b.y;
        out.z = a.z + b.z;
        return out;
    }
    static addScalar(a: Vec3, s: number, out: Vec3 = Vec3.zero()): Vec3 {
        out.x = a.x + s;
        out.y = a.y + s;
        out.z = a.z + s;
        return out;
    }
    static addScaled(a: Vec3, b: Vec3, t: number, out: Vec3 = Vec3.zero()): Vec3 {
        out.x = a.x + b.x * t;
        out.y = a.y + b.y * t;
        out.z = a.z + b.z * t;
        return out;
    }
    static sub(a: Vec3, b: Vec3, out: Vec3 = Vec3.zero()): Vec3 {
        out.x = a.x - b.x;
        out.y = a.y - b.y;
        out.z = a.z - b.z;
        return out;
    }
    static subScalar(a: Vec3, s: number, out: Vec3 = Vec3.zero()): Vec3 {
        out.x = a.x - s;
        out.y = a.y - s;
        out.z = a.z - s;
        return out;
    }
    static rsubScalar(a: Vec3, s: number, out: Vec3 = Vec3.zero()): Vec3 {
        out.x = s - a.x;
        out.y = s - a.y;
        out.z = s - a.z;
        return out;
    }
    static mul(a: Vec3, b: Vec3, out: Vec3 = Vec3.zero()): Vec3 {
        out.x = a.x * b.x;
        out.y = a.y * b.y;
        out.z = a.z * b.z;
        return out;
    }
    static mulScalar(a: Vec3, s: number, out: Vec3 = Vec3.zero()): Vec3 {
        out.x = a.x * s;
        out.y = a.y * s;
        out.z = a.z * s;
        return out;
    }
    static div(a: Vec3, b: Vec3, out: Vec3 = Vec3.zero()): Vec3 {
        out.x = a.x / b.x;
        out.y = a.y / b.y;
        out.z = a.z / b.z;
        return out;
    }
    static divScalar(a: Vec3, s: number, out: Vec3 = Vec3.zero()): Vec3 {
        out.x = a.x / s;
        out.y = a.y / s;
        out.z = a.z / s;
        return out;
    }
    static rdivScalar(a: Vec3, s: number, out: Vec3 = Vec3.zero()): Vec3 {
        out.x = s / a.x;
        out.y = s / a.y;
        out.z = s / a.z;
        return out;
    }
    static negate(a: Vec3, out: Vec3 = Vec3.zero()): Vec3 {
        out.x = -a.x;
        out.y = -a.y;
        out.z = -a.z;
        return out;
    }
    static cross(a: Vec3, b: Vec3, out: Vec3 = Vec3.zero()): Vec3 {
        const cx = a.y * b.z - a.z * b.y;
        const cy = a.z * b.x - a.x * b.z;
        const cz = a.x * b.y - a.y * b.x;
        out.x = cx;
        out.y = cy;
        out.z = cz;
        return out;
    }
    static TEMP_VEC_0 = Vec3.zero();
    static TEMP_VEC_1 = Vec3.zero();
    static randomPerpendicularUnit(a: Vec3, out: Vec3 = Vec3.zero()): Vec3 {
        let nonParallel: Vec3;
        const absX = Math.abs(a.x);
        const absY = Math.abs(a.y);
        const absZ = Math.abs(a.z);
        if(absX + absY + absZ < 1e-7) {
            return Vec3.fromRandomUnit(out);
        }
        if(absX <= absY && absX <= absZ) {
            nonParallel = Vec3.X_AXIS;
        } else if(absY <= absX && absY <= absZ) {
            nonParallel = Vec3.Y_AXIS;
        } else {
            nonParallel = Vec3.Z_AXIS;
        }
        Vec3.norm(a, Vec3.TEMP_VEC_1);
        Vec3.cross(Vec3.TEMP_VEC_1, nonParallel, Vec3.TEMP_VEC_0);
        Vec3.norm(Vec3.TEMP_VEC_0, Vec3.TEMP_VEC_0);
        return Vec3.rotateAxis(Vec3.TEMP_VEC_0, Vec3.TEMP_VEC_1, Math.random() * 2 * Math.PI, out);
    }
    static norm(a: Vec3, out: Vec3 = Vec3.zero()): Vec3 {
        const len = Vec3.getLength(a);
        if(len === 0) return Vec3.copy(a, out);
        out.x = a.x / len;
        out.y = a.y / len;
        out.z = a.z / len;
        return out;
    }
    static lerp(a: Vec3, b: Vec3, t: number, out: Vec3 = Vec3.zero()): Vec3 {
        out.x = a.x + (b.x - a.x) * t;
        out.y = a.y + (b.y - a.y) * t;
        out.z = a.z + (b.z - a.z) * t;
        return out;
    }
    static lerpClamped(a: Vec3, b: Vec3, t: number, out: Vec3 = Vec3.zero()): Vec3 {
        t = Math.min(Math.max(t, 0), 1);
        out.x = a.x + (b.x - a.x) * t;
        out.y = a.y + (b.y - a.y) * t;
        out.z = a.z + (b.z - a.z) * t;
        return out;
    }
    static look(a: Vec3, b: Vec3, out: Vec3 = Vec3.zero()): Vec3 {
        return Vec3.norm(Vec3.sub(b, a, out), out);
    }
    static lookFlat(a: Vec3, b: Vec3, out: Vec3 = Vec3.zero()): Vec3 {
        return Vec3.flatNorm(Vec3.sub(b, a, out), out);
    }
    static rescale(a: Vec3, s: number, out: Vec3 = Vec3.zero()): Vec3 {
        return Vec3.mulScalar(Vec3.norm(a, out), s, out);
    }
    static flat(a: Vec3, out: Vec3 = Vec3.zero()): Vec3 {
        out.x = a.x;
        out.y = 0;
        out.z = a.z;
        return out;
    }
    static flatNorm(a: Vec3, out: Vec3 = Vec3.zero()): Vec3 {
        return Vec3.norm(Vec3.flat(a, out), out);
    }
    static map(a: Vec3, callback: (v: number, i: number) => number, out: Vec3 = Vec3.zero()): Vec3 {
        out.x = callback(a.x, 0);
        out.y = callback(a.y, 1);
        out.z = callback(a.z, 2);
        return out;
    }
    static floor(a: Vec3, out: Vec3 = Vec3.zero()): Vec3 {
        out.x = Math.floor(a.x);
        out.y = Math.floor(a.y);
        out.z = Math.floor(a.z);
        return out;
    }
    static round(a: Vec3, out: Vec3 = Vec3.zero()): Vec3 {
        out.x = Math.round(a.x);
        out.y = Math.round(a.y);
        out.z = Math.round(a.z);
        return out;
    }
    static ceil(a: Vec3, out: Vec3 = Vec3.zero()): Vec3 {
        out.x = Math.ceil(a.x);
        out.y = Math.ceil(a.y);
        out.z = Math.ceil(a.z);
        return out;
    }
    static addScaledTargetDot(a: Vec3, b: Vec3, target: number, out: Vec3 = Vec3.zero()): Vec3 {
        const d = Vec3.getLengthSq(b);
        if(d === 0) return Vec3.copy(b, out);
        const t = (target - Vec3.getDot(a, b)) / d;
        out.x = a.x + b.x * t;
        out.y = a.y + b.y * t;
        out.z = a.z + b.z * t;
        return out;
    }
    static clampLength(a: Vec3, min: number, max: number, out: Vec3 = Vec3.zero()): Vec3 {
        const len = Vec3.getLength(a);
        if(len < min) return Vec3.rescale(a, min, out);
        else if(len > max) return Vec3.rescale(a, max, out);
        return Vec3.copy(a, out);
    }
    static applyMatrix(a: Vec3, b: Float32Array, out: Vec3 = Vec3.zero()): Vec3 {
        const x = a.x;
        const y = a.y;
        const z = a.z;
        out.x = b[0]!*x + b[4]!*y + b[8]!*z + b[12]!;
        out.y = b[1]!*x + b[5]!*y + b[9]!*z + b[13]!;
        out.z = b[2]!*x + b[6]!*y + b[10]!*z + b[14]!;
        return out;
    }
    static applyProjection(a: Vec3, b: Float32Array, out: Vec3 = Vec3.zero()): Vec3 {
        const x = a.x;
        const y = a.y;
        const z = a.z;
        const w = b[3]! * x + b[7]! * y + b[11]! * z + b[15]!;
        out.x = (b[0]!*x + b[4]!*y + b[8]!*z + b[12]!) / w;
        out.y = (b[1]!*x + b[5]!*y + b[9]!*z + b[13]!) / w;
        out.z = (b[2]!*x + b[6]!*y + b[10]!*z + b[14]!) / w;
        return out;
    }
    static rotateX(a: Vec3, t: number, out: Vec3 = Vec3.zero()): Vec3 {
        const s = Math.sin(t);
        const c = Math.cos(t);
        return Vec3.fromComponents(
            a.x,
            a.y * c - a.z * s,
            a.y * s + a.z * c,
            out
        );
    }
    static rotateY(a: Vec3, t: number, out: Vec3 = Vec3.zero()): Vec3 {
        const s = Math.sin(t);
        const c = Math.cos(t);
        return Vec3.fromComponents(
            a.x * c + a.z * s,
            a.y,
            a.z * c - a.x * s,
            out
        );
    }
    static rotateZ(a: Vec3, t: number, out: Vec3 = Vec3.zero()): Vec3 {
        const s = Math.sin(t);
        const c = Math.cos(t);
        return Vec3.fromComponents(
            a.x * c - a.y * s,
            a.x * s + a.y * c,
            a.z,
            out
        );
    }
    static rotateAxis(a: Vec3, normal: Vec3, t: number, out: Vec3 = Vec3.zero()): Vec3 {
        const s = Math.sin(t);
        const c = Math.cos(t);
        const crossX = a.y * normal.z - a.z * normal.y;
        const crossY = a.z * normal.x - a.x * normal.z;
        const crossZ = a.x * normal.y - a.y * normal.x;
        const dot = Vec3.getDot(a, normal);
        out.x = a.x * c + crossX * s + normal.x * dot * (1 - c);
        out.y = a.y * c + crossY * s + normal.y * dot * (1 - c);
        out.z = a.z * c + crossZ * s + normal.z * dot * (1 - c);
        return out;
    }
    static rotateXyz(a: Vec3, rx: number, ry: number, rz: number, out: Vec3 = Vec3.zero()): Vec3 {
        return Vec3.rotateZ(Vec3.rotateY(Vec3.rotateX(a, rx, out), ry, out), rz, out);
    }
    static rotateZyx(a: Vec3, rx: number, ry: number, rz: number, out: Vec3 = Vec3.zero()): Vec3 {
        return Vec3.rotateX(Vec3.rotateY(Vec3.rotateZ(a, rz, out), ry, out), rx, out);
    }
    //// Non-static constructors ////
    zero() {
        return Vec3.zero(this);
    }
    copy(other: Vec3) {
        return Vec3.copy(other, this);
    }
    fromComponents(x: number, y: number, z: number) {
        return Vec3.fromComponents(x, y, z, this);
    }
    fromScalar(s: number) {
        return Vec3.fromScalar(s, this);
    }
    fromArray(arr: [number, number, number]) {
        return Vec3.fromArray(arr, this);
    }
    fromRandomUnit() {
        return Vec3.fromRandomUnit(this);
    }
    fromRandomUnitRotation() {
        return Vec3.fromRandomUnitRotation(this);
    }
    //// Non-static conversions ////
    clone(out?: Vec3) {
        return Vec3.copy(this, out);
    }
    toArray() {
        return Vec3.toArray(this);
    }
    toString() {
        return Vec3.toString(this);
    }
    toKeyString() {
        return Vec3.toKeyString(this);
    }
    //// Non-static calculations ////
    lengthSq() {
        return Vec3.getLengthSq(this);
    }
    manhattanDistance() {
        return Vec3.getManhattanDistance(this);
    }
    length() {
        return Vec3.getLength(this);
    }
    pitch() {
        return Vec3.getPitch(this);
    }
    yaw() {
        return Vec3.getYaw(this);
    }
    isClose(other: Vec3, e = 1e-6) {
        return Vec3.getIsClose(this, other, e);
    }
    isZero(e = 1e-6) {
        return Vec3.getIsZero(this, e);
    }
    isNaN() {
        return Vec3.getIsNaN(this);
    }
    isFinite() {
        return Vec3.getIsFinite(this);
    }
    distSq(other: Vec3) {
        return Vec3.getDistSq(this, other);
    }
    dist(other: Vec3) {
        return Vec3.getDist(this, other);
    }
    flatDistSq(other: Vec3) {
        return Vec3.getFlatDistSq(this, other);
    }
    flatDist(other: Vec3) {
        return Vec3.getFlatDist(this, other);
    }
    dot(other: Vec3) {
        return Vec3.getDot(this, other);
    }
    angle(other: Vec3) {
        return Vec3.getAngle(this, other);
    }
    signedAngle(other: Vec3, normal: Vec3 = Vec3.UP) {
        return Vec3.getSignedAngle(this, other, normal);
    }
    strictEquals(other: Vec3) {
        return Vec3.strictEquals(this, other);
    }
    //// Non-static operations ////
    add(other: Vec3, out?: Vec3) {
        return Vec3.add(this, other, out);
    }
    addScalar(s: number, out?: Vec3) {
        return Vec3.addScalar(this, s, out);
    }
    addScaled(other: Vec3, s: number, out?: Vec3) {
        return Vec3.addScaled(this, other, s, out);
    }
    sub(other: Vec3, out?: Vec3) {
        return Vec3.sub(this, other, out);
    }
    subScalar(s: number, out?: Vec3) {
        return Vec3.subScalar(this, s, out);
    }
    rsub(other: Vec3, out?: Vec3) {
        return Vec3.sub(other, this, out);
    }
    rsubScalar(s: number, out?: Vec3) {
        return Vec3.rsubScalar(this, s, out);
    }
    mul(other: Vec3, out?: Vec3) {
        return Vec3.mul(this, other, out);
    }
    mulScalar(s: number, out?: Vec3) {
        return Vec3.mulScalar(this, s, out);
    }
    div(other: Vec3, out?: Vec3) {
        return Vec3.div(this, other, out);
    }
    divScalar(s: number, out?: Vec3) {
        return Vec3.divScalar(this, s, out);
    }
    rdiv(other: Vec3, out?: Vec3) {
        return Vec3.div(other, this, out);
    }
    rdivScalar(s: number, out?: Vec3) {
        return Vec3.rdivScalar(this, s, out);
    }
    negate(out?: Vec3) {
        return Vec3.negate(this, out);
    }
    cross(other: Vec3, out?: Vec3) {
        return Vec3.cross(this, other, out);
    }
    randomPerpendicularUnit(out?: Vec3) {
        return Vec3.randomPerpendicularUnit(this, out);
    }
    norm(out?: Vec3) {
        return Vec3.norm(this, out);
    }
    lerp(other: Vec3, t: number, out?: Vec3) {
        return Vec3.lerp(this, other, t, out);
    }
    lerpClamped(other: Vec3, t: number, out?: Vec3) {
        return Vec3.lerpClamped(this, other, t, out);
    }
    look(other: Vec3, out?: Vec3) {
        return Vec3.look(this, other, out);
    }
    lookFlat(other: Vec3, out?: Vec3) {
        return Vec3.lookFlat(this, other, out);
    }
    rescale(s: number, out?: Vec3) {
        return Vec3.rescale(this, s, out);
    }
    flat(out?: Vec3) {
        return Vec3.flat(this, out);
    }
    flatNorm(out?: Vec3) {
        return Vec3.flatNorm(this, out);
    }
    map(callback: (v: number, i: number) => number, out?: Vec3) {
        return Vec3.map(this, callback, out);
    }
    floor(out?: Vec3) {
        return Vec3.floor(this, out);
    }
    round(out?: Vec3) {
        return Vec3.round(this, out);
    }
    ceil(out?: Vec3) {
        return Vec3.ceil(this, out);
    }
    addScaledTargetDot(other: Vec3, target: number, out?: Vec3) {
        return Vec3.addScaledTargetDot(this, other, target, out);
    }
    clampLength(min: number, max: number, out?: Vec3) {
        return Vec3.clampLength(this, min, max, out);
    }
    applyMatrix(m: Float32Array, out?: Vec3) {
        return Vec3.applyMatrix(this, m, out);
    }
    applyProjection(m: Float32Array, out?: Vec3) {
        return Vec3.applyProjection(this, m, out);
    }
    rotateX(t: number, out?: Vec3) {
        return Vec3.rotateX(this, t, out);
    }
    rotateY(t: number, out?: Vec3) {
        return Vec3.rotateY(this, t, out);
    }
    rotateZ(t: number, out?: Vec3) {
        return Vec3.rotateZ(this, t, out);
    }
    rotateAxis(normal: Vec3, t: number, out?: Vec3) {
        return Vec3.rotateAxis(this, normal, t, out);
    }
    rotateXyz(rx: number, ry: number, rz: number, out?: Vec3) {
        return Vec3.rotateXyz(this, rx, ry, rz, out);
    }
    rotateZyx(rx: number, ry: number, rz: number, out?: Vec3) {
        return Vec3.rotateZyx(this, rx, ry, rz, out);
    }
    //// Non-static self-operations ////
    addSelf(other: Vec3) {
        return Vec3.add(this, other, this);
    }
    addScalarSelf(s: number) {
        return Vec3.addScalar(this, s, this);
    }
    addScaledSelf(other: Vec3, s: number) {
        return Vec3.addScaled(this, other, s, this);
    }
    subSelf(other: Vec3) {
        return Vec3.sub(this, other, this);
    }
    subScalarSelf(s: number) {
        return Vec3.subScalar(this, s, this);
    }
    rsubSelf(other: Vec3) {
        return Vec3.sub(other, this, this);
    }
    rsubScalarSelf(s: number) {
        return Vec3.rsubScalar(this, s, this);
    }
    mulSelf(other: Vec3) {
        return Vec3.mul(this, other, this);
    }
    mulScalarSelf(s: number) {
        return Vec3.mulScalar(this, s, this);
    }
    divSelf(other: Vec3) {
        return Vec3.div(this, other, this);
    }
    divScalarSelf(s: number) {
        return Vec3.divScalar(this, s, this);
    }
    rdivSelf(other: Vec3) {
        return Vec3.div(other, this, this);
    }
    rdivScalarSelf(s: number) {
        return Vec3.rdivScalar(this, s, this);
    }
    negateSelf() {
        return Vec3.negate(this, this);
    }
    crossSelf(other: Vec3) {
        return Vec3.cross(this, other, this);
    }
    randomPerpendicularUnitSelf() {
        return Vec3.randomPerpendicularUnit(this, this);
    }
    normSelf() {
        return Vec3.norm(this, this);
    }
    lerpSelf(other: Vec3, t: number) {
        return Vec3.lerp(this, other, t, this);
    }
    lerpClampedSelf(other: Vec3, t: number) {
        return Vec3.lerpClamped(this, other, t, this);
    }
    lookSelf(other: Vec3) {
        return Vec3.look(this, other, this);
    }
    rescaleSelf(s: number) {
        return Vec3.rescale(this, s, this);
    }
    flatSelf() {
        return Vec3.flat(this, this);
    }
    flatNormSelf() {
        return Vec3.flatNorm(this, this);
    }
    mapSelf(callback: (v: number, i: number) => number) {
        return Vec3.map(this, callback, this);
    }
    floorSelf() {
        return Vec3.floor(this, this);
    }
    roundSelf() {
        return Vec3.round(this, this);
    }
    ceilSelf() {
        return Vec3.ceil(this, this);
    }
    addScaledTargetDotSelf(other: Vec3, target: number) {
        return Vec3.addScaledTargetDot(this, other, target, this);
    }
    clampLengthSelf(min: number, max: number) {
        return Vec3.clampLength(this, min, max, this);
    }
    applyMatrixSelf(m: Float32Array) {
        return Vec3.applyMatrix(this, m, this);
    }
    applyProjectionSelf(m: Float32Array) {
        return Vec3.applyProjection(this, m, this);
    }
    rotateXSelf(t: number) {
        return Vec3.rotateX(this, t, this);
    }
    rotateYSelf(t: number) {
        return Vec3.rotateY(this, t, this);
    }
    rotateZSelf(t: number) {
        return Vec3.rotateZ(this, t, this);
    }
    rotateAxisSelf(normal: Vec3, t: number) {
        return Vec3.rotateAxis(this, normal, t, this);
    }
    rotateXyzSelf(rx: number, ry: number, rz: number) {
        return Vec3.rotateXyz(this, rx, ry, rz, this);
    }
    rotateZyxSelf(rx: number, ry: number, rz: number) {
        return Vec3.rotateZyx(this, rx, ry, rz, this);
    }
}