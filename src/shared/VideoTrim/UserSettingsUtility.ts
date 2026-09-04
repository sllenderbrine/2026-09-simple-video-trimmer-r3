export interface Settings {
    recentFolders: string[];
    encoderPreset: EncoderPresetSetting;
}

export const ENCODER_PRESET_SETTINGS = [ "slower", "slow", "medium", "fast", "faster", ];

export type EncoderPresetSetting = typeof ENCODER_PRESET_SETTINGS[number];

export function createSettings(input?: any): Settings {
    if(typeof input !== "object" || input == null || Array.isArray(input))
        input = {};

    const result: Settings = {
        recentFolders: [],
        encoderPreset: "medium",
    };
    
    if(Array.isArray(input.recentFolders)) {
        input.recentFolders.forEach((v: any) => {
            if(typeof v === "string")
                result.recentFolders!.push(v);
        });
    }

    if(ENCODER_PRESET_SETTINGS.includes(input.encoderPreset)) {
        result.encoderPreset = input.encoderPreset;
    }

    return result;
}

export function addRecentFolder(settings: Settings, dir: string) {
    let duplicateIndex = settings.recentFolders.indexOf(dir);
    if(duplicateIndex != -1) {
        settings.recentFolders.splice(duplicateIndex, 1);
        settings.recentFolders.unshift(dir);
        return;
    }
    settings.recentFolders.unshift(dir);
    while(settings.recentFolders.length > 6)
        settings.recentFolders.pop();
}