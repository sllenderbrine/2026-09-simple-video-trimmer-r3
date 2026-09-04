import { ConnectionOwner } from "../../shared/EventSignals/ConnectionOwner.js";
import { HtmlConnection } from "../../shared/EventSignals/HtmlConnection.js";
import { Signal } from "../../shared/EventSignals/Signal.js";
import { get2dContext } from "../../shared/Utility/Canvas2dUtility.js";
import { lerpClamped } from "../../shared/Utility/MathUtility.js";
import { Vec2 } from "../../shared/Vectors/Vec2.js";
import { Vec3 } from "../../shared/Vectors/Vec3.js";
import { CanvasWithRenderedOffset } from "./CanvasWithRenderedOffset.js";
import { VideoWithScriptControls } from "./VideoWithScriptControls.js";

export class VideoPlayerCanvas {
    textureCanvasEl: HTMLCanvasElement;
    texCtx: CanvasRenderingContext2D;
    renderedCanvas: CanvasWithRenderedOffset;
    video: VideoWithScriptControls;
    visible: boolean = true;
    fitToContainerLock: boolean = true;
    camera: Vec3 = new Vec3(0, 0, 1);
    cropX: Vec2 = Vec2.zero();
    cropY: Vec2 = Vec2.zero();
    textureUpdateEvent: Signal<[]> = new Signal();
    renderEvent: Signal<[]> = new Signal();
    connectionOwner: ConnectionOwner = new ConnectionOwner();
    constructor() {
        this.video = new VideoWithScriptControls();
        
        this.textureCanvasEl = document.createElement("canvas");
        this.texCtx = get2dContext(this.textureCanvasEl);

        this.renderedCanvas = new CanvasWithRenderedOffset();

        this.updateRenderCanvasSize();
        this.updateContainerSize();
        
        new HtmlConnection(window, "resize", () => {
            if(!this.visible)
                return;
            this.updateContainerSize();
        }, { owners: [ this.connectionOwner ], initArgs: [] });

        this.video.videoLoadEvent.connect(() => {
            this.updateTextureCanvasSize();
            this.updateContainerSize();
        }, { owners: [ this.connectionOwner ], initArgs: [] });

        const render = () => {
            this.renderTexture();
            this.render();
            this.renderEvent.fire();
        }

        const videoFrameUpdate = () => {
            render();
            return this.video.videoEl.requestVideoFrameCallback(videoFrameUpdate);
        }
        videoFrameUpdate();

        const pausedRender = () => {
            if(!this.video.videoEl.paused)
                return requestAnimationFrame(pausedRender);
            render();
            return requestAnimationFrame(pausedRender);
        }
        pausedRender();
    }

    async saveScreenshot(): ReturnType<typeof window.screenshotApi.saveAndCopy> {
        if(!this.video.isLoaded())
            return { success: false, error: { message: "Video has not loaded", }, };
        if(this.textureCanvasEl.width <= 1 || this.textureCanvasEl.height <= 1)
            return { success: false, error: { message: "Video has zero dimensions", }, };
        const tempCanvas = document.createElement("canvas");
        const tempCtx = get2dContext(tempCanvas);
        tempCanvas.width = this.textureCanvasEl.width;
        tempCanvas.height = this.textureCanvasEl.height;
        tempCtx.drawImage(this.video.videoEl, 0, 0);
        const pngDataUrl = tempCanvas.toDataURL("image/png");
        let startTime = performance.now();
        const ctx = this.texCtx;
        let con = this.textureUpdateEvent.connect(() => {
            const t = lerpClamped(0, Math.PI, (performance.now() - startTime) / 300);
            ctx.fillStyle = `rgb(150, 150, 150, ${Math.sin(t) * 0.5})`;
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        }, { owners: [ this.connectionOwner, ], });
        setTimeout(() => {
            con.disconnect();
        }, 1000);
        return await window.screenshotApi.saveAndCopy(pngDataUrl);
    }

    getCroppedSourceWidth(): [number, number] {
        const width = this.video.videoEl.videoWidth - (this.cropX.x + this.cropX.y);
        const height = this.video.videoEl.videoHeight - (this.cropY.x + this.cropY.y);
        return [width, height];
    }

    updateTextureCanvasSize() {
        const [ width, height ] = this.getCroppedSourceWidth();
        if(width <= 0 || height <= 0) {
            this.textureCanvasEl.width = 1;
            this.textureCanvasEl.height = 1;
            this.texCtx.clearRect(0, 0, 1, 1);
        } else {
            this.textureCanvasEl.width = width;
            this.textureCanvasEl.height = height;
        }
    }

    clear() {
        this.texCtx.clearRect(0, 0, this.textureCanvasEl.width, this.textureCanvasEl.height);
        this.renderedCanvas.setTexture(this.textureCanvasEl);
        this.render();
    }

    updateRenderedOffset() {
        const [ width, height ] = this.getCroppedSourceWidth();

        let scaleX = width / 2 * this.camera.z / (this.renderedCanvas.containerEl.clientWidth / 2);
        let scaleY = height / 2 * this.camera.z / (this.renderedCanvas.containerEl.clientHeight / 2);

        let offsetX = -this.camera.x / (this.renderedCanvas.containerEl.clientWidth / 2);
        let offsetY = this.camera.y / (this.renderedCanvas.containerEl.clientHeight / 2);

        this.renderedCanvas.setScale(scaleX, scaleY);
        this.renderedCanvas.setOffset(offsetX, offsetY);
    }

    updateContainerSize() {
        this.updateRenderCanvasSize();
        this.updateRenderedOffset();
        if(this.fitToContainerLock)
            this.zoomToCenterFitContainer();
    }

    updateRenderCanvasSize() {
        const width = this.renderedCanvas.containerEl.clientWidth;
        const height = this.renderedCanvas.containerEl.clientHeight;
        this.renderedCanvas.setCanvasSize(width, height);
        this.render();
    }

    zoomToCenterFitContainer() {
        const [ width, height ] = this.getCroppedSourceWidth();
        const cWidth = this.renderedCanvas.containerEl.clientWidth;
        const cHeight = this.renderedCanvas.containerEl.clientHeight;
        this.camera.x = 0;
        this.camera.y = 0;
        if(width / height > cWidth / cHeight) {
            this.camera.z = cWidth / width;
        } else {
            this.camera.z = cHeight / height;
        }
        this.updateRenderedOffset();
        this.render();
    }

    zoomToCenterActualSize() {
        this.camera.x = 0;
        this.camera.y = 0;
        this.camera.z = 1;
        this.updateRenderedOffset();
        this.render();
    }

    zoomToCenter() {
        this.camera.x = 0;
        this.camera.y = 0;
        this.updateRenderedOffset();
        this.render();
    }

    zoomInTo(sx: number, sy: number, by: number) {
        const [ width, height ] = this.getCroppedSourceWidth();
        const rect = this.renderedCanvas.containerEl.getBoundingClientRect();
        let videoClientWidth = width * this.camera.z;
        let videoClientHeight = height * this.camera.z;
        const videoClientCenterX = rect.left + rect.width / 2 - this.camera.x;
        const videoClientCenterY = rect.top + rect.height / 2 - this.camera.y;
        const mxT = (sx - videoClientCenterX) / videoClientWidth;
        const myT = (sy - videoClientCenterY) / videoClientHeight;
        this.camera.x -= sx - videoClientCenterX;
        this.camera.y -= sy - videoClientCenterY;
        this.camera.z *= by;
        videoClientWidth = width * this.camera.z;
        videoClientHeight = height * this.camera.z;
        this.camera.x += mxT * videoClientWidth;
        this.camera.y += myT * videoClientHeight;
        this.updateRenderedOffset();
        this.render();
    }

    zoomInToContainerCenter(by: number) {
        const rect = this.renderedCanvas.containerEl.getBoundingClientRect();
        this.zoomInTo(rect.left + rect.width / 2, rect.top + rect.height / 2, by);
    }

    shift(x: number, y: number) {
        this.camera.x += x;
        this.camera.y += y;
        this.updateRenderedOffset();
        this.render();
    }

    isPaused() {
        return this.video.getShouldPause();
    }

    isUserPaused() {
        return this.video._userPaused;
    }

    isPausedIgnoreInput() {
        return this.video.getShouldPauseIgnoreInputs();
    }

    play() {
        return this.video.play();
    }

    pause() {
        return this.video.pause();
    }

    async seekTo(t: number) {
        return await this.video.seekTo(t);
    }

    async loadVideo(url: string) {
        this.clear();
        await this.video.setUrl(url);
    }

    setVisible(v: boolean) {
        if(v) {
            this.visible = true;
            this.renderedCanvas.containerEl.style.display = "block";
            this.updateContainerSize();
        } else {
            this.visible = false;
            this.renderedCanvas.containerEl.style.display = "none";
        }
    }

    renderTexture() {
        const [ width, height ] = this.getCroppedSourceWidth();
        if(width > 0 && height > 0) {
            this.texCtx.drawImage(this.video.videoEl, this.cropX.x, this.cropY.x, this.textureCanvasEl.width, this.textureCanvasEl.height, 0, 0, this.textureCanvasEl.width, this.textureCanvasEl.height);
            this.textureUpdateEvent.fire();
            this.renderedCanvas.setTexture(this.textureCanvasEl);
        } else {
            this.texCtx.clearRect(0, 0, this.textureCanvasEl.width, this.textureCanvasEl.height);
        }
    }

    render() {
        this.renderedCanvas.render();
    }

    remove() {
        this.connectionOwner.disconnectAll();
        this.renderedCanvas.containerEl.remove();
    }
}