import { ObservedValue } from "../../../shared/EventSignals/ObservedValue.js";
import { Signal } from "../../../shared/EventSignals/Signal.js";
import { Vec2 } from "../../../shared/Vectors/Vec2.js";

export const windowWidth = new ObservedValue(window.innerWidth);
export const windowHeight = new ObservedValue(window.innerHeight);
export const windowSize = new ObservedValue(new Vec2(window.innerWidth, window.innerHeight));

window.addEventListener("resize", () => {
    windowWidth.set(window.innerWidth);
    windowHeight.set(window.innerHeight);
    const windowSizeVec = windowSize.get();
    windowSizeVec.x = window.innerWidth;
    windowSizeVec.y = window.innerHeight;
    windowSize.fire();
});

export const renderEvent: Signal<[dt: number]> = new Signal();

let frame = performance.now();
function render() {
    let now = performance.now();
    let dt = (now - frame) / 1000;
    frame = now;
    renderEvent.fire(dt);
    requestAnimationFrame(render);
}
render();