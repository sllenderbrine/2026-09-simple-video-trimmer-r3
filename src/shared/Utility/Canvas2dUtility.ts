export function get2dContext(canvas: HTMLCanvasElement, options?: CanvasRenderingContext2DSettings) {
    const ctx = canvas.getContext("2d", options);
    if(!ctx)
        throw new Error("2d context is not supported!");
    return ctx;
}

export function generateDebugImage(
    width: number,
    height: number,
    callback: (x: number, y: number) => [number, number, number],
) {
    const canvas = document.createElement("canvas");
    canvas.style.zoom = "2";
    canvas.style.imageRendering = "pixelated";
    document.body.appendChild(canvas);
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d")!;

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for(let i=0; i<data.data.length; i+=4) {
        const pixelIndex = i / 4;
        const x = Math.floor(pixelIndex / canvas.width);
        const y = pixelIndex % canvas.width;
        const [ r, g, b ] = callback(x, y);
        data.data[i] = r;
        data.data[i+1] = g;
        data.data[i+2] = b;
        data.data[i+3] = 255;
    }
    ctx.putImageData(data, 0, 0);

    return canvas;
}