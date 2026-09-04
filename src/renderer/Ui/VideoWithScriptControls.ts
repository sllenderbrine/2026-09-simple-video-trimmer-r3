import { ConnectionOwner } from "../../shared/EventSignals/ConnectionOwner.js";
import { HtmlConnection } from "../../shared/EventSignals/HtmlConnection.js";
import { Signal } from "../../shared/EventSignals/Signal.js";
import { clamp } from "../../shared/Utility/MathUtility.js";
import { BusyProcess, waitForHtmlEvent } from "../../shared/Utility/UiUtility.js";
import { createVideoGain } from "../../shared/Utility/VideoUtility.js";

export class VideoWithScriptControls {
    videoEl: HTMLVideoElement;
    _userPaused: boolean = false;
    _inputtingSeek: boolean = false;
    _videoLoaded: boolean = false;

    _seeking: BusyProcess<number> = new BusyProcess();
    _loading: BusyProcess<string> = new BusyProcess();

    _minSeek: number | null = null;
    _maxSeek: number | null = null;
    _looped: boolean = false;

    _gain: ReturnType<typeof createVideoGain>;
    _volume: number = 100;

    videoLoadEvent: Signal<[]> = new Signal();
    errorEvent = new Signal<[message: string]>();
    endPauseEvent = new Signal<[]>();
    
    connectionOwner: ConnectionOwner = new ConnectionOwner();
    constructor(
        videoEl?: HTMLVideoElement
    ) {
        this.videoEl = videoEl ?? document.createElement("video");
        this._gain = createVideoGain(this.videoEl);

        const onVideoFrame = () => {
            const cTime = this.videoEl.currentTime;
            if(this._minSeek != null && cTime < this._minSeek) {
                this.seekTo(this._minSeek);
            }
            if(cTime >= (this._maxSeek ?? this.videoEl.duration)) {
                if(this._looped)
                    this.seekTo(this._minSeek ?? 0);
                else {
                    this.seekTo(this._maxSeek ?? this.videoEl.duration);
                    if(!this._inputtingSeek)
                        this.pause();
                    this.endPauseEvent.fire();
                }
            }
            this.videoEl.requestVideoFrameCallback(onVideoFrame);
        }
        this.videoEl.requestVideoFrameCallback(onVideoFrame);
        
        new HtmlConnection(this.videoEl, "ended", () => {
            if(!this.getShouldPause()) {
                if(this._looped) {
                    this.seekTo(this._minSeek ?? 0);
                } else {
                    this._userPaused = true;
                }
            }
            this.endPauseEvent.fire();
        }, { owners: [ this.connectionOwner ] });

        new HtmlConnection(this.videoEl, "error", () => {
            this.errorEvent.fire((this.videoEl.error ?? {message:"Unknown Error"}).message);
        }, { owners: [ this.connectionOwner ] });
    }
    
    unloadVideo() {
        this.videoEl.removeAttribute("src");
        this.videoEl.load();
        this._seeking.setActive(false);
        this._videoLoaded = false;
    }

    async setUrl(url: string) {
        if(!(await this._loading.waitForTurn(url)))
            return;
        let value = this._loading.getValue()!;
        if(value == null)
            return;
        this._videoLoaded = false;
        this._loading.setActive(true);
        await waitForHtmlEvent(this.videoEl, ["canplay", "error"], null, () => {
            this.videoEl.src = value;
        });
        this._loading.setActive(false);
        if(this.videoEl.error != null)
            return;
        this._videoLoaded = true;
        this.updatePause();
        this.videoLoadEvent.fire();
    }

    async seekTo(t: number) {
        t = clamp(t, this._minSeek ?? 0, this._maxSeek ?? this.videoEl.duration);
        if(!(await this._seeking.waitForTurn(t)))
            return;
        let value = this._seeking.getValue();
        if(value == null)
            return;
        this._seeking.setActive(true);
        try {
            await waitForHtmlEvent(this.videoEl, "seeked", null, () => {
                this.videoEl.currentTime = value;
            });
        } catch(e) {
            this.errorEvent.fire((e instanceof Error) ? e.message : "Unknown Error");
        }
        this._seeking.setActive(false);
        this.updatePause();
    }
    
    getTargetTime() {
        if(this._seeking.isActive())
            return this._seeking.getValue() ?? this.videoEl.currentTime;
        return this.videoEl.currentTime;
    }

    getShouldPause() {
        if(
            this._seeking.isActive()
            || this._inputtingSeek
            || this._userPaused
            || !this._videoLoaded
        ) {
            return true;
        }
        return false;
    }

    getShouldPauseIgnoreInputs() {
        if(
            this._seeking.isActive()
            || this._userPaused
            || !this._videoLoaded
        ) {
            return true;
        }
        return false;
    }

    updatePause() {
        if(this.getShouldPause())
            this.videoEl.pause();
        else
            this.videoEl.play();
    }

    getMinSeek() {
        return this._minSeek;
    }

    setMinSeek(t: number) {
        t = Math.max(t, 0);
        this._minSeek = t;
        if(this.videoEl.currentTime < t)
            this.seekTo(t);
    }

    getMaxSeek() {
        return this._maxSeek;
    }

    setMaxSeek(t: number) {
        this._maxSeek = t;
        if(this.videoEl.currentTime > t)
            this.seekTo(t);
    }

    isLooped() {
        return this._looped;
    }

    setLooped(v: boolean) {
        this._looped = v;
    }

    isInputtingSeek() {
        return this._inputtingSeek;
    }

    setInputtingSeek(v: boolean) {
        this._inputtingSeek = v;
        this.updatePause();
    }
    
    isLoaded() {
        return this._videoLoaded;
    }

    getVolume() {
        return this._volume;
    }

    setVolume(n: number) {
        n = clamp(n, 0, 600);
        this._volume = n;
        this._gain.set(n / 100);
    }

    play() {
        this._userPaused = false;
        if(this.videoEl.currentTime + 0.1 >= (this._maxSeek ?? this.videoEl.duration))
            this.seekTo(this._minSeek ?? 0);
        this.updatePause();
    }

    pause() {
        this._userPaused = true;
        this.updatePause();
    }

    remove() {
        this.connectionOwner.disconnectAll();
        this.videoEl.remove();
    }
}