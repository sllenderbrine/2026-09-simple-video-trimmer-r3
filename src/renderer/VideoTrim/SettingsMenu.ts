import { joinPaths } from "../../shared/Utility/FilePathUtility.js";
import { ENCODER_PRESET_SETTINGS } from "../../shared/VideoTrim/UserSettingsUtility.js";
import { ContextMenu } from "../Ui/ContextMenu.js";
import { VideoTrimApp } from "./VideoTrimApp.js";

const PATH_RESOURCES = "..";
const PATH_ICONS = joinPaths(PATH_RESOURCES, "icons");

export class SettingsMenu {
    backdropEl: HTMLDivElement;
    containerEl: HTMLDivElement;
    contentEl: HTMLDivElement;
    constructor(public app: VideoTrimApp) {
        this.backdropEl = document.createElement("div");
        document.body.appendChild(this.backdropEl);
        this.backdropEl.classList.add("sttngs-backdrop");
        this.backdropEl.animate([
            { opacity: "0", },
            { opacity: "1", },
        ], { duration: 100, easing: "ease", });

        this.containerEl = document.createElement("div");
        document.body.appendChild(this.containerEl);
        this.containerEl.classList.add("sttngs");
        this.containerEl.animate([
            { opacity: "0", },
            { opacity: "1", },
        ], { duration: 100, easing: "ease", });

        this.contentEl = document.createElement("div");
        this.containerEl.appendChild(this.contentEl);
        this.contentEl.classList.add("sttngs-content");

        const closeBtnEl = document.createElement("button");
        this.containerEl.appendChild(closeBtnEl);
        closeBtnEl.classList.add("ntf-close-button");
        const closeBtnIconContainer = document.createElement("div");
        closeBtnIconContainer.style.width = "100%";
        closeBtnIconContainer.style.height = "100%";
        closeBtnIconContainer.style.scale = "1.1";
        closeBtnEl.appendChild(closeBtnIconContainer);
        fetch(joinPaths(PATH_ICONS, "cross.svg")).then(res => res.text()).then(text => {
            closeBtnIconContainer.innerHTML = text;
        });
        closeBtnEl.onclick = () => {
            this.app.runAppAction("close-settings");
        }

        let encoderOptions = ENCODER_PRESET_SETTINGS.map(v => {
            return {
                title: v.substring(0, 1).toUpperCase() + v.substring(1),
                onselect: () => {
                    this.app.settings.settings.encoderPreset = v;
                    this.app.settings.save();
                }
            }
        });
        this.createDropdownOption(
            "Encoder Preset",
            this.app.settings.settings.encoderPreset.substring(0, 1).toUpperCase() + this.app.settings.settings.encoderPreset.substring(1),
            encoderOptions,
        );
        this.createDescription("A slower encoder preset improves compression and lowers file sizes but may take drastically longer");
        
        this.createDescription("GPU encoding is not available (coming soon)");
    }

    createDropdownOption(
        title: string,
        selectedValue: string,
        options: { title: string, onselect: () => void }[],
    ) {
        let row = document.createElement("div");
        this.contentEl.appendChild(row);
        row.classList.add("sttngs-row");

        let label = document.createElement("div");
        row.appendChild(label);
        label.classList.add("sttngs-label");
        label.textContent = title;

        let btn = document.createElement("button");
        row.appendChild(btn);
        btn.classList.add("sttngs-dropdown");

        let selectedLabel = document.createElement("div");
        btn.appendChild(selectedLabel);
        selectedLabel.classList.add("sttngs-dropdown-label");
        selectedLabel.textContent = selectedValue;

        let icon = document.createElement("div");
        btn.appendChild(icon);
        icon.classList.add("sttngs-dropdown-icon");
        icon.style.rotate = "180deg";
        icon.style.marginLeft = "8px";

        fetch(joinPaths(PATH_ICONS, "triangle-fill.svg")).then(res => res.text()).then(text => {
            icon.innerHTML = text;
        });

        let menu: ContextMenu | null = null;
        btn.addEventListener("click", e => {
            let rect = btn.getBoundingClientRect();
            if(menu != null) {
                menu.remove();
                menu = null;
                return;
            }
            menu = new ContextMenu(null, rect.left, rect.top + rect.height);
            menu.addLayout(options.map(v => {
                return {
                    title: v.title,
                    data: {
                        title: v.title,
                        onselect: v.onselect,
                    },
                };
            }));
            menu.buttons.forEach(btn => {
                btn.prefixIconEl!.style.width = "12px";
                if(btn.data.title == selectedValue) {
                    btn.containerEl.style.backgroundColor = "rgb(40, 40, 40)";
                }
            })
            menu.clickOffEvent.connect((e) => {
                if(e.target == btn)
                    return;
                if(menu != null) {
                    menu.remove();
                    menu = null;
                }
            }, { owners: [ menu.connectionOwner, ], });
            menu.buttonClickEvent.connect(btn => {
                selectedLabel.textContent = btn.data.title;
                selectedValue = btn.data.title;
                btn.data.onselect();
                if(menu != null) {
                    menu.remove();
                    menu = null;
                }
            }, { owners: [ menu.connectionOwner, ], });
        });
    }

    createDescription(title: string) {
        let row = document.createElement("div");
        this.contentEl.appendChild(row);
        row.classList.add("sttngs-row");
        row.style.marginBottom = "12px";

        let label = document.createElement("div");
        row.appendChild(label);
        label.classList.add("sttngs-label");
        label.textContent = title;
        label.style.opacity = "0.5";
        label.style.fontWeight = "300";
    }

    remove() {
        this.containerEl.remove();
        this.backdropEl.remove();
    }
}