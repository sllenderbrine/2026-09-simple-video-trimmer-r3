import path from "path";
import { ErrorMessageResult } from "../shared/Utility/PromiseUtility.js";
import fsPromises from "node:fs/promises";
import { app } from "electron";
import { createSettings, Settings } from "../shared/VideoTrim/UserSettingsUtility.js";

const SETTINGS_FILE = "settings.json";

export function getSettingsPath(): string {
    return path.join(app.getPath("userData"), SETTINGS_FILE);
}

export async function loadSettings(): Promise<ErrorMessageResult<Settings>> {
    try {
        const text = await fsPromises.readFile(getSettingsPath(), "utf8");
        const json = JSON.parse(text);
        return {
            success: true,
            value: createSettings(json),
        }
    } catch(error) {
        if(error instanceof Error) {
            if((error as any).code === "ENOENT") {
                // settings file does not exist yet, return defaults
                return {
                    success: true,
                    value: createSettings(),
                };
            }
            return {
                success: false,
                error: { message: `Error loading settings: ${error.message}` },
            };
        }
        return {
            success: false,
            error: { message: `Error loading settings: An unknown error occurred` },
        };
    }
}

export async function saveSettings(settings: Settings): Promise<ErrorMessageResult<undefined>> {
    try {
        await fsPromises.writeFile(
            getSettingsPath(),
            JSON.stringify(settings, null, 4),
            "utf8"
        );
        return {
            success: true,
            value: undefined,
        };
    } catch(error) {
        if(error instanceof Error) {
            return {
                success: false,
                error: { message: `Error saving settings: ${error.message}` },
            };
        }
        return {
            success: false,
            error: { message: `Error saving settings: An unknown error occurred` },
        };
    }
}