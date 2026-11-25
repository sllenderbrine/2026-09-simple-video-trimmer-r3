import { Vec2Math } from "./Vec2Math.js";

type AnyVec2 = Vec2Math.AnyVec2;

export class Vec2 {
    public x: number;
    public y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    *[Symbol.iterator]() {
        yield this.x;
        yield this.y;
    }
    //// A*
    public abs<T extends AnyVec2 = Vec2>(out?: T) {
        return Vec2Math.abs(this, out);
    }
    public absSelf() {
        return Vec2Math.abs(this, this);
    }
    public add<T extends AnyVec2 = Vec2>(b: AnyVec2, out?: T) {
        return Vec2Math.add(this, b, out);
    }
    public addScalar<T extends AnyVec2 = Vec2>(b: number, out?: T) {
        return Vec2Math.addScalar(this, b, out);
    }
    public addScalarSelf(b: number) {
        return Vec2Math.addScalar(this, b, this);
    }
    public addScaled<T extends AnyVec2 = Vec2>(b: AnyVec2, scalar: number, out?: T) {
        return Vec2Math.addScaled(this, b, scalar, out);
    }
    public addScaledSelf(b: AnyVec2, scalar: number) {
        return Vec2Math.addScaled(this, b, scalar, this);
    }
    public addSelf(b: AnyVec2) {
        return Vec2Math.add(this, b, this);
    }
    public angle(): number {
        return Vec2Math.angle(this);
    }
    public angleBetween(b: AnyVec2): number {
        return Vec2Math.angleBetween(this, b);
    }
    public angleOfLook(b: AnyVec2): number {
        return Vec2Math.angleOfLook(this, b);
    }
    public average<T extends AnyVec2 = Vec2>(b: AnyVec2, out?: T) {
        return Vec2Math.average(this, b, out);
    }
    public averageSelf(b: AnyVec2) {
        return Vec2Math.average(this, b, this);
    }
    //// B*
    //// C*
    public ceil<T extends AnyVec2 = Vec2>(out?: T) {
        return Vec2Math.ceil(this, out);
    }
    public ceilSelf() {
        return Vec2Math.ceil(this, this);
    }
    public clampComponents<T extends AnyVec2 = Vec2>(min: AnyVec2, max: AnyVec2, out?: T) {
        return Vec2Math.clampComponents(this, min, max, out);
    }
    public clampComponentsScalar<T extends AnyVec2 = Vec2>(min: number, max: number, out?: T) {
        return Vec2Math.clampComponentsScalar(this, min, max, out);
    }
    public clampComponentsScalarSelf(min: number, max: number) {
        return Vec2Math.clampComponentsScalar(this, min, max, this);
    }
    public clampComponentsSelf(min: AnyVec2, max: AnyVec2) {
        return Vec2Math.clampComponents(this, min, max, this);
    }
    public clampLength<T extends AnyVec2 = Vec2>(min: AnyVec2, max: AnyVec2, out?: T) {
        return Vec2Math.clampLength(this, min, max, out);
    }
    public clampLengthScalar<T extends AnyVec2 = Vec2>(min: number, max: number, out?: T) {
        return Vec2Math.clampLengthScalar(this, min, max, out);
    }
    public clampLengthScalarSelf(min: number, max: number) {
        return Vec2Math.clampLengthScalar(this, min, max, this);
    }
    public clone<T extends AnyVec2 = Vec2>(out?: T) {
        return Vec2Math.clone(this, out);
    }
    public cloneSelf() {
        return Vec2Math.clone(this, this);
    }
    public compareLength(b: AnyVec2, epsilon: number = 1e-6): number {
        return Vec2Math.compareLength(this, b, epsilon);
    }
    public componentProduct(): number {
        return Vec2Math.componentProduct(this);
    }
    public componentSum(): number {
        return Vec2Math.componentSum(this);
    }
    public cross(b: AnyVec2): number {
        return Vec2Math.cross(this, b);
    }
    //// D*
    public dist(b: AnyVec2): number {
        return Vec2Math.dist(this, b);
    }
    public distSq(b: AnyVec2): number {
        return Vec2Math.distSq(this, b);
    }
    public div<T extends AnyVec2 = Vec2>(b: AnyVec2, out?: T) {
        return Vec2Math.div(this, b, out);
    }
    public divScalar<T extends AnyVec2 = Vec2>(b: number, out?: T) {
        return Vec2Math.divScalar(this, b, out);
    }
    public divScalarSelf(b: number) {
        return Vec2Math.divScalar(this, b, this);
    }
    public divSelf(b: AnyVec2) {
        return Vec2Math.div(this, b, this);
    }
    public dot(b: AnyVec2): number {
        return Vec2Math.dot(this, b);
    }
    //// E*
    //// F*
    public floor<T extends AnyVec2 = Vec2>(out?: T) {
        return Vec2Math.floor(this, out);
    }
    public floorSelf() {
        return Vec2Math.floor(this, this);
    }
    public forEach(callback: (value: number, index: number, vector: AnyVec2) => void): AnyVec2 {
        return Vec2Math.forEach(this, callback);
    }
    public fract<T extends AnyVec2 = Vec2>(out?: T) {
        return Vec2Math.fract(this, out);
    }
    public fractSelf() {
        return Vec2Math.fract(this, this);
    }
    public fromAngle<T extends AnyVec2 = Vec2>(angle: number, length: number, out?: T) {
        return Vec2Math.fromAngle(angle, length, out);
    }
    public fromArray<T extends AnyVec2 = Vec2>(arr: [number, number], out?: T) {
        return Vec2Math.fromArray(arr, out);
    }
    public fromArraySelf(arr: [number, number]) {
        return Vec2Math.fromArray(arr, this);
    }
    public fromObject<T extends AnyVec2 = Vec2>(obj: AnyVec2, out?: T) {
        return Vec2Math.fromObject(obj, out);
    }
    public fromObjectSelf(obj: AnyVec2) {
        return Vec2Math.fromObject(obj, this);
    }
    //// G*
    public get(i: number | string): number | undefined {
        switch(i) {
            case 0: return this.x;
            case 1: return this.y;
            case 'x': return this.x;
            case 'y': return this.y;
            default: return undefined;
        }
    }
    //// H*
    //// I*
    public isEqual(b: AnyVec2): boolean {
        return Vec2Math.isEqual(this, b);
    }
    public isEqualScalar(scalar: number): boolean {
        return Vec2Math.isEqualScalar(this, scalar);
    }
    public isFinite(): boolean {
        return Vec2Math.isFinite(this);
    }
    public isGreaterThan(b: AnyVec2): boolean {
        return Vec2Math.isGreaterThan(this, b);
    }
    public isGreaterThanScalar(scalar: number): boolean {
        return Vec2Math.isGreaterThanScalar(this, scalar);
    }
    public isInteger(): boolean {
        return Vec2Math.isInteger(this);
    }
    public isLessThan(b: AnyVec2): boolean {
        return Vec2Math.isLessThan(this, b);
    }
    public isLessThanScalar(scalar: number): boolean {
        return Vec2Math.isLessThanScalar(this, scalar);
    }
    public isParallel(b: AnyVec2, epsilon: number = 1e-6): boolean {
        return Vec2Math.isParallel(this, b, epsilon);
    }
    public isPerpendicular(b: AnyVec2, epsilon: number = 1e-6): boolean {
        return Vec2Math.isPerpendicular(this, b, epsilon);
    }
    public isNaN(): boolean {
        return Vec2Math.isNaN(this);
    }
    public isSimilar(b: AnyVec2, epsilon: number = 1e-6): boolean {
        return Vec2Math.isSimilar(this, b, epsilon);
    }
    public isSimilarScalar(scalar: number, epsilon: number = 1e-6): boolean {
        return Vec2Math.isSimilarScalar(this, scalar, epsilon);
    }
    public isSimilarZero(epsilon: number = 1e-6): boolean {
        return Vec2Math.isSimilarZero(this, epsilon);
    }
    public isUnit(epsilon: number = 1e-6): boolean {
        return Vec2Math.isUnit(this, epsilon);
    }
    public isZero(): boolean {
        return Vec2Math.isZero(this);
    }
    //// J*
    //// K*
    //// L*
    public length(): number {
        return Vec2Math.length(this);
    }
    public lengthSq(): number {
        return Vec2Math.lengthSq(this);
    }
    public lerp<T extends AnyVec2 = Vec2>(b: AnyVec2, t: number, out?: T) {
        return Vec2Math.lerp(this, b, t, out);
    }
    public lerpSelf(b: AnyVec2, t: number) {
        return Vec2Math.lerp(this, b, t, this);
    }
    public look<T extends AnyVec2 = Vec2>(b: AnyVec2, out?: T) {
        return Vec2Math.look(this, b, out);
    }
    public lookSelf(b: AnyVec2) {
        return Vec2Math.look(this, b, this);
    }
    //// M*
    public manhattanDist(b: AnyVec2): number {
        return Vec2Math.manhattanDist(this, b);
    }
    public manhattanLength(): number {
        return Vec2Math.manhattanLength(this);
    }
    public map(callback: (value: number, index: number, vector: AnyVec2) => number, out: AnyVec2) {
        return Vec2Math.map(this, callback, out);
    }
    public mapSelf(callback: (value: number, index: number, vector: AnyVec2) => number) {
        return Vec2Math.map(this, callback, this);
    }
    public max<T extends AnyVec2 = Vec2>(b: AnyVec2, out?: T) {
        return Vec2Math.max(this, b, out);
    }
    public maxLength<T extends AnyVec2 = Vec2>(max: number, out?: T) {
        return Vec2Math.maxLength(this, max, out);
    }
    public maxLengthSelf(max: number) {
        return Vec2Math.maxLength(this, max, this);
    }
    public maxScalar<T extends AnyVec2 = Vec2>(max: number, out?: T) {
        return Vec2Math.maxScalar(this, max, out);
    }
    public maxScalarSelf(max: number) {
        return Vec2Math.maxScalar(this, max, this);
    }
    public maxSelf(b: AnyVec2) {
        return Vec2Math.max(this, b, this);
    }
    public min<T extends AnyVec2 = Vec2>(b: AnyVec2, out?: T) {
        return Vec2Math.min(this, b, out);
    }
    public minLength<T extends AnyVec2 = Vec2>(min: number, out?: T) {
        return Vec2Math.minLength(this, min, out);
    }
    public minLengthSelf(min: number) {
        return Vec2Math.minLength(this, min, this);
    }
    public minScalar<T extends AnyVec2 = Vec2>(min: number, out?: T) {
        return Vec2Math.minScalar(this, min, out);
    }
    public minScalarSelf(min: number) {
        return Vec2Math.minScalar(this, min, this);
    }
    public minSelf(b: AnyVec2) {
        return Vec2Math.min(this, b, this);
    }
    public mul<T extends AnyVec2 = Vec2>(b: AnyVec2, out?: T) {
        return Vec2Math.mul(this, b, out);
    }
    public mulScalar<T extends AnyVec2 = Vec2>(b: number, out?: T) {
        return Vec2Math.mulScalar(this, b, out);
    }
    public mulScalarSelf(b: number) {
        return Vec2Math.mulScalar(this, b, this);
    }
    public mulSelf(b: AnyVec2) {
        return Vec2Math.mul(this, b, this);
    }
    //// N*
    public negate<T extends AnyVec2 = Vec2>(out?: T) {
        return Vec2Math.negate(this, out);
    }
    public negateSelf() {
        return Vec2Math.negate(this, this);
    }
    public norm<T extends AnyVec2 = Vec2>(out?: T) {
        return Vec2Math.norm(this, out);
    }
    public normSelf() {
        return Vec2Math.norm(this, this);
    }
    //// O*
    //// P*
    public perpendicular<T extends AnyVec2 = Vec2>(out?: T) {
        return Vec2Math.perpendicular(this, out);
    }
    public perpendicularCW<T extends AnyVec2 = Vec2>(out?: T) {
        return Vec2Math.perpendicularCW(this, out);
    }
    public perpendicularCWSelf() {
        return Vec2Math.perpendicularCW(this, this);
    }
    public perpendicularSelf() {
        return Vec2Math.perpendicular(this, this);
    }
    public pow<T extends AnyVec2 = Vec2>(exponent: number, out?: T) {
        return Vec2Math.pow(this, exponent, out);
    }
    public powSelf(exponent: number) {
        return Vec2Math.pow(this, exponent, this);
    }
    public project<T extends AnyVec2 = Vec2>(b: AnyVec2, out?: T) {
        return Vec2Math.project(this, b, out);
    }
    public projectSelf(b: AnyVec2) {
        return Vec2Math.project(this, b, this);
    }
    //// Q*
    //// R*
    public rdivScalar<T extends AnyVec2 = Vec2>(b: number, out?: T) {
        return Vec2Math.rdivScalar(this, b, out);
    }
    public rdivScalarSelf(b: number) {
        return Vec2Math.rdivScalar(this, b, this);
    }
    public reciprocal<T extends AnyVec2 = Vec2>(out?: T) {
        return Vec2Math.reciprocal(this, out);
    }
    public reduce<T>(callback: (previous: T, value: number, index: number, vector: AnyVec2) => T, initial: T): T;
    public reduce(callback: (previous: number, value: number, index: number, vector: AnyVec2) => number): number;
    public reduce<T>(callback: ((previous: T, value: number, index: number, vector: AnyVec2) => T) | ((previous: number, value: number, index: number, vector: AnyVec2) => number), initial?: T): T | number {
        if(arguments.length === 2) return Vec2Math.reduce(this, callback as (previous: T, value: number, index: number, vector: AnyVec2) => T, initial as T);
        return Vec2Math.reduce(this, callback as (previous: number, value: number, index: number, vector: AnyVec2) => number);
    }
    public reciprocalSelf() {
        return Vec2Math.reciprocal(this, this);
    }
    public reflect<T extends AnyVec2 = Vec2>(normal: AnyVec2, out?: T) {
        return Vec2Math.reflect(this, normal, out);
    }
    public reflectSelf(normal: AnyVec2) {
        return Vec2Math.reflect(this, normal, this);
    }
    public rescale<T extends AnyVec2 = Vec2>(len: number, out?: T) {
        return Vec2Math.rescale(this, len, out);
    }
    public rescaleSelf(len: number) {
        return Vec2Math.rescale(this, len, this);
    }
    public rotate<T extends AnyVec2 = Vec2>(angle: number, out?: T) {
        return Vec2Math.rotate(this, angle, out);
    }
    public rotateAround<T extends AnyVec2 = Vec2>(origin: AnyVec2, angle: number, out?: T) {
        return Vec2Math.rotateAround(this, origin, angle, out);
    }
    public rotateAroundSelf(origin: AnyVec2, angle: number) {
        return Vec2Math.rotateAround(this, origin, angle, this);
    }
    public rotateSelf(angle: number) {
        return Vec2Math.rotate(this, angle, this);
    }
    public rotationLerp<T extends AnyVec2 = Vec2>(b: AnyVec2, t: number, out?: T) {
        return Vec2Math.rotationLerp(this, b, t, out);
    }
    public rotationLerpSelf(b: AnyVec2, t: number) {
        return Vec2Math.rotationLerp(this, b, t, this);
    }
    public rotationStep<T extends AnyVec2 = Vec2>(b: AnyVec2, step: number, out?: T) {
        return Vec2Math.rotationStep(this, b, step, out);
    }
    public rotationStepSelf(b: AnyVec2, step: number) {
        return Vec2Math.rotationStep(this, b, step, this);
    }
    public round<T extends AnyVec2 = Vec2>(out?: T) {
        return Vec2Math.round(this, out);
    }
    public roundSelf() {
        return Vec2Math.round(this, this);
    }
    public rsubScalar<T extends AnyVec2 = Vec2>(b: number, out?: T) {
        return Vec2Math.rsubScalar(this, b, out);
    }
    public rsubScalarSelf(b: number) {
        return Vec2Math.rsubScalar(this, b, this);
    }
    //// S*
    public set(i: number | string, v: number) {
        switch(i) {
            case 0: this.x = v; return;
            case 1: this.y = v; return;
            case 'x': this.x = v; return;
            case 'y': this.y = v; return;
        }
    }
    public sign<T extends AnyVec2 = Vec2>(out?: T) {
        return Vec2Math.sign(this, out);
    }
    public signedAngleBetween(b: AnyVec2): number {
        return Vec2Math.signedAngleBetween(this, b);
    }
    public signSelf() {
        return Vec2Math.sign(this, this);
    }
    public step<T extends AnyVec2 = Vec2>(b: AnyVec2, step: number, out?: T) {
        return Vec2Math.step(this, b, step, out);
    }
    public stepComponent<T extends AnyVec2 = Vec2>(b: AnyVec2, step: number, out?: T) {
        return Vec2Math.stepComponent(this, b, step, out);
    }
    public stepComponentSelf(b: AnyVec2, step: number) {
        return Vec2Math.stepComponent(this, b, step, this);
    }
    public stepSelf(b: AnyVec2, step: number) {
        return Vec2Math.step(this, b, step, this);
    }
    public sub<T extends AnyVec2 = Vec2>(b: AnyVec2, out?: T) {
        return Vec2Math.sub(this, b, out);
    }
    public subScalar<T extends AnyVec2 = Vec2>(b: number, out?: T) {
        return Vec2Math.subScalar(this, b, out);
    }
    public subScalarSelf(b: number) {
        return Vec2Math.subScalar(this, b, this);
    }
    public subSelf(b: AnyVec2) {
        return Vec2Math.sub(this, b, this);
    }
    //// T*
    public toArray(): [number, number] {
        return Vec2Math.toArray(this);
    }
    public toKey(): string {
        return Vec2Math.toKey(this);
    }
    public toObject(): AnyVec2 {
        return Vec2Math.toObject(this);
    }
    public toString(): string {
        return Vec2Math.toString(this);
    }
    public trunc<T extends AnyVec2 = Vec2>(out?: T) {
        return Vec2Math.trunc(this, out);
    }
    public truncSelf() {
        return Vec2Math.trunc(this, this);
    }
    //// U*
    //// V*
    //// W*
    //// X*
    //// Y*
    //// Z*
    public static zero() {
        return new Vec2(0, 0);
    }
}