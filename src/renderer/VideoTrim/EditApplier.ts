import { Signal } from "../../shared/EventSignals/Signal.js";
import { delay } from "../../shared/Utility/PromiseUtility.js";
import { ActiveNotification, NotificationIconType } from "../Ui/NotificationSystem.js";
import { VideoTrimApp } from "./VideoTrimApp.js";

export interface VideoEditOptions {
    path: string;
    renameTo: string;
    cropLeft: number;
    cropRight: number;
    cropTop: number;
    cropBottom: number;
    trimStart: number;
    trimEnd: number;
    saveAsNew?: boolean;
}

export class EditApplier {
    queuedEdits: VideoEditOptions[] = [];
    editLoadingNotif: ActiveNotification | null = null;
    editQueuedNotif: ActiveNotification | null = null;
    private _running = false;
    pathsInUse: string[] = [];
    editQueuedEvent = new Signal<[options: VideoEditOptions]>();
    editStartedEvent = new Signal<[options: VideoEditOptions]>();
    editEndedEvent = new Signal<[options: VideoEditOptions, res: Awaited<ReturnType<typeof window.videoEditApi.editAndApply>>]>();
    constructor(
        public app: VideoTrimApp,
    ) {
        window.videoEditApi.onProgress(progress => {
            if(this.editLoadingNotif == null)
                return;
            const progressEl = this.editLoadingNotif.descriptionEl.querySelector(".edit-loading-progress");
            if(progressEl == null)
                return;
            progressEl.textContent = `Editing ${Math.round(progress * 100)}%`
        });
    }

    async queueEdit(options: VideoEditOptions) {
        this.queuedEdits.push(options);

        if(this.queuedEdits.length >= 1) {
            if(this.editQueuedNotif == null) {
                this.editQueuedNotif = this.app.notificationSystem.sendActiveNotification({
                    canClose: false,
                });
            }
            this.editQueuedNotif.setIconType(NotificationIconType.INFO);
            this.editQueuedNotif.setTitle(`Edits Queued`);
            this.editQueuedNotif.setDescription(`${this.queuedEdits.length} ${this.queuedEdits.length == 1 ? "edit" : "edits"} queued...`);
        }

        if(!options.saveAsNew)
            this.pathsInUse.push(options.path);
        this.editQueuedEvent.fire(options);

        let details = this.app.notificationSystem.sendNotificationDetails(
            `Edit Started`, `Edit begun for ${options.path}. Rename to: ${options.renameTo}. Trim [${options.trimStart}, ${options.trimEnd}]. Save as new?: ${options.saveAsNew ?? false}. Preset: ${this.app.settings.settings.encoderPreset}`
        );

        while(this._running || this.queuedEdits[0] != options) {
            await delay(500);
        }
        
        this._running = true;
        this.queuedEdits.shift();

        this.editStartedEvent.fire(options);

        if(this.editLoadingNotif == null) {
            this.editLoadingNotif = this.app.notificationSystem.sendActiveNotification({
                canClose: false,
            });
        }
        this.editLoadingNotif.setIconType(NotificationIconType.LOADING);
        this.editLoadingNotif.setTitle("Applying Edits...");
        if(options.saveAsNew) {
            this.editLoadingNotif.setDescription(`Editing ${options.path} as new "${options.renameTo}"`);
        } else {
            this.editLoadingNotif.setDescription(`Editing ${options.path} -> ${options.renameTo}`);
        }
        this.editLoadingNotif.addViewDetailsLink(details);
        this.editLoadingNotif.descriptionEl.appendChild(document.createElement("br"));
        const progressEl = document.createElement("div");
        progressEl.style.color = "rgb(185, 185, 185)";
        this.editLoadingNotif.descriptionEl.appendChild(progressEl);
        progressEl.classList.add("edit-loading-progress");
        progressEl.textContent = "Editing 0%";

        if(this.queuedEdits.length === 0 && this.editQueuedNotif != null) {
            this.editQueuedNotif.remove();
            this.editQueuedNotif = null;
        } else {
            this.editQueuedNotif?.setDescription(`${this.queuedEdits.length} ${this.queuedEdits.length == 1 ? "edit" : "edits"} queued...`);
        }

        const res = options.saveAsNew ? (await window.videoEditApi.editNewVideo(
            options.path,
            options.trimStart,
            options.trimEnd,
            options.cropLeft,
            options.cropRight,
            options.cropTop,
            options.cropBottom,
            this.app.settings.settings.encoderPreset,
            options.renameTo,
        )) : (await window.videoEditApi.editAndApply(
            options.path,
            options.trimStart,
            options.trimEnd,
            options.cropLeft,
            options.cropRight,
            options.cropTop,
            options.cropBottom,
            this.app.settings.settings.encoderPreset,
            options.renameTo,
        ));

        if(res.success) {
            let notif = this.app.notificationSystem.sendActiveNotification({
                title: "Saved Successfully",
                iconType: NotificationIconType.CHECK,
                description: res.value.outputPath,
                detailedTitle: "Saved Edits",
                detailedDescription: `Saved edits to ${res.value.outputPath}`,
                timeout: 20,
            });
        } else {
            let notif = this.app.notificationSystem.sendActiveNotification({
                title: "Error Saving",
                iconType: NotificationIconType.ERROR,
                description: res.error.message,
                detailedTitle: "Edits Failed",
                detailedDescription: `${res.error.message}`,
            });

            const bold = document.createElement("b");
            bold.style.filter = "brightness(110%)";
            bold.textContent = options.path + " ";
            notif.descriptionEl.prepend(bold);
            bold.after(document.createElement("br"));
        }

        if(this.queuedEdits.length == 0 && this.editLoadingNotif != null) {
            this.editLoadingNotif.remove();
            this.editLoadingNotif = null;
        }
        
        const pathInUseIndex = this.pathsInUse.indexOf(options.path);
        if(pathInUseIndex != -1) {
            this.pathsInUse.splice(pathInUseIndex, 1);
        }

        this._running = false;

        this.editEndedEvent.fire(options, res);
    }

    hasActiveEdits() {
        return this.queuedEdits.length !== 0 || this._running;
    }
}