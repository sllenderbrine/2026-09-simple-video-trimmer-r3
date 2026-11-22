import { Vec3Math } from "./Vec3Math.js";

type AnyVec3 = Vec3Math.AnyVec3;

export class Vec3 {
    public x: number;
    public y: number;
    public z: number;
    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    *[Symbol.iterator]() {
        yield this.x;
        yield this.y;
        yield this.z;
    }
    //// A*
    public abs<T extends AnyVec3 = Vec3>(out?: T) {
        return Vec3Math.abs(this, out);
    }
    public absSelf() {
        return Vec3Math.abs(this, this);
    }
    public add<T extends AnyVec3 = Vec3>(b: AnyVec3, out?: T) {
        return Vec3Math.add(this, b, out);
    }
    public addScalar<T extends AnyVec3 = Vec3>(b: number, out?: T) {
        return Vec3Math.addScalar(this, b, out);
    }
    public addScalarSelf(b: number) {
        return Vec3Math.addScalar(this, b, this);
    }
    public addScaled<T extends AnyVec3 = Vec3>(b: AnyVec3, scalar: number, out?: T) {
        return Vec3Math.addScaled(this, b, scalar, out);
    }
    public addScaledSelf(b: AnyVec3, scalar: number) {
        return Vec3Math.addScaled(this, b, scalar, this);
    }
    public addSelf(b: AnyVec3) {
        return Vec3Math.add(this, b, this);
    }
    public angleBetween(b: AnyVec3): number {
        return Vec3Math.angleBetween(this, b);
    }
    public average<T extends AnyVec3 = Vec3>(b: AnyVec3, out?: T) {
        return Vec3Math.average(this, b, out);
    }
    public averageSelf(b: AnyVec3) {
        return Vec3Math.average(this, b, this);
    }
    //// B*
    //// C*
    public ceil<T extends AnyVec3 = Vec3>(out?: T) {
        return Vec3Math.ceil(this, out);
    }
    public ceilSelf() {
        return Vec3Math.ceil(this, this);
    }
    public clampComponents<T extends AnyVec3 = Vec3>(min: AnyVec3, max: AnyVec3, out?: T) {
        return Vec3Math.clampComponents(this, min, max, out);
    }
    public clampComponentsScalar<T extends AnyVec3 = Vec3>(min: number, max: number, out?: T) {
        return Vec3Math.clampComponentsScalar(this, min, max, out);
    }
    public clampComponentsScalarSelf(min: number, max: number) {
        return Vec3Math.clampComponentsScalar(this, min, max, this);
    }
    public clampComponentsSelf(min: AnyVec3, max: AnyVec3) {
        return Vec3Math.clampComponents(this, min, max, this);
    }
    public clampLength<T extends AnyVec3 = Vec3>(min: AnyVec3, max: AnyVec3, out?: T) {
        return Vec3Math.clampLength(this, min, max, out);
    }
    public clampLengthScalar<T extends AnyVec3 = Vec3>(min: number, max: number, out?: T) {
        return Vec3Math.clampLengthScalar(this, min, max, out);
    }
    public clampLengthScalarSelf(min: number, max: number) {
        return Vec3Math.clampLengthScalar(this, min, max, this);
    }
    public clone<T extends AnyVec3 = Vec3>(out?: T) {
        return Vec3Math.clone(this, out);
    }
    public cloneSelf() {
        return Vec3Math.clone(this, this);
    }
    public compareLength(b: AnyVec3, epsilon: number = 1e-6): number {
        return Vec3Math.compareLength(this, b, epsilon);
    }
    public componentProduct(): number {
        return Vec3Math.componentProduct(this);
    }
    public componentSum(): number {
        return Vec3Math.componentSum(this);
    }
    public cross<T extends AnyVec3 = Vec3>(b: AnyVec3, out?: T): T {
        return Vec3Math.cross(this, b, out);
    }
    //// D*
    public dist(b: AnyVec3): number {
        return Vec3Math.dist(this, b);
    }
    public distSq(b: AnyVec3): number {
        return Vec3Math.distSq(this, b);
    }
    public div<T extends AnyVec3 = Vec3>(b: AnyVec3, out?: T) {
        return Vec3Math.div(this, b, out);
    }
    public divScalar<T extends AnyVec3 = Vec3>(b: number, out?: T) {
        return Vec3Math.divScalar(this, b, out);
    }
    public divScalarSelf(b: number) {
        return Vec3Math.divScalar(this, b, this);
    }
    public divSelf(b: AnyVec3) {
        return Vec3Math.div(this, b, this);
    }
    public dot(b: AnyVec3): number {
        return Vec3Math.dot(this, b);
    }
    //// E*
    //// F*
    public floor<T extends AnyVec3 = Vec3>(out?: T) {
        return Vec3Math.floor(this, out);
    }
    public floorSelf() {
        return Vec3Math.floor(this, this);
    }
    public forEach(callback: (value: number, index: number, vector: AnyVec3) => void): AnyVec3 {
        return Vec3Math.forEach(this, callback);
    }
    public fract<T extends AnyVec3 = Vec3>(out?: T) {
        return Vec3Math.fract(this, out);
    }
    public fractSelf() {
        return Vec3Math.fract(this, this);
    }
    public fromArray<T extends AnyVec3 = Vec3>(arr: [number, number, number], out?: T) {
        return Vec3Math.fromArray(arr, out);
    }
    public fromArraySelf(arr: [number, number, number]) {
        return Vec3Math.fromArray(arr, this);
    }
    public fromObject<T extends AnyVec3 = Vec3>(obj: AnyVec3, out?: T) {
        return Vec3Math.fromObject(obj, out);
    }
    public fromObjectSelf(obj: AnyVec3) {
        return Vec3Math.fromObject(obj, this);
    }
    //// G*
    public get(i: number | string): number | undefined {
        switch(i) {
            case 0: return this.x;
            case 1: return this.y;
            case 2: return this.z;
            case 'x': return this.x;
            case 'y': return this.y;
            case 'z': return this.z;
            default: return undefined;
        }
    }
    //// H*
    //// I*
    public isEqual(b: AnyVec3): boolean {
        return Vec3Math.isEqual(this, b);
    }
    public isEqualScalar(scalar: number): boolean {
        return Vec3Math.isEqualScalar(this, scalar);
    }
    public isFinite(): boolean {
        return Vec3Math.isFinite(this);
    }
    public isGreaterThan(b: AnyVec3): boolean {
        return Vec3Math.isGreaterThan(this, b);
    }
    public isGreaterThanScalar(scalar: number): boolean {
        return Vec3Math.isGreaterThanScalar(this, scalar);
    }
    public isInteger(): boolean {
        return Vec3Math.isInteger(this);
    }
    public isLessThan(b: AnyVec3): boolean {
        return Vec3Math.isLessThan(this, b);
    }
    public isLessThanScalar(scalar: number): boolean {
        return Vec3Math.isLessThanScalar(this, scalar);
    }
    public isParallel(b: AnyVec3, epsilon: number = 1e-6): boolean {
        return Vec3Math.isParallel(this, b, epsilon);
    }
    public isPerpendicular(b: AnyVec3, epsilon: number = 1e-6): boolean {
        return Vec3Math.isPerpendicular(this, b, epsilon);
    }
    public isNaN(): boolean {
        return Vec3Math.isNaN(this);
    }
    public isSimilar(b: AnyVec3, epsilon: number = 1e-6): boolean {
        return Vec3Math.isSimilar(this, b, epsilon);
    }
    public isSimilarScalar(scalar: number, epsilon: number = 1e-6): boolean {
        return Vec3Math.isSimilarScalar(this, scalar, epsilon);
    }
    public isSimilarZero(epsilon: number = 1e-6): boolean {
        return Vec3Math.isSimilarZero(this, epsilon);
    }
    public isUnit(epsilon: number = 1e-6): boolean {
        return Vec3Math.isUnit(this, epsilon);
    }
    public isZero(): boolean {
        return Vec3Math.isZero(this);
    }
    //// J*
    //// K*
    //// L*
    public length(): number {
        return Vec3Math.length(this);
    }
    public lengthSq(): number {
        return Vec3Math.lengthSq(this);
    }
    public lerp<T extends AnyVec3 = Vec3>(b: AnyVec3, t: number, out?: T) {
        return Vec3Math.lerp(this, b, t, out);
    }
    public lerpSelf(b: AnyVec3, t: number) {
        return Vec3Math.lerp(this, b, t, this);
    }
    public look<T extends AnyVec3 = Vec3>(b: AnyVec3, out?: T) {
        return Vec3Math.look(this, b, out);
    }
    public lookSelf(b: AnyVec3) {
        return Vec3Math.look(this, b, this);
    }
    //// M*
    public manhattanDist(b: AnyVec3): number {
        return Vec3Math.manhattanDist(this, b);
    }
    public manhattanLength(): number {
        return Vec3Math.manhattanLength(this);
    }
    public map(callback: (value: number, index: number, vector: AnyVec3) => number, out: AnyVec3) {
        return Vec3Math.map(this, callback, out);
    }
    public mapSelf(callback: (value: number, index: number, vector: AnyVec3) => number) {
        return Vec3Math.map(this, callback, this);
    }
    public max<T extends AnyVec3 = Vec3>(b: AnyVec3, out?: T) {
        return Vec3Math.max(this, b, out);
    }
    public maxLength<T extends AnyVec3 = Vec3>(max: number, out?: T) {
        return Vec3Math.maxLength(this, max, out);
    }
    public maxLengthSelf(max: number) {
        return Vec3Math.maxLength(this, max, this);
    }
    public maxScalar<T extends AnyVec3 = Vec3>(max: number, out?: T) {
        return Vec3Math.maxScalar(this, max, out);
    }
    public maxScalarSelf(max: number) {
        return Vec3Math.maxScalar(this, max, this);
    }
    public maxSelf(b: AnyVec3) {
        return Vec3Math.max(this, b, this);
    }
    public min<T extends AnyVec3 = Vec3>(b: AnyVec3, out?: T) {
        return Vec3Math.min(this, b, out);
    }
    public minLength<T extends AnyVec3 = Vec3>(min: number, out?: T) {
        return Vec3Math.minLength(this, min, out);
    }
    public minLengthSelf(min: number) {
        return Vec3Math.minLength(this, min, this);
    }
    public minScalar<T extends AnyVec3 = Vec3>(min: number, out?: T) {
        return Vec3Math.minScalar(this, min, out);
    }
    public minScalarSelf(min: number) {
        return Vec3Math.minScalar(this, min, this);
    }
    public minSelf(b: AnyVec3) {
        return Vec3Math.min(this, b, this);
    }
    public mul<T extends AnyVec3 = Vec3>(b: AnyVec3, out?: T) {
        return Vec3Math.mul(this, b, out);
    }
    public mulScalar<T extends AnyVec3 = Vec3>(b: number, out?: T) {
        return Vec3Math.mulScalar(this, b, out);
    }
    public mulScalarSelf(b: number) {
        return Vec3Math.mulScalar(this, b, this);
    }
    public mulSelf(b: AnyVec3) {
        return Vec3Math.mul(this, b, this);
    }
    //// N*
    public negate<T extends AnyVec3 = Vec3>(out?: T) {
        return Vec3Math.negate(this, out);
    }
    public negateSelf() {
        return Vec3Math.negate(this, this);
    }
    public norm<T extends AnyVec3 = Vec3>(out?: T) {
        return Vec3Math.norm(this, out);
    }
    public normSelf() {
        return Vec3Math.norm(this, this);
    }
    //// O*
    //// P*
    public pow<T extends AnyVec3 = Vec3>(exponent: number, out?: T) {
        return Vec3Math.pow(this, exponent, out);
    }
    public powSelf(exponent: number) {
        return Vec3Math.pow(this, exponent, this);
    }
    public project<T extends AnyVec3 = Vec3>(b: AnyVec3, out?: T) {
        return Vec3Math.project(this, b, out);
    }
    public projectSelf(b: AnyVec3) {
        return Vec3Math.project(this, b, this);
    }
    //// Q*
    //// R*
    public rdivScalar<T extends AnyVec3 = Vec3>(b: number, out?: T) {
        return Vec3Math.rdivScalar(this, b, out);
    }
    public rdivScalarSelf(b: number) {
        return Vec3Math.rdivScalar(this, b, this);
    }
    public reciprocal<T extends AnyVec3 = Vec3>(out?: T) {
        return Vec3Math.reciprocal(this, out);
    }
    public reduce<T>(callback: (previous: T, value: number, index: number, vector: AnyVec3) => T, initial: T): T;
    public reduce(callback: (previous: number, value: number, index: number, vector: AnyVec3) => number): number;
    public reduce<T>(callback: ((previous: T, value: number, index: number, vector: AnyVec3) => T) | ((previous: number, value: number, index: number, vector: AnyVec3) => number), initial?: T): T | number {
        if(arguments.length === 2) return Vec3Math.reduce(this, callback as (previous: T, value: number, index: number, vector: AnyVec3) => T, initial as T);
        return Vec3Math.reduce(this, callback as (previous: number, value: number, index: number, vector: AnyVec3) => number);
    }
    public reciprocalSelf() {
        return Vec3Math.reciprocal(this, this);
    }
    public reflect<T extends AnyVec3 = Vec3>(normal: AnyVec3, out?: T) {
        return Vec3Math.reflect(this, normal, out);
    }
    public reflectSelf(normal: AnyVec3) {
        return Vec3Math.reflect(this, normal, this);
    }
    public rescale<T extends AnyVec3 = Vec3>(len: number, out?: T) {
        return Vec3Math.rescale(this, len, out);
    }
    public rescaleSelf(len: number) {
        return Vec3Math.rescale(this, len, this);
    }
    public rotateAxis<T extends AnyVec3>(v: AnyVec3, axis: AnyVec3, angle: number, out?: T) {
        return Vec3Math.rotateAxis(v, axis, angle, out);
    }
    public rotateLerp<T extends AnyVec3>(a: AnyVec3, b: AnyVec3, normal: AnyVec3, t: number, out?: T) {
        return Vec3Math.rotateLerp(a, b, normal, t, out);
    }
    public rotateTowards<T extends AnyVec3>(a: AnyVec3, b: AnyVec3, normal: AnyVec3, angle: number, out?: T) {
        return Vec3Math.rotateTowards(a, b, normal, angle, out);
    }
    public rotateX<T extends AnyVec3>(v: AnyVec3, angle: number, out?: T) {
        return Vec3Math.rotateX(v, angle, out);
    }
    public rotateXyz<T extends AnyVec3>(v: AnyVec3, rotation: AnyVec3, out?: T) {
        return Vec3Math.rotateXyz(v, rotation, out);
    }
    public rotateXyzAround<T extends AnyVec3>(v: AnyVec3, origin: AnyVec3, rotation: AnyVec3, out?: T) {
        return Vec3Math.rotateXyzAround(v, origin, rotation, out);
    }
    public rotateY<T extends AnyVec3>(v: AnyVec3, angle: number, out?: T) {
        return Vec3Math.rotateY(v, angle, out);
    }
    public rotateZ<T extends AnyVec3>(v: AnyVec3, angle: number, out?: T) {
        return Vec3Math.rotateZ(v, angle, out);
    }
    public rotateZyx<T extends AnyVec3>(v: AnyVec3, rotation: AnyVec3, out?: T) {
        return Vec3Math.rotateZyx(v, rotation, out);
    }
    public rotateZyxAround<T extends AnyVec3>(v: AnyVec3, origin: AnyVec3, rotation: AnyVec3, out?: T) {
        return Vec3Math.rotateZyxAround(v, origin, rotation, out);
    }
    public round<T extends AnyVec3 = Vec3>(out?: T) {
        return Vec3Math.round(this, out);
    }
    public roundSelf() {
        return Vec3Math.round(this, this);
    }
    public rsubScalar<T extends AnyVec3 = Vec3>(b: number, out?: T) {
        return Vec3Math.rsubScalar(this, b, out);
    }
    public rsubScalarSelf(b: number) {
        return Vec3Math.rsubScalar(this, b, this);
    }
    //// S*
    public set(i: number | string, v: number) {
        switch(i) {
            case 0: this.x = v; return;
            case 1: this.y = v; return;
            case 2: this.z = v; return;
            case 'x': this.x = v; return;
            case 'y': this.y = v; return;
            case 'z': this.z = v; return;
        }
    }
    public sign<T extends AnyVec3 = Vec3>(out?: T) {
        return Vec3Math.sign(this, out);
    }
    public signedAngleBetween(a: AnyVec3, b: AnyVec3, normal: AnyVec3) {
        return Vec3Math.signedAngleBetween(a, b, normal);
    }
    public signSelf() {
        return Vec3Math.sign(this, this);
    }
    public step<T extends AnyVec3 = Vec3>(b: AnyVec3, step: number, out?: T) {
        return Vec3Math.step(this, b, step, out);
    }
    public stepComponent<T extends AnyVec3 = Vec3>(b: AnyVec3, step: number, out?: T) {
        return Vec3Math.stepComponent(this, b, step, out);
    }
    public stepComponentSelf(b: AnyVec3, step: number) {
        return Vec3Math.stepComponent(this, b, step, this);
    }
    public stepSelf(b: AnyVec3, step: number) {
        return Vec3Math.step(this, b, step, this);
    }
    public sub<T extends AnyVec3 = Vec3>(b: AnyVec3, out?: T) {
        return Vec3Math.sub(this, b, out);
    }
    public subScalar<T extends AnyVec3 = Vec3>(b: number, out?: T) {
        return Vec3Math.subScalar(this, b, out);
    }
    public subScalarSelf(b: number) {
        return Vec3Math.subScalar(this, b, this);
    }
    public subSelf(b: AnyVec3) {
        return Vec3Math.sub(this, b, this);
    }
    //// T*
    public toArray(): [number, number, number] {
        return Vec3Math.toArray(this);
    }
    public toKey(): string {
        return Vec3Math.toKey(this);
    }
    public toObject(): AnyVec3 {
        return Vec3Math.toObject(this);
    }
    public toString(): string {
        return Vec3Math.toString(this);
    }
    public trunc<T extends AnyVec3 = Vec3>(out?: T) {
        return Vec3Math.trunc(this, out);
    }
    public truncSelf() {
        return Vec3Math.trunc(this, this);
    }
    //// U*
    //// V*
    //// W*
    //// X*
    //// Y*
    //// Z*
    public static zero() {
        return new Vec3(0, 0, 0);
    }
}