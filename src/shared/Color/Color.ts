import { clamp, pmod, lerp } from "../Utility/MathUtility.js";

export class Color {
    // 0 - 255
    private _r: number = 0;
    private _g: number = 0;
    private _b: number = 0;
    private _a: number = 0;
    // 0 - 360
    private _h: number = 0;
    // 0 - 100
    private _s: number = 0;
    private _v: number = 0;
    
    private _rgbValid: boolean = true;
    private _hsvValid: boolean = false;

    constructor() { }

    get r() {
        if(!this._rgbValid) this._calculateRgb();
        return this._r;
    }
    get g() {
        if(!this._rgbValid) this._calculateRgb();
        return this._g;
    }
    get b() {
        if(!this._rgbValid) this._calculateRgb();
        return this._b;
    }
    get a() {
        return this._a;
    }

    get h() {
        if(!this._hsvValid) this._calculateHsv();
        return this._h;
    }
    get s() {
        if(!this._hsvValid) this._calculateHsv();
        return this._s;
    }
    get v() {
        if(!this._hsvValid) this._calculateHsv();
        return this._v;
    }

    set r(v: number) {
        if(!this._rgbValid) this._calculateRgb();
        this._hsvValid = false;
        this._r = clamp(Math.round(v), 0, 255);
    }
    set g(v: number) {
        if(!this._rgbValid) this._calculateRgb();
        this._hsvValid = false;
        this._g = clamp(Math.round(v), 0, 255);
    }
    set b(v: number) {
        if(!this._rgbValid) this._calculateRgb();
        this._hsvValid = false;
        this._b = clamp(Math.round(v), 0, 255);
    }
    set a(v: number) {
        this._a = clamp(Math.round(v), 0, 255);
    }

    set h(v: number) {
        if(!this._hsvValid) this._calculateHsv();
        this._rgbValid = false;
        this._h = pmod(v, 360);
    }
    set s(v: number) {
        if(!this._hsvValid) this._calculateHsv();
        this._rgbValid = false;
        this._s = clamp(v, 0, 100);
    }
    set v(v: number) {
        if(!this._hsvValid) this._calculateHsv();
        this._rgbValid = false;
        this._v = clamp(v, 0, 100);
    }

    private _calculateRgb() {
        this._rgbValid = true;
        const h = this._h, s = this._s, v = this._v;
        const c = v / 100 * s / 100;
        const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
        const m = v / 100 - c;
        let rp=0, gp=0, bp=0;
        switch(Math.floor(h / 60)) {
            case 0: rp=c; gp=x; break;
            case 1: rp=x; gp=c; break;
            case 2: gp=c; bp=x; break;
            case 3: gp=x; bp=c; break;
            case 4: rp=x; bp=c; break;
            default: rp=c; bp=x; break;
        }
        this._r = Math.round((rp + m) * 255);
        this._g = Math.round((gp + m) * 255);
        this._b = Math.round((bp + m) * 255);
    }

    private _calculateHsv() {
        this._hsvValid = true;
        const r = this._r, g = this._g, b = this._b;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const delta = max - min;
        let h = 0;
        if(delta !== 0) {
            if(max === r) h = 60 * (((g - b) / delta + 6) % 6);
            else if(max === g) h = 60 * ((b - r) / delta + 2);
            else h = 60 * ((r - g) / delta + 4);
        }
        if(h < 0) h += 360;
        this._h = h;
        this._s = max === 0 ? 0 : delta / max * 100;
        this._v = max / 255 * 100;
    }

    static toCss(color: Color): string {
        return "rgba(" + color.r + ", " + color.g + ", " + color.b + ", " + color.a / 255 + ")";
    }

    static fromRgb(r: number, g: number, b: number, a: number = 255) {
        const color = new Color();
        color.r = r;
        color.g = g;
        color.b = b;
        color.a = a;
        return color;
    }

    static fromHsv(h: number, s: number, v: number, a: number = 255) {
        const color = new Color();
        color.h = h;
        color.s = s;
        color.v = v;
        color.a = a;
        return color;
    }

    static copy(other: Color, out: Color = new Color()) {
        out._r = other.r;
        out._g = other.g;
        out._b = other.b;
        out._a = other.a;
        out._hsvValid = false;
        out._rgbValid = true;
        return out;
    }

    static lerp(a: Color, b: Color, t: number) {
        return Color.fromRgb(
            lerp(a.r, b.r, t),
            lerp(a.g, b.g, t),
            lerp(a.b, b.b, t),
            lerp(a.a, b.a, t),
        );
    }

    static blendColors(bottom: Color, top: Color): Color {
        const alphaTop = top.a / 255;
        const alphaBottom = bottom.a / 255;
        const remainder = (1 - alphaTop);
        const alphaResult = (alphaTop + alphaBottom * remainder);

        if(alphaResult == 0)
            return Color.fromRgb(0, 0, 0, 0);

        return Color.fromRgb(
            (top.r * alphaTop + bottom.r * alphaBottom * remainder) / alphaResult,
            (top.g * alphaTop + bottom.g * alphaBottom * remainder) / alphaResult,
            (top.b * alphaTop + bottom.b * alphaBottom * remainder) / alphaResult,
            alphaResult * 255
        );
    }

    clone() {
        return Color.copy(this);
    }

    toCss() {
        return Color.toCss(this);
    }

    lerp(other: Color, t: number) {
        return Color.lerp(this, other, t);
    }
    

    static WHITE = Color.fromRgb(255, 255, 255);
    static LIGHT_GRAY = Color.fromRgb(200, 200, 200);
    static GRAY = Color.fromRgb(150, 150, 150);
    static DARK_GRAY = Color.fromRgb(75, 75, 75);
    static DARKER_GRAY = Color.fromRgb(30, 30, 30);
    static BLACK = Color.fromRgb(0, 0, 0);

    static LIGHT_RED = Color.fromRgb(255, 150, 150);
    static LIGHT_ORANGE = Color.fromRgb(255, 200, 150);
    static LIGHT_YELLOW = Color.fromRgb(255, 255, 150);
    static LIGHT_LIME = Color.fromRgb(200, 255, 150);
    static LIGHT_GREEN = Color.fromRgb(150, 255, 150);
    static LIGHT_TEAL = Color.fromRgb(150, 255, 200);
    static LIGHT_CYAN = Color.fromRgb(150, 255, 255);
    static LIGHT_AZURE = Color.fromRgb(150, 200, 255);
    static LIGHT_BLUE = Color.fromRgb(150, 150, 255);
    static LIGHT_PURPLE = Color.fromRgb(200, 150, 255);
    static LIGHT_MAGENTA = Color.fromRgb(255, 150, 255);
    static LIGHT_PINK = Color.fromRgb(255, 150, 200);

    static RED = Color.fromRgb(255, 0, 0);
    static ORANGE = Color.fromRgb(255, 150, 0);
    static YELLOW = Color.fromRgb(255, 255, 0);
    static LIME = Color.fromRgb(150, 255, 0);
    static GREEN = Color.fromRgb(0, 255, 0);
    static TEAL = Color.fromRgb(0, 255, 150);
    static CYAN = Color.fromRgb(0, 255, 255);
    static AZURE = Color.fromRgb(0, 150, 255);
    static BLUE = Color.fromRgb(0, 0, 255);
    static PURPLE = Color.fromRgb(150, 0, 255);
    static MAGENTA = Color.fromRgb(255, 0, 255);
    static PINK = Color.fromRgb(255, 0, 150);

    static DARK_RED = Color.fromRgb(150, 0, 0);
    static DARK_ORANGE = Color.fromRgb(150, 75, 0);
    static DARK_YELLOW = Color.fromRgb(150, 150, 0);
    static DARK_LIME = Color.fromRgb(75, 150, 0);
    static DARK_GREEN = Color.fromRgb(150, 150, 0);
    static DARK_TEAL = Color.fromRgb(0, 150, 75);
    static DARK_CYAN = Color.fromRgb(0, 150, 150);
    static DARK_AZURE = Color.fromRgb(0, 75, 150);
    static DARK_BLUE = Color.fromRgb(0, 0, 150);
    static DARK_PURPLE = Color.fromRgb(75, 0, 150);
    static DARK_MAGENTA = Color.fromRgb(150, 0, 150);
    static DARK_PINK = Color.fromRgb(150, 0, 75);
}