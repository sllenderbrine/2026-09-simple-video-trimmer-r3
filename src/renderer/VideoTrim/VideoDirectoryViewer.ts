import { ConnectionOwner } from "../../shared/EventSignals/ConnectionOwner.js";
import { HtmlConnection } from "../../shared/EventSignals/HtmlConnection.js";
import { Signal } from "../../shared/EventSignals/Signal.js";
import { shuffleInPlace } from "../../shared/Utility/ArrayUtility.js";
import { pmod } from "../../shared/Utility/MathUtility.js";
import { delay } from "../../shared/Utility/PromiseUtility.js";
import { formatFileSize, formatVideoDuration } from "../../shared/Utility/StringUtility.js";
import { maintainAspectCropCover, maintainAspectFitCover } from "../../shared/Utility/UiUtility.js";
import { loadVideo, loadVideoMetadata, seekVideo, unloadVideo } from "../../shared/Utility/VideoUtility.js";
import { CustomScrollbar } from "../Ui/CustomScrollbar.js";
import { NotificationIconType, NotificationSystem } from "../Ui/NotificationSystem.js";
import type { VideoTrimApp } from "./VideoTrimApp.js";

let allMetadataLoaded = false;
let metadataCompleteCount = 0;
let allThumbnailsLoaded = false;
let thumbnailCompleteCount = 0;

let thumbCachePath: string = "";
let cachedThumbs: { [key: string]: string } = {};

let rebuildLoaderVideosArraysEvent = new Signal();

function clearThumbCache() {
    for(const key in cachedThumbs) {
        const url = cachedThumbs[key]!;
        URL.revokeObjectURL(url);
    }
    cachedThumbs = {};
}

function clearThumbCacheForVideo(path: string) {
    let url = cachedThumbs[path];
    if(url == null)
        return;
    URL.revokeObjectURL(url);
    delete cachedThumbs[path];
}

async function waitUntilVdvVisible(vdv: VideoDirectoryViewer) {
    while(!vdv.visible)
        await delay(50);
}

async function startMetadataLoader(vdv: VideoDirectoryViewer) {
    const video = document.createElement("video");
    let videosArr = vdv.videos.filter(video =>
        video.containerEl.style.display !== "none"
    );
    rebuildLoaderVideosArraysEvent.connect(() => {
        videosArr = vdv.videos.filter(video =>
            video.containerEl.style.display !== "none"
        );
    }, { owners: null, });
    const getIndex = (content: HTMLDivElement) => {
        let rect = content.getBoundingClientRect();
        let gridWidth = Math.floor(rect.width / 160);
        let index = pmod(Math.floor(content.scrollTop / 120) * gridWidth, videosArr.length);
        if(!Number.isFinite(index))
            index = 0;
        return index;
    }
    const loadNextMetadata = async () => {
        const content = vdv.contentEl;
        if(content == null)
            return;
        let index = getIndex(content);
        let completeCount = 0;
        while(completeCount < videosArr.length && videosArr[index]!.hasMetadata) {
            index = pmod(index + 1, videosArr.length);
            completeCount++;
        }
        if(completeCount >= videosArr.length) {
            allMetadataLoaded = true;
            vdv.progressEl.style.opacity = "0";
            vdv.progressEl.animate([
                { opacity: "1", },
                { opacity: "1", },
                { opacity: "1", },
                { opacity: "0", },
            ], { duration: 700, easing: "ease-out" });
            return;
        }
        const fileView = videosArr[index]!;
        fileView.hasMetadata = true;
        metadataCompleteCount++;
        vdv.progressValueEl.getAnimations().forEach(anim => anim.cancel());
        vdv.progressValueEl.style.width = (metadataCompleteCount / videosArr.length * 100) + "%";

        const success_src = await loadVideoMetadata(video, fileView.path);
        if(!success_src)
            return;
        
        fileView.duration = video.duration;

        const durationEl = document.createElement("div");
        fileView.contentEl.appendChild(durationEl);
        durationEl.classList.add("vdv-video-duration");
        durationEl.textContent = "0:00";

        durationEl.textContent = formatVideoDuration(video.duration);

        unloadVideo(video);
    }
    while(true) {
        while(!allMetadataLoaded) {
            await waitUntilVdvVisible(vdv);
            await loadNextMetadata();
            await delay(1);
        }
        await delay(500);
    }
}

async function startThumbnailLoader(vdv: VideoDirectoryViewer) {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    canvas.width = 220;
    canvas.height = 100;
    // canvas.width = 280;
    // canvas.height = 200;
    const ctx = canvas.getContext("2d");
    if(ctx == null) {
        const notif = vdv.app.notificationSystem.sendActiveNotification({
            title: "Error",
            iconType: NotificationIconType.ERROR,
            description: "CanvasRenderingContext2D not supported",
            detailedTitle: "Error",
            detailedDescription: "Error starting thumbnail loader: CanvasRenderingContext2D not supported"
        });
        throw new Error("CanvasRenderingContext2D not supported");
    }
    let videosArr = vdv.videos.filter(video =>
        video.containerEl.style.display !== "none"
    );
    rebuildLoaderVideosArraysEvent.connect(() => {
        videosArr = vdv.videos.filter(video =>
            video.containerEl.style.display !== "none"
        );
    }, { owners: null, });
    const getIndex = (content: HTMLDivElement) => {
        let rect = content.getBoundingClientRect();
        let gridWidth = Math.floor(rect.width / 160);
        let index = pmod(Math.floor(content.scrollTop / 120) * gridWidth, videosArr.length);
        if(!Number.isFinite(index))
            index = 0;
        return index;
    }
    const loadNextThumbnail = async () => {
        const content = vdv.contentEl;
        if(content == null)
            return;
        let index = getIndex(content);
        let completeCount = 0;
        while(completeCount < videosArr.length && videosArr[index]!.hasThumbnail) {
            index = pmod(index + 1, videosArr.length);
            completeCount++;
        }
        if(completeCount >= videosArr.length) {
            allThumbnailsLoaded = true;
            return;
        }
        const fileView = videosArr[index]!;
        fileView.hasThumbnail = true;
        thumbnailCompleteCount++;

        const img = document.createElement("img");
        fileView.containerEl.appendChild(img);
        img.classList.add("vdv-video-thumbnail");
        fileView.thumbnailEl = img;
        img.style.display = "none";
        img.style.width = "calc(100% - 20px)";
        img.style.height = "calc(100% - 20px)";
        img.style.objectFit = "cover";
        // img.style.width = "140px";
        // img.style.height = "100px";

        let cachedUrl = cachedThumbs[fileView.path];
        if(cachedUrl != null) {
            img.onload = () => {
                img.style.display = "block";
            }
            img.src = cachedUrl;
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        unloadVideo(video);
        const success_src = await loadVideo(video, fileView.path);
        if(!success_src) {
            img.remove();
            return;
        }
        await seekVideo(video, 0);

        fileView.duration = video.duration;

        let [ sourceWidth, sourceHeight ] = maintainAspectCropCover(video.videoWidth, video.videoHeight, canvas.width / canvas.height);
        ctx.drawImage(
            video,
            Math.floor((video.videoWidth - sourceWidth) / 2),
            Math.floor((video.videoHeight - sourceHeight) / 2),
            Math.floor(sourceWidth),
            Math.floor(sourceHeight),
            0, 0, canvas.width, canvas.height
        );
        let url: string | undefined = undefined;
        await new Promise<void>(res => {
            canvas.toBlob(blob => {
                if(blob) {
                    url = URL.createObjectURL(blob);
                    fileView.thumbnailUrl = url;
                    cachedThumbs[fileView.path] = url;
                }
                res();
            });
        });
        if(!url) {
            return;
        }

        img.onload = () => {
            img.style.display = "block";
        }
        img.src = url;
    }
    while(true) {
        while(!allThumbnailsLoaded) {
            await waitUntilVdvVisible(vdv);
            await loadNextThumbnail();
            if(vdv.sortMethod == VdvSortMethod.DURATION_LONG || vdv.sortMethod == VdvSortMethod.DURATION_SHORT)
                vdv.updateVideoSort();
            await delay(1);
        }
        await delay(500);
    }
}

export class VdvVideo {
    containerEl: HTMLDivElement;
    contentEl: HTMLDivElement;
    thumbnailEl?: HTMLImageElement;
    thumbnailUrl?: string = "";
    titleEl: HTMLDivElement;
    duration?: number;
    hasThumbnail: boolean = false;
    hasMetadata: boolean = false;
    constructor(
        public title: string,
        public path: string,
        public dateModified: number,
        public sizeBytes: number,
    ) {
        this.containerEl = document.createElement("div");
        this.containerEl.classList.add("vdv-video-container");

        this.containerEl.title = `${title} - ${formatFileSize(sizeBytes)}`;

        this.contentEl = document.createElement("div");
        this.containerEl.appendChild(this.contentEl);
        this.contentEl.classList.add("vdv-video-content");

        this.titleEl = document.createElement("div");
        this.contentEl.appendChild(this.titleEl);
        this.titleEl.classList.add("vdv-video-title");
        this.titleEl.textContent = title;
    }

    isUnnamed() {
        if(this.title.toLowerCase().startsWith("replay "))
            return true;
        if(/\d+-\d+-\d+\s+\d+-\d+-\d+/.test(this.title))
            return true;
        return false;
    }

    setVisible(v: boolean) {
        this.containerEl.style.display = v ? "" : "none";
    }

    remove() {
        this.containerEl.remove();
    }

    deleteThumbnail() {
        this.thumbnailEl?.remove()
        delete this.thumbnailEl;
        delete this.thumbnailUrl;
        this.hasThumbnail = false;
        allThumbnailsLoaded = false;
    }
}

export enum VdvSortMethod {
    DATE_RECENT = 0,
    DATE_OLD = 1,
    NAME_A_Z = 2,
    NAME_Z_A = 3,
    DURATION_LONG = 5,
    DURATION_SHORT = 6,
    SIZE_BIG = 7,
    SIZE_SMALL = 8,
    OTHER_RANDOM = 4,
};

export enum VdvFilter {
    NONE = 0,
    UNNAMED = 1,
}

export class VideoDirectoryViewer {
    containerEl: HTMLDivElement;
    contentEl?: HTMLDivElement;
    progressEl: HTMLDivElement;
    progressValueEl: HTMLDivElement;
    scrollbar?: CustomScrollbar;
    videos: VdvVideo[] = [];
    directory: string = "";
    loaded: boolean = false;
    visible: boolean = true;
    videoCount: number = 0;
    videosTotalSize: number = 0;
    unnamedVideoCount: number = 0;
    unnamedVideosTotalSize: number = 0;
    sortMethod: VdvSortMethod = VdvSortMethod.DATE_RECENT;
    filter: VdvFilter = VdvFilter.NONE;
    videoOpenEvent: Signal<[vdvv: VdvVideo]> = new Signal();
    connectionOwner: ConnectionOwner = new ConnectionOwner();
    constructor(
        public app: VideoTrimApp,
    ) {
        this.containerEl = document.createElement("div");
        this.containerEl.classList.add("vdv-container");

        this.progressEl = document.createElement("div");
        this.containerEl.appendChild(this.progressEl);
        this.progressEl.classList.add("vdv-progress");

        this.progressValueEl = document.createElement("div");
        this.progressEl.appendChild(this.progressValueEl);
        this.progressValueEl.classList.add("vdv-progress-value");

        startThumbnailLoader(this);
        startMetadataLoader(this);
        startMetadataLoader(this);

        this.app.editApplier.editQueuedEvent.connect((options) => {
            this.rebuildLoaderVideoArrays();
            for(let video of this.videos) {
                if(video.path == options.path)
                    this.updateVideoVisibility(video);
            }
        }, { owners: [ this.connectionOwner, ], });

        this.app.editApplier.editEndedEvent.connect((options, res) => {
            this.rebuildLoaderVideoArrays();
            if(res.success) {
                let foundPath = false;
                for(let video of this.videos) {
                    if(video.path == res.value.outputPath) {
                        foundPath = true;
                        this.updateVideoVisibility(video);
                        video.deleteThumbnail();
                        clearThumbCacheForVideo(video.path);
                    }
                }
                if(!foundPath) {
                    this.refresh();
                }
            }
        }, { owners: [ this.connectionOwner, ], });
    }

    updateVideoVisibilities() {
        for(let video of this.videos) {
            this.updateVideoVisibility(video);
        }
    }

    updateVideoSort() {
        switch(this.sortMethod) {
            case VdvSortMethod.DATE_RECENT:
                this.sortVideos((a, b) => {
                    return b.dateModified - a.dateModified;
                });
                break;
            case VdvSortMethod.DATE_OLD:
                this.sortVideos((a, b) => {
                    return a.dateModified - b.dateModified;
                });
                break;
            case VdvSortMethod.NAME_A_Z:
                this.sortVideos((a, b) => {
                    return a.title.localeCompare(b.title);
                });
                break;
            case VdvSortMethod.NAME_Z_A:
                this.sortVideos((a, b) => {
                    return b.title.localeCompare(a.title);
                });
                break;
            case VdvSortMethod.DURATION_LONG:
                this.sortVideos((a, b) => {
                    if(a.duration != null && b.duration == null)
                        return -1;
                    if(a.duration == null && b.duration != null)
                        return 1;
                    if(a.duration == null && b.duration == null)
                        return b.dateModified - a.dateModified;
                    return b.duration! - a.duration!;
                });
                break;
            case VdvSortMethod.DURATION_SHORT:
                this.sortVideos((a, b) => {
                    if(a.duration != null && b.duration == null)
                        return -1;
                    if(a.duration == null && b.duration != null)
                        return 1;
                    if(a.duration == null && b.duration == null)
                        return b.dateModified - a.dateModified;
                    return a.duration! - b.duration!;
                });
                break;
            case VdvSortMethod.SIZE_BIG:
                this.sortVideos((a, b) => {
                    return b.sizeBytes - a.sizeBytes;
                });
                break;
            case VdvSortMethod.SIZE_SMALL:
                this.sortVideos((a, b) => {
                    return a.sizeBytes - b.sizeBytes;
                });
                break;
            case VdvSortMethod.OTHER_RANDOM:
                shuffleInPlace(this.videos);
                this.videos.forEach(video => this.contentEl!.appendChild(video.containerEl));
                this.rebuildLoaderVideoArrays();
                break;
        }
    }

    sortVideos(callback: (a: VdvVideo, b: VdvVideo) => number) {
        if(this.contentEl == null)
            return;
        this.videos.sort((a, b) => {
            return callback(a, b);
        });
        this.videos.forEach(video => this.contentEl!.appendChild(video.containerEl));
        this.rebuildLoaderVideoArrays();
    }

    async refresh() {
        if(!this.loaded)
            return;
        let res = await window.fileApi.getDirectoryFileList(this.directory);
        if(res.success) {
            this.loadVideos(this.directory, res.value);
        } else {
            const notif = this.app.notificationSystem.sendActiveNotification({
                title: "Error",
                iconType: NotificationIconType.ERROR,
                description: "Failed to get directory",
                detailedTitle: "Error",
                detailedDescription: `Failed to get directory: ${this.directory}`,
            });
        }
        this.rebuildLoaderVideoArrays();
    }

    async hardRefresh() {
        clearThumbCache();
        await this.refresh();
    }

    wakeThumbnailAndMetadataLoaders() {
        allThumbnailsLoaded = false;
        allMetadataLoaded = false;
    }

    rebuildLoaderVideoArrays() {
        rebuildLoaderVideosArraysEvent.fire();
    }

    updateVideoVisibility(vdvv: VdvVideo) {
        let visible = true;
        if(this.app.editApplier.pathsInUse.includes(vdvv.path)) {
            visible = false;
        }
        if(this.filter == VdvFilter.UNNAMED && !vdvv.isUnnamed()) {
            visible = false;
        }
        vdvv.setVisible(visible);
    }

    loadVideos(
        directory: string,
        videos: {
            name: string,
            path: string,
            dateModified: number,
            sizeBytes: number,
        }[],
    ) {
        if(directory != thumbCachePath) {
            clearThumbCache();
            thumbCachePath = directory;
        }
        this.unloadVideos();
        this.progressEl.getAnimations().forEach(anim => anim.cancel());
        this.progressEl.style.opacity = "1";
        this.loaded = true;
        allMetadataLoaded = false;
        metadataCompleteCount = 0;
        allThumbnailsLoaded = false;
        thumbnailCompleteCount = 0;
        this.progressValueEl.getAnimations().forEach(anim => anim.cancel());
        this.progressValueEl.style.width = "0px";
        videos = videos.filter(file => {
            const name = file.name.toLowerCase();
            if(name.endsWith(".mp4"))
                return true;
            return false;
        });
        const content = document.createElement("div");
        this.containerEl.appendChild(content);
        content.classList.add("vdv-content");
        this.contentEl = content;
        this.directory = directory;
        this.scrollbar = new CustomScrollbar(content);
        this.containerEl.appendChild(this.scrollbar.containerEl);
        this.scrollbar.containerEl.style.right = "0px";
        this.scrollbar.containerEl.style.top = "0px";
        this.scrollbar.updateHandlePosition();

        this.videoCount = 0;
        this.videosTotalSize = 0;
        this.unnamedVideoCount = 0;
        this.unnamedVideosTotalSize = 0;

        for(let i=0; i<videos.length; i++) {
            const file = videos[i]!;
            let vdvv = new VdvVideo(file.name, file.path, file.dateModified, file.sizeBytes);
            content.appendChild(vdvv.containerEl);
            this.videos.push(vdvv);
            vdvv.contentEl.addEventListener("click", () => {
                this.videoOpenEvent.fire(vdvv);
            });
            this.updateVideoVisibility(vdvv);
            this.videoCount++;
            this.videosTotalSize += vdvv.sizeBytes;
            if(vdvv.isUnnamed()) {
                this.unnamedVideoCount++;
                this.unnamedVideosTotalSize += vdvv.sizeBytes;
            }
        }

        this.updateVideoSort();
    }

    unloadVideos() {
        if(this.contentEl) {
            this.contentEl.remove();
            delete this.contentEl;
        }
        if(this.scrollbar) {
            this.scrollbar.remove();
            delete this.scrollbar;
        }
        this.loaded = false;
        this.videos.forEach(video => video.remove());
        this.videos = [];
        if(!allMetadataLoaded) {
            this.progressEl.style.opacity = "0";
            this.progressEl.animate([
                { opacity: "1", },
                { opacity: "1", },
                { opacity: "1", },
                { opacity: "0", },
            ], { duration: 700, easing: "ease-out", });
        }
        this.rebuildLoaderVideoArrays();
    }

    setVisible(v: boolean) {
        if(v) {
            this.visible = true;
            this.containerEl.style.display = "flex";
        } else {
            this.visible = false;
            this.containerEl.style.display = "none";
        }
    }
}