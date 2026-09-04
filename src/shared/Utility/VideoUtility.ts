import { ConnectionOwner } from "../EventSignals/ConnectionOwner.js";
import { HtmlConnection } from "../EventSignals/HtmlConnection.js";

export function unloadVideo(video: HTMLVideoElement) {
    video.pause();
    video.removeAttribute("src");
    video.load();
}

export function loadVideo(
    video: HTMLVideoElement,
    src: string
) {
    return new Promise<boolean>(res => {
        let connectionOwner = new ConnectionOwner();
        new HtmlConnection(video, "loadedmetadata", () => {
            connectionOwner.disconnectAll();
            res(true);
        }, { owners: [ connectionOwner ] });
        new HtmlConnection(video, "error", () => {
            connectionOwner.disconnectAll();
            res(false);
        }, { owners: [ connectionOwner ] });
        video.preload = "auto";
        video.src = src;
    });
}

export function seekVideo(video: HTMLVideoElement, currentTime: number) {
    return new Promise<void>(res => {
        let connectionOwner = new ConnectionOwner();
        new HtmlConnection(video, "seeked", () => {
            connectionOwner.disconnectAll();
            res();
        }, { owners: [ connectionOwner ] });
        new HtmlConnection(video, "error", () => {
            connectionOwner.disconnectAll();
            res();
        }, { owners: [ connectionOwner ] });
        video.currentTime = currentTime;
    });
}

export function loadVideoMetadata(
    video: HTMLVideoElement,
    src: string
) {
    return new Promise<boolean>(res => {
        let connectionOwner = new ConnectionOwner();
        new HtmlConnection(video, "loadedmetadata", () => {
            connectionOwner.disconnectAll();
            res(true);
        }, { owners: [ connectionOwner ] });
        new HtmlConnection(video, "error", () => {
            connectionOwner.disconnectAll();
            res(false);
        }, { owners: [ connectionOwner ] });
        video.preload = "metadata";
        video.src = src;
    });
}

export function createVideoGain(video: HTMLVideoElement) {
    let audioContext = new window.AudioContext();
    const source = audioContext.createMediaElementSource(video);
    let gainNode = audioContext.createGain();
    gainNode.gain.value = 1;
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    return {
        gainNode,
        set: (n: number) => { gainNode.gain.value = n },
    };
}