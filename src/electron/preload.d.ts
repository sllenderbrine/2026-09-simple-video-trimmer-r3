import { ErrorMessageResult } from "../shared/Utility/PromiseUtility.js";
import { Settings } from "../shared/VideoTrim/UserSettingsUtility.js";

export {};

declare global {
    interface Window {
        windowApi: {
            close: () => void;
            minimize: () => void;
            maximize: () => void;
            move: (dx: number, dy: number) => void;
        };
        fileApi: {
            getDirectoryFileList: (dirPath: string) => Promise<Result<{
                path: string,
                name: string,
                dateModified: number,
                sizeBytes: number,
            }[], {
                message: string
            }>>;
            promptChooseDirectory: () => Promise<string | null>;
        };
        videoEditApi: {
            editAndApply: (
                originalVideoPath: string,
                trimStart: number,
                trimEnd: number,
                cropLeft: number,
                cropRight: number,
                cropTop: number,
                cropBottom: number,
                encoderPreset: EncoderPresetSetting,
                name?: string
            ) => Promise<ErrorMessageResult<{
                outputPath: string,
            }>>;
            editNewVideo: (
                originalVideoPath: string,
                trimStart: number,
                trimEnd: number,
                cropLeft: number,
                cropRight: number,
                cropTop: number,
                cropBottom: number,
                encoderPreset: EncoderPresetSetting,
                name: string
            ) => Promise<ErrorMessageResult<{
                outputPath: string,
            }>>;
            promptSaveLocation: (originalName: string) => Promise<ErrorMessageResult<{
                name: string,
            }>>;
            onProgress: (
                callback: (progress: number) => void
            ) => () => void;
        };
        redirectApi: {
            openGithubRepo: () => void;
            openGithubRepoReleases: () => void;
        };
        settingsApi: {
            load: () => Promise<ErrorMessageResult<Settings>>;
            save: (settings: Settings) => Promise<ErrorMessageResult<undefined>>;
        };
        screenshotApi: {
            saveAndCopy: (pngDataUrl: string) => Promise<ErrorMessageResult<{
                path: string;
            }>>;
        };
    }
}
