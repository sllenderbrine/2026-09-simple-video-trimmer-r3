export namespace CssUtility {
    export function adoptStyle(source: string): HTMLStyleElement {
        const styleEl = document.createElement("style");
        styleEl.textContent = source;
        document.head.appendChild(styleEl);
        return styleEl;
    }
}