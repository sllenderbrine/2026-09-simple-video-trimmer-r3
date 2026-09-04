import { clamp, pmod } from "./MathUtility.js";

export function clipEllipses(str: string, maxLength: number) {
    if(str.length <= maxLength) {
        return str;
    }
    return str.substring(0, maxLength) + "...";
}

export function clipStartEllipses(str: string, maxLength: number) {
    if(str.length <= maxLength) {
        return str;
    }
    return "..." + str.substring(str.length - maxLength, str.length);
}

export function trimEveryLine(str: string) {
    return str.split("\n").map(v => v.trim()).join("\n");
}

export function formatVideoDuration(duration: number) {
    duration = Math.floor(duration);
    let hours = Math.floor(duration / 60 / 60);
    let minutes = pmod(Math.floor(duration / 60), 60);
    let seconds = pmod(duration, 60);
    if(hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    } else {
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }
}

export function formatVideoDurationPrecise(duration: number) {
    let hours = Math.floor(duration / 60 / 60);
    let minutes = pmod(Math.floor(duration / 60), 60);
    let seconds = pmod(Math.floor(duration), 60);
    let ms = Math.floor(duration * 1000) % 1000;
    if(hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}:${ms.toString().padStart(3, "0")}`;
    } else {
        return `${minutes}:${seconds.toString().padStart(2, "0")}:${ms.toString().padStart(3, "0")}`;
    }
}

const FILE_SIZE_SUFFIXES = [ "B", "KB", "MB", "GB", "TB" ];
export function formatFileSize(sizeBytes: number) {
    let precision = clamp(Math.floor(Math.log10(sizeBytes) / 3), 0, 4);
    let d = Math.pow(1000, precision);
    let value = Math.floor(sizeBytes / d * 10) / 10;
    return value + " " + FILE_SIZE_SUFFIXES[precision]!;
}