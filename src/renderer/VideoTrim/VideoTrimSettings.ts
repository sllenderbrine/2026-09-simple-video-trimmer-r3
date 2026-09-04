import { ObservedValue } from "../../shared/EventSignals/ObservedValue.js";
import { BusyProcess } from "../../shared/Utility/UiUtility.js";
import { createSettings, Settings } from "../../shared/VideoTrim/UserSettingsUtility.js";
import { NotificationIconType } from "../Ui/NotificationSystem.js";
import { VideoTrimApp } from "./VideoTrimApp.js";

export class VideoTrimSettings {
    settings: Settings = createSettings();
    loaded = new ObservedValue(false);
    _saving = new BusyProcess<void>();
    constructor(
        public app: VideoTrimApp,
    ) {
        window.settingsApi.load().then(res => {
            if(res.success) {
                this.settings = res.value;
                this.app.startupMenu.updateRecents();
                this.loaded.set(true);
            } else {
                this.app.notificationSystem.sendActiveNotification({
                    title: "Error",
                    iconType: NotificationIconType.ERROR,
                    description: "Error loading settings.json",
                });
            }
        });
    }

    async save() {
        if(!(await this._saving.waitForTurn()))
            return;
        if(!this.loaded.get())
            return;
        this._saving.setActive(true);
        await window.settingsApi.save(this.settings);
        this._saving.setActive(false);
    }
}